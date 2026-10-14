import { BlobConfigError } from "@backend/blob/errors";
import { uploadPosterToFolder } from "@backend/blob/upload";
import { persistableImageUrl, type BlobFolder } from "@shared/blob-image";
import { parsePosterImage } from "@shared/poster-image";
import { readString } from "@shared/read-string";

export async function resolveImageFromBody(input: {
  folder: BlobFolder;
  body: Record<string, unknown>;
  existing?: string;
}): Promise<{ image?: string } | { error: string }> {
  const poster = parsePosterImage(input.body.poster);
  if (typeof poster === "string") return { error: poster };

  if (poster) {
    try {
      const uploaded = await uploadPosterToFolder(input.folder, poster);
      return { image: uploaded.url };
    } catch (error) {
      if (error instanceof BlobConfigError) return { error: error.message };
      const message = error instanceof Error ? error.message : "Unknown storage error";
      console.error("[ciu-blob] upload failed", { folder: input.folder, message });
      return { error: "The picture could not be saved to storage." };
    }
  }

  if (Object.prototype.hasOwnProperty.call(input.body, "image")) {
    return { image: persistableImageUrl(readString(input.body.image)) };
  }

  return { image: input.existing };
}
