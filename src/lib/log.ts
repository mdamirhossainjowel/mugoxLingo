/** Logs a failure with its error code and a short message. Never logs request bodies, passwords or emails. */
export function logFail(where: string, e: unknown) {
  const code = (e as { code?: string })?.code ?? "";
  console.error(`${where} failed:`, code, String((e as Error)?.message ?? e).slice(0, 160));
}
