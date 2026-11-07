export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center">
      <span className="size-14 animate-bounce rounded-full bg-mango motion-reduce:animate-none" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>);
}
