-- MugoX Lingo schema for plain Postgres (Neon). All access goes through server code, which always filters by the signed-in user's id.

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and char_length(email) between 3 and 254),
  password_hash text not null,
  display_name text check (display_name is null or char_length(display_name) <= 50),
  interface_locale text not null default 'en' check (interface_locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$'),
  current_course_id text check (current_course_id is null or char_length(current_course_id) <= 40),
  xp_total integer not null default 0 check (xp_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index users_email_key on users (email);

-- Only a SHA-256 hash of each session token is stored, so a database leak does not leak usable sessions.
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index sessions_user_idx on sessions (user_id);
create index sessions_expiry_idx on sessions (expires_at);

-- Failed logins and signups per hashed email / IP, used for rate limiting that works across serverless instances.
create table auth_attempts (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('login', 'signup')),
  key_hash text not null,
  at timestamptz not null default now()
);
create index auth_attempts_key_idx on auth_attempts (kind, key_hash, at);

create table user_streaks (
  user_id uuid primary key references users(id) on delete cascade,
  current_count integer not null default 0 check (current_count >= 0),
  last_day date,
  updated_at timestamptz not null default now()
);

create table lesson_completions (
  id bigint generated always as identity primary key,
  user_id uuid not null references users(id) on delete cascade,
  attempt_id text not null check (char_length(attempt_id) between 8 and 80),
  course_id text not null,
  lesson_id text not null,
  first_try_correct integer not null check (first_try_correct >= 0),
  total integer not null check (total > 0),
  day date not null,
  created_at timestamptz not null default now(),
  unique (user_id, attempt_id),
  check (first_try_correct <= total)
);
create index lesson_completions_user_day_idx on lesson_completions (user_id, day);

create table user_lesson_progress (
  user_id uuid not null references users(id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  times integer not null default 1 check (times >= 1),
  best_correct integer not null check (best_correct >= 0),
  best_total integer not null check (best_total > 0),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index user_lesson_progress_course_idx on user_lesson_progress (user_id, course_id);

create table xp_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references users(id) on delete cascade,
  attempt_id text not null,
  amount integer not null check (amount >= 0),
  day date not null,
  created_at timestamptz not null default now(),
  unique (user_id, attempt_id)
);
create index xp_ledger_user_day_idx on xp_ledger (user_id, day);

create table user_achievements (
  user_id uuid not null references users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table exam_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references users(id) on delete cascade,
  course_id text not null,
  unit_id text not null,
  seed text not null check (seed ~ '^[A-Za-z0-9-]{8,64}$'),
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  percent integer not null check (percent between 0 and 100),
  passed boolean not null,
  duration_seconds integer not null check (duration_seconds between 0 and 86400),
  created_at timestamptz not null default now(),
  unique (user_id, seed),
  check (score <= total)
);
create index exam_attempts_user_unit_idx on exam_attempts (user_id, unit_id);

create function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger users_touch before update on users for each row execute function touch_updated_at();

create function create_streak_row() returns trigger language plpgsql as $$
begin insert into user_streaks (user_id) values (new.id); return new; end $$;
create trigger users_streak after insert on users for each row execute function create_streak_row();

-- Atomic, idempotent reward recording. One statement = one transaction; a repeated (user, attempt) pair is a no-op.
create function record_lesson_completion(
  p_user uuid, p_attempt text, p_course text, p_lesson text,
  p_correct integer, p_total integer, p_xp integer, p_day date,
  p_streak integer, p_badges text[]
) returns jsonb language plpgsql as $$
declare v_rows integer;
begin
  insert into lesson_completions (user_id, attempt_id, course_id, lesson_id, first_try_correct, total, day)
  values (p_user, p_attempt, p_course, p_lesson, p_correct, p_total, p_day)
  on conflict (user_id, attempt_id) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then return jsonb_build_object('duplicate', true); end if;

  insert into xp_ledger (user_id, attempt_id, amount, day) values (p_user, p_attempt, p_xp, p_day);

  insert into user_lesson_progress (user_id, course_id, lesson_id, best_correct, best_total)
  values (p_user, p_course, p_lesson, p_correct, p_total)
  on conflict (user_id, lesson_id) do update set
    times = user_lesson_progress.times + 1,
    best_correct = greatest(user_lesson_progress.best_correct, excluded.best_correct),
    best_total = excluded.best_total, updated_at = now();

  if p_streak is not null then
    update user_streaks set current_count = p_streak, last_day = p_day, updated_at = now() where user_id = p_user;
  end if;

  insert into user_achievements (user_id, badge_id)
  select p_user, b from unnest(coalesce(p_badges, '{}')) as b on conflict do nothing;

  update users set xp_total = xp_total + p_xp where id = p_user;
  return jsonb_build_object('duplicate', false);
end $$;

create function record_exam_attempt(
  p_user uuid, p_course text, p_unit text, p_seed text,
  p_score integer, p_total integer, p_percent integer, p_passed boolean, p_duration integer
) returns jsonb language plpgsql as $$
declare v_rows integer; v_new_badge boolean := false;
begin
  insert into exam_attempts (user_id, course_id, unit_id, seed, score, total, percent, passed, duration_seconds)
  values (p_user, p_course, p_unit, p_seed, p_score, p_total, p_percent, p_passed, p_duration)
  on conflict (user_id, seed) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then return jsonb_build_object('duplicate', true, 'new_badge', false); end if;
  if p_passed then
    insert into user_achievements (user_id, badge_id) values (p_user, 'exam_pass') on conflict do nothing;
    get diagnostics v_rows = row_count;
    v_new_badge := v_rows > 0;
  end if;
  return jsonb_build_object('duplicate', false, 'new_badge', v_new_badge);
end $$;
