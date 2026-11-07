import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

const N = 2 ** 15, R = 8, P = 1, KEYLEN = 64, MAXMEM = 96 * 1024 * 1024;
const derive = (pw: string, salt: Buffer, n: number, r: number, p: number) =>
  new Promise<Buffer>((resolve, reject) => scrypt(pw.normalize("NFKC"), salt, KEYLEN, { N: n, r, p, maxmem: MAXMEM } as ScryptOptions, (e, k) => (e ? reject(e) : resolve(k))));

/** scrypt with a random salt. Format: scrypt$N$r$p$salt$hash (all parameters travel with the hash so they can be raised later). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, salt, hash] = stored.split("$");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const [nn, rr, pp] = [Number(n), Number(r), Number(p)];
  if (![nn, rr, pp].every(Number.isInteger) || nn > 2 ** 17 || nn < 2 ** 10 || rr > 16 || pp > 4) return false;
  try {
    const expected = Buffer.from(hash, "base64url");
    const actual = await derive(password, Buffer.from(salt, "base64url"), nn, rr, pp);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}

/** A real hash to compare against when the email is unknown, so a missing account costs the same time as a wrong password. */
export const DUMMY_HASH = "scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
