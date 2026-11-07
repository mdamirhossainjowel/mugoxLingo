import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <p aria-hidden className="font-display text-8xl font-extrabold text-mango">404</p>
      <h1 className="font-display text-3xl font-extrabold">We could not find that page · পেজটি পাওয়া যায়নি</h1>
      <Link href="/en" className="rounded-full bg-mango px-8 py-3 font-display text-xl font-bold shadow-[0_6px_0_var(--color-mango-deep)]">Home · হোম</Link>
    </main>);
}
