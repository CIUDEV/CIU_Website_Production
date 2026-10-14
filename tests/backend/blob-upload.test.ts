import { afterEach, describe, expect, it } from "vitest";
import { resolveImageFromBody } from "@backend/blob/resolve-image";
import { posterFromStoredImage, setBlobDownloaderForTests, setBlobUploaderForTests } from "@backend/blob/upload";

const tinyJpeg = "eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eA==";

describe("resolveImageFromBody", () => {
  afterEach(() => {
    setBlobUploaderForTests(undefined);
    setBlobDownloaderForTests(undefined);
  });

  it("uploads a poster to the event folder and returns the blob URL", async () => {
    setBlobUploaderForTests(async ({ folder, name }) => {
      expect(folder).toBe("event");
      return `https://ciublobprod.blob.core.windows.net/${folder}/${name}`;
    });

    const result = await resolveImageFromBody({
      folder: "event",
      body: {
        poster: {
          name: "picnic.jpg",
          contentType: "image/jpeg",
          contentInBase64: tinyJpeg,
        },
      },
    });

    expect(result).toMatchObject({
      image: expect.stringMatching(
        /^https:\/\/ciublobprod\.blob\.core\.windows\.net\/event\/\d+-picnic\.jpg$/
      ),
    });
  });

  it("uploads outreach posters to the marketing folder", async () => {
    setBlobUploaderForTests(async ({ folder }) => {
      expect(folder).toBe("marketing");
      return `https://ciublobprod.blob.core.windows.net/${folder}/saved.jpg`;
    });

    const result = await resolveImageFromBody({
      folder: "marketing",
      body: {
        poster: {
          name: "flyer.jpg",
          contentType: "image/jpeg",
          contentInBase64: tinyJpeg,
        },
      },
    });

    expect(result).toEqual({
      image: "https://ciublobprod.blob.core.windows.net/marketing/saved.jpg",
    });
  });

  it("keeps an existing URL when no new poster is sent", async () => {
    const result = await resolveImageFromBody({
      folder: "event",
      body: {},
      existing: "https://ciublobprod.blob.core.windows.net/event/old.jpg",
    });
    expect(result).toEqual({
      image: "https://ciublobprod.blob.core.windows.net/event/old.jpg",
    });
  });

  it("reads a stored marketing poster back for email embedding", async () => {
    setBlobDownloaderForTests(async () => ({
      name: "flyer.jpg",
      contentType: "image/jpeg",
      contentInBase64: tinyJpeg,
    }));
    await expect(
      posterFromStoredImage("https://ciublobprod.blob.core.windows.net/marketing/flyer.jpg")
    ).resolves.toEqual({
      name: "flyer.jpg",
      contentType: "image/jpeg",
      contentInBase64: tinyJpeg,
    });
  });
});
