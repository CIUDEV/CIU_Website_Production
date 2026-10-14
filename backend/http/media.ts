import { NextResponse } from "next/server";
import { getBlobServiceClient } from "@backend/blob/upload";
import { isBlobStorageConfigured } from "@backend/env";
import { isBlobFolder } from "@shared/blob-image";

type Context = { params: Promise<{ folder: string; name: string }> };

export async function GET(_request: Request, { params }: Context) {
  if (!isBlobStorageConfigured()) {
    return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
  }

  const { folder, name } = await params;
  const blobName = decodeURIComponent(name ?? "");
  if (!isBlobFolder(folder) || !blobName || blobName.includes("..") || blobName.includes("/")) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  try {
    const blob = getBlobServiceClient().service.getContainerClient(folder).getBlockBlobClient(blobName);
    if (!(await blob.exists())) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }
    const downloaded = await blob.downloadToBuffer();
    const properties = await blob.getProperties();
    return new NextResponse(new Uint8Array(downloaded), {
      headers: {
        "Content-Type": properties.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
