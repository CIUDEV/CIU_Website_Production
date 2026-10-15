export const DEFAULT_SQL_API_ORIGIN = "https://ciu-beta.vercel.app";

export function resolveSqlApiOrigin(env: NodeJS.ProcessEnv = process.env) {
  if (env.SQL_API_ORIGIN === "") return "";
  return env.SQL_API_ORIGIN?.trim().replace(/\/$/, "") ?? "";
}

export function sqlApiRewrites(origin: string) {
  const host = origin.trim().replace(/\/$/, "");
  if (!host) return [];
  return [
    {
      source: "/api/:path*",
      destination: `${host}/api/:path*`,
    },
  ];
}
