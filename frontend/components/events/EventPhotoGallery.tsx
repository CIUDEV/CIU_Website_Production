import ZoomableImage from "@frontend/components/lightbox/ZoomableImage";

type EventPhoto = {
  id: string;
  imageSrc: string;
  imageAlt: string;
};

export default function EventPhotoGallery({ items }: { items: readonly EventPhoto[] }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-border/80 shadow-premium"
        >
          <ZoomableImage
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
