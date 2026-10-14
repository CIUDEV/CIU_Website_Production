import { describe, expect, it } from "vitest";
import {
  blobImageProxyPath,
  blobLocationFromUrl,
  blobObjectName,
  blobPublicUrl,
  displayableImageSrc,
  persistableImageUrl,
} from "@shared/blob-image";

describe("blob image helpers", () => {
  it("builds a unique object name from the uploaded file", () => {
    expect(blobObjectName("One Big Family Picnic.PNG", 1700000000000)).toBe(
      "1700000000000-One-Big-Family-Picnic.png"
    );
    expect(blobObjectName("bad/name?.jpg", 1)).toBe("1-badname.jpg");
  });

  it("builds the blob access URL and a same-origin proxy path", () => {
    const url = blobPublicUrl("https://ciublobprod.blob.core.windows.net", "event", "1-picnic.jpg");
    expect(url).toBe("https://ciublobprod.blob.core.windows.net/event/1-picnic.jpg");
    expect(blobLocationFromUrl(url)).toEqual({ folder: "event", name: "1-picnic.jpg" });
    expect(blobImageProxyPath(url)).toBe("/api/media/event/1-picnic.jpg");
    expect(displayableImageSrc(url)).toBe("/api/media/event/1-picnic.jpg");
    expect(displayableImageSrc("https://res.cloudinary.com/ciu/poster.jpg")).toBe(
      "https://res.cloudinary.com/ciu/poster.jpg"
    );
  });

  it("does not persist data URLs", () => {
    expect(persistableImageUrl("data:image/png;base64,aaaa")).toBeUndefined();
    expect(persistableImageUrl("https://ciublobprod.blob.core.windows.net/marketing/1.jpg")).toBe(
      "https://ciublobprod.blob.core.windows.net/marketing/1.jpg"
    );
  });
});
