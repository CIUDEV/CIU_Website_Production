import { BlobServiceClient } from "@azure/storage-blob";
import type { TokenCredential } from "@azure/identity";
import { applyCloudflareRuntimeEnv } from "@backend/cloudflare-runtime-env";
import { createSqlCredential } from "@backend/db/sql-credential";
import { blobStorageEndpoint, isBlobStorageConfigured } from "@backend/env";
import { BlobConfigError } from "@backend/blob/errors";
import {
  blobLocationFromUrl,
  blobObjectName,
  blobPublicUrl,
  type BlobFolder,
} from "@shared/blob-image";
import { isPosterContentType, type PosterContentType, type PosterImageInput } from "@shared/poster-image";

export type UploadedBlobImage = {
  url: string;
  folder: BlobFolder;
  name: string;
};

export type BlobUploader = (input: {
  folder: BlobFolder;
  name: string;
  contentType: string;
  bytes: Uint8Array;
}) => Promise<string>;

export type BlobDownloader = (url: string) => Promise<PosterImageInput | undefined>;

type GlobalBlob = {
  ciuBlobCredential?: TokenCredential;
  ciuBlobClient?: BlobServiceClient;
  ciuBlobUploader?: BlobUploader;
  ciuBlobDownloader?: BlobDownloader;
};

const globalBlob = globalThis as typeof globalThis & GlobalBlob;

export function setBlobUploaderForTests(uploader: BlobUploader | undefined) {
  globalBlob.ciuBlobUploader = uploader;
}

export function setBlobDownloaderForTests(downloader: BlobDownloader | undefined) {
  globalBlob.ciuBlobDownloader = downloader;
}

function contentTypeFromName(name: string): PosterContentType | undefined {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
}

function requireEndpoint() {
  if (!isBlobStorageConfigured()) {
    throw new BlobConfigError(
      "Azure Blob Storage is not configured. Set AZURE_STORAGE_BLOB_ENDPOINT."
    );
  }
  return blobStorageEndpoint();
}

export function getBlobServiceClient() {
  const endpoint = requireEndpoint();
  globalBlob.ciuBlobCredential ??= createSqlCredential();
  globalBlob.ciuBlobClient ??= new BlobServiceClient(endpoint, globalBlob.ciuBlobCredential);
  return { endpoint, service: globalBlob.ciuBlobClient };
}

async function uploadWithAzure(input: {
  folder: BlobFolder;
  name: string;
  contentType: string;
  bytes: Uint8Array;
}) {
  await applyCloudflareRuntimeEnv();
  const { endpoint, service } = getBlobServiceClient();
  const container = service.getContainerClient(input.folder);
  await container.createIfNotExists();
  try {
    await container.setAccessPolicy("blob");
  } catch {
    // Account may block anonymous access; the public /api/media proxy still serves the file.
  }
  const blob = container.getBlockBlobClient(input.name);
  await blob.uploadData(input.bytes, {
    blobHTTPHeaders: {
      blobContentType: input.contentType,
      blobCacheControl: "public, max-age=31536000",
    },
  });
  return blob.url || blobPublicUrl(endpoint, input.folder, input.name);
}

function posterBytes(poster: PosterImageInput) {
  return Uint8Array.from(Buffer.from(poster.contentInBase64, "base64"));
}

export async function uploadPosterToFolder(
  folder: BlobFolder,
  poster: PosterImageInput
): Promise<UploadedBlobImage> {
  const name = blobObjectName(poster.name);
  const bytes = posterBytes(poster);
  const uploader = globalBlob.ciuBlobUploader ?? uploadWithAzure;
  const url = await uploader({
    folder,
    name,
    contentType: poster.contentType,
    bytes,
  });
  return { url, folder, name };
}

export async function posterFromStoredImage(url?: string): Promise<PosterImageInput | undefined> {
  const image = url?.trim();
  if (!image) return undefined;
  if (globalBlob.ciuBlobDownloader) {
    return globalBlob.ciuBlobDownloader(image);
  }
  await applyCloudflareRuntimeEnv();
  const location = blobLocationFromUrl(image);
  if (!location || !isBlobStorageConfigured()) return undefined;
  try {
    const blob = getBlobServiceClient().service.getContainerClient(location.folder).getBlockBlobClient(location.name);
    if (!(await blob.exists())) return undefined;
    const [buffer, properties] = await Promise.all([blob.downloadToBuffer(), blob.getProperties()]);
    const rawType = properties.contentType ?? "";
    const contentType = isPosterContentType(rawType) ? rawType : contentTypeFromName(location.name);
    if (!contentType) return undefined;
    return {
      name: location.name,
      contentType,
      contentInBase64: buffer.toString("base64"),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown storage error";
    console.error("[ciu-blob] download failed", { message });
    return undefined;
  }
}
