import { ClientSecretCredential, DefaultAzureCredential, type TokenCredential } from "@azure/identity";

export function createSqlCredential(env: NodeJS.ProcessEnv = process.env): TokenCredential {
  const tenantId = env.AZURE_TENANT_ID?.trim();
  const clientId = env.AZURE_CLIENT_ID?.trim();
  const clientSecret = env.AZURE_CLIENT_SECRET?.trim();
  if (tenantId && clientId && clientSecret) {
    return new ClientSecretCredential(tenantId, clientId, clientSecret);
  }
  return new DefaultAzureCredential();
}
