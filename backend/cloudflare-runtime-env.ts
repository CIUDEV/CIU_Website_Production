const copied = new Set<string>();

export function applyProcessEnvFromBindings(env: Record<string, unknown> | null | undefined) {
  if (!env) return;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value !== "string" || !value || copied.has(key)) continue;
    if (!process.env[key]) process.env[key] = value;
    copied.add(key);
  }
}

export async function applyCloudflareRuntimeEnv() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    applyProcessEnvFromBindings(context?.env as Record<string, unknown> | undefined);
  } catch {
    // Vercel and local Node do not have a Cloudflare request context.
  }
}
