"use client";

import LightboxTrigger from "@/components/lightbox/LightboxTrigger";
import Image, { type ImageProps, type StaticImageData } from "next/image";

export type ZoomableImageProps = ImageProps & {
  zoomable?: boolean;
  caption?: string;
};

function resolveSrc(src: ImageProps["src"]): string {
  if (typeof src === "string") return src;
  return (src as StaticImageData).src;
}

export default function ZoomableImage({
  zoomable = true,
  caption,
  className = "",
  alt = "",
  src,
  fill,
  ...props
}: ZoomableImageProps) {
  if (!zoomable || !src) {
    return <Image className={className} alt={alt} src={src} fill={fill} {...props} />;
  }

  const image = (
    <Image
      className={`${className}${className.includes("pointer-events") ? "" : " pointer-events-none"}`}
      alt={alt}
      src={src}
      fill={fill}
      {...props}
    />
  );

  if (fill) {
    return (
      <LightboxTrigger
        src={resolveSrc(src)}
        alt={typeof alt === "string" ? alt : ""}
        caption={caption}
        className="absolute inset-0"
      >
        {image}
      </LightboxTrigger>
    );
  }

  return (
    <LightboxTrigger
      src={resolveSrc(src)}
      alt={typeof alt === "string" ? alt : ""}
      caption={caption}
      className="relative inline-block"
    >
      {image}
    </LightboxTrigger>
  );
}
