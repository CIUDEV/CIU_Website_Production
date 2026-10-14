import ZoomableImage from "@frontend/components/lightbox/ZoomableImage";
import Link from "next/link";
import EventPhotoGallery from "@frontend/components/events/EventPhotoGallery";
import SectionContainer from "@frontend/components/home/SectionContainer";
import SectionHeading from "@frontend/components/home/SectionHeading";
import { homeBtnOutlineClass, homeSectionClass } from "@frontend/components/home/homeUi";
import { sportEventContent } from "@frontend/content/EventsContent";

export default function SportEventPage() {
  const { label, heading, intro, imageSrc, imageAlt, galleryHeading, gallerySubheading, gallery, picnicLink } =
    sportEventContent;

  return (
    <div className={`${homeSectionClass} bg-background`}>
      <SectionContainer>
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">{label}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{heading}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">{intro}</p>

          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl border border-border/80 bg-section-warm shadow-premium-lg">
            <ZoomableImage
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>

          <Link href={picnicLink.href} className={`${homeBtnOutlineClass} mt-8 inline-flex`}>
            {picnicLink.label}
          </Link>
        </div>

        <div className="mt-16">
          <SectionHeading heading={galleryHeading} subheading={gallerySubheading} />
          <EventPhotoGallery items={gallery} />
        </div>
      </SectionContainer>
    </div>
  );
}
