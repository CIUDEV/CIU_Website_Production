export const BLOB_FOLDERS = ["event", "marketing"] as const;

export type BlobFolder = (typeof BLOB_FOLDERS)[number];

const BLOB_HOST = /\.blob\.core\.windows\.net$/i;

export function isBlobFolder(value: string): value is BlobFolder {
  return (BLOB_FOLDERS as readonly string[]).includes(value);
}

export function persistableImageUrl(value: string) {
  const image = value.trim();
  if (!image || image.startsWith("data:") || image.length > 1000) return undefined;
  return image;
}

export function blobObjectName(fileName: string, now = Date.now()) {
  const extMatch = fileName.toLowerCase().match(/\.(jpe?g|png|webp|gif)$/);
  const ext = extMatch?.[0] ?? "";
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.\- ()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${now}-${base || "poster"}${ext}`;
}

export function blobPublicUrl(endpoint: string, folder: BlobFolder, name: string) {
  const host = endpoint.replace(/\/$/, "");
  return `${host}/${folder}/${encodeURIComponent(name)}`;
}

export function blobLocationFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!BLOB_HOST.test(parsed.hostname)) return undefined;
    const parts = parsed.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
    const folder = parts[0] ?? "";
    const name = decodeURIComponent(parts.slice(1).join("/"));
    if (!isBlobFolder(folder) || !name || name.includes("..") || name.includes("/")) {
      return undefined;
    }
    return { folder, name };
  } catch {
    return undefined;
  }
}

export function blobImageProxyPath(url: string) {
  const location = blobLocationFromUrl(url);
  if (!location) return undefined;
  return `/api/media/${location.folder}/${encodeURIComponent(location.name)}`;
}

export function displayableImageSrc(url: string) {
  return blobImageProxyPath(url) ?? url;
}
