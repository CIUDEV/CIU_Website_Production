"use client";

import ZoomableImage from "@/components/lightbox/ZoomableImage";
import SectionContainer from "@/components/home/SectionContainer";
import { homeSectionClass } from "@/components/home/homeUi";
import { MotionItem, MotionStagger } from "@/components/motion";
import {
  mediaGalleryItems,
  mediaImagesPageContent,
  mediaPhotoFilters,
  mediaVideoItems,
  type MediaGalleryCategory,
  type MediaGalleryItem,
  type MediaVideoItem,
} from "@/content/MediaContent";
import { ExternalLink, Film, Images } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type MediaView = "photos" | "videos";

const categoryLabels = {
  "ciu-community": "CIU & Masjid",
  "islamic-themes": "Islamic Themes",
} as const;

function GalleryCard({ item }: { item: MediaGalleryItem }) {
  const isPoster = item.variant === "poster";

  return (
    <MotionItem
      className={`group relative overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-premium transition duration-500 hover:shadow-premium-xl ${
        isPoster ? "aspect-[3/4]" : "aspect-square"
      }`}
    >
      <ZoomableImage
        src={item.imageSrc}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className={`transition duration-700 group-hover:scale-[1.02] ${
          isPoster ? "object-contain bg-background p-3" : "object-cover group-hover:scale-110"
        }`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-brand-light uppercase sm:text-xs">
          {categoryLabels[item.category]}
        </p>
        <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">{item.title}</h3>
      </div>
    </MotionItem>
  );
}

function ShortCard({ item }: { item: MediaVideoItem }) {
  return (
    <MotionItem className="group overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-premium transition duration-500 hover:shadow-premium-xl">
      <div className="relative aspect-[9/16] bg-black sm:aspect-video">
        <iframe
          src={item.embedSrc}
          title={item.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border/70 p-4 sm:p-5">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">{item.title}</h3>
        <Link
          href={item.watchHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-dark"
        >
          YouTube
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>
    </MotionItem>
  );
}

export default function MediaGalleryGrid() {
  const { viewTabs, note } = mediaImagesPageContent;
  const [mediaView, setMediaView] = useState<MediaView>("photos");
  const [photoFilter, setPhotoFilter] = useState<MediaGalleryCategory>("all");

  const filteredPhotos = useMemo(() => {
    if (photoFilter === "all") return mediaGalleryItems;
    return mediaGalleryItems.filter((item) => item.category === photoFilter);
  }, [photoFilter]);

  return (
    <section className={`${homeSectionClass} bg-section-warm`}>
      <SectionContainer>
        <div className="flex flex-wrap gap-2">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMediaView(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                mediaView === tab.id
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-border bg-surface text-foreground hover:border-brand/25 hover:bg-brand/5"
              }`}
            >
              {tab.id === "photos" ? (
                <Images className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Film className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {mediaView === "photos" ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {mediaPhotoFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setPhotoFilter(filter.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  photoFilter === filter.id
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-border bg-surface text-foreground hover:border-brand/25 hover:bg-brand/5"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-5 text-sm text-muted sm:text-base">{note}</p>

        {mediaView === "photos" ? (
          <MotionStagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {filteredPhotos.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </MotionStagger>
        ) : (
          <MotionStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {mediaVideoItems.map((item) => (
              <ShortCard key={item.id} item={item} />
            ))}
          </MotionStagger>
        )}
      </SectionContainer>
    </section>
  );
}
