// Open the dev server from a phone or another computer: set NEXT_DEV_ORIGINS=192.168.0.79 (comma separated) in .env.local.
const devOrigins = (process.env.NEXT_DEV_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export default {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["pg"],
  async redirects() { return [{ source: "/", destination: "/en", permanent: false }]; },
  ...(devOrigins.length ? { allowedDevOrigins: devOrigins } : {}),
};
