import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity";
import { describe, expect, it } from "vitest";
import { applyProcessEnvFromBindings } from "@backend/cloudflare-runtime-env";
import { createSqlCredential } from "@backend/db/sql-credential";

describe("SQL credential", () => {
  it("uses the Entra app secret when tenant, client, and secret are set", () => {
    const credential = createSqlCredential({
      AZURE_TENANT_ID: "tenant",
      AZURE_CLIENT_ID: "client",
      AZURE_CLIENT_SECRET: "secret",
    } as NodeJS.ProcessEnv);
    expect(credential).toBeInstanceOf(ClientSecretCredential);
  });

  it("falls back to DefaultAzureCredential without a client secret", () => {
    const credential = createSqlCredential({
      AZURE_TENANT_ID: "tenant",
      AZURE_CLIENT_ID: "client",
    } as NodeJS.ProcessEnv);
    expect(credential).toBeInstanceOf(DefaultAzureCredential);
  });
});

describe("Cloudflare runtime env", () => {
  it("copies string bindings into process.env without replacing existing values", () => {
    const key = "CIU_TEST_CF_ENV";
    const previous = process.env[key];
    delete process.env[key];
    applyProcessEnvFromBindings({
      [key]: "from-worker",
      ASSETS: { fetch() {} },
    });
    expect(process.env[key]).toBe("from-worker");
    applyProcessEnvFromBindings({ [key]: "ignored" });
    expect(process.env[key]).toBe("from-worker");
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  });
});
