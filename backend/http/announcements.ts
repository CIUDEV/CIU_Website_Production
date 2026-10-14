import { NextResponse } from "next/server";
import { getPortalBackend } from "@backend/stores/backend";

export async function listActiveAnnouncements() {
  const items = await getPortalBackend().listAnnouncements();
  return items.filter((item) => item.active);
}

export async function GET() {
  const items = await listActiveAnnouncements();
  return NextResponse.json(items, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
