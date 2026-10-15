import { describe, expect, it } from "vitest";
import { resolveSqlApiOrigin, sqlApiRewrites } from "@backend/http/sql-api-origin";

describe("SQL API origin", () => {
  it("rewrites every /api path to the Node origin", () => {
    expect(sqlApiRewrites("https://ciu-beta.vercel.app")).toEqual([
      {
        source: "/api/:path*",
        destination: "https://ciu-beta.vercel.app/api/:path*",
      },
    ]);
  });

  it("does not rewrite when the origin is empty", () => {
    expect(resolveSqlApiOrigin({ SQL_API_ORIGIN: "" } as NodeJS.ProcessEnv)).toBe("");
    expect(sqlApiRewrites("")).toEqual([]);
  });
});
