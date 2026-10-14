import { kidsRegistrationHref, quranRegistrationHref } from "@frontend/content/RegistrationLinks";
import { ciuProgramKidsImages, ciuProgramPosterImages } from "@frontend/content/CiuProgramsContent";

export type EventCategory =
  | "education"
  | "youth"
  | "family"
  | "community"
  | "spiritual"
  | "volunteer";

export type EventItem = {
  id: string;
  title: string;
  category: EventCategory;
  dateLabel: string;
  date?: string;
  time: string;
  location: string;
  description: string;
  tags: string[];
  href: string;
  buttonLabel: string;
  image?: string;
  recurring?: boolean;
  featured?: boolean;
};

export type RecurringProgram = {
  id: string;
  title: string;
  frequency: string;
  time: string;
  audience: string;
  href: string;
  buttonLabel: string;
};

export type PastEventItem = {
  id: string;
  title: string;
  dateLabel: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
};

export type EventCategoryCard = {
  id: EventCategory | "community-initiatives";
  title: string;
  description: string;
  filterCategory: EventCategory | "all";
  href: string;
};

export type CalendarDemoEvent = {
  date: string;
  title: string;
  time: string;
};

const ciuImage = (name: string) =>
  `https://res.cloudinary.com/b98znxsw/image/upload/${name}`;

export const ciuEventPhotos = {
  picnicBlanket: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.10.jpg"),
  parkPicnic: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.10_4.jpg"),
  volleyball: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.10_3.jpg"),
  treeFriends: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.10_2.jpg"),
  treeClimb: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.10_1.jpg"),
  badminton: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.09.jpg"),
  kidsSoccer: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.09_3.jpg"),
  soccerPass: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.09_2.jpg"),
  soccerPlay: ciuImage("WhatsApp_Image_2026-09-15_at_17.11.09_1.jpg"),
} as const;

export const picnicEventGallery = [
  {
    id: "picnic-blanket",
    imageSrc: ciuEventPhotos.picnicBlanket,
    imageAlt: "Youth sitting on picnic blankets sharing food at a CIU family picnic",
  },
  {
    id: "park-picnic",
    imageSrc: ciuEventPhotos.parkPicnic,
    imageAlt: "Families gathered on picnic sheets in the park at a CIU community event",
  },
  {
    id: "tree-friends",
    imageSrc: ciuEventPhotos.treeFriends,
    imageAlt: "Two children standing together by a tree at a CIU outdoor event",
  },
  {
    id: "tree-climb",
    imageSrc: ciuEventPhotos.treeClimb,
    imageAlt: "A child climbing a tree during a CIU family picnic",
  },
  {
    id: "picnic-volleyball",
    imageSrc: ciuEventPhotos.volleyball,
    imageAlt: "A student giving a thumbs up during volleyball at a CIU outdoor event",
  },
] as const;

export const sportsEventGallery = [
  {
    id: "volleyball",
    imageSrc: ciuEventPhotos.volleyball,
    imageAlt: "A student giving a thumbs up during volleyball at a CIU sports event",
  },
  {
    id: "badminton",
    imageSrc: ciuEventPhotos.badminton,
    imageAlt: "Community members playing badminton at a CIU outdoor sports event",
  },
  {
    id: "kids-soccer",
    imageSrc: ciuEventPhotos.kidsSoccer,
    imageAlt: "Youth playing soccer near a volleyball net at a CIU sports event",
  },
  {
    id: "soccer-pass",
    imageSrc: ciuEventPhotos.soccerPass,
    imageAlt: "Community members playing soccer at a CIU sports event",
  },
  {
    id: "soccer-play",
    imageSrc: ciuEventPhotos.soccerPlay,
    imageAlt: "Community members competing in a soccer game at a CIU sports event",
  },
] as const;

export const eventsImages = {
  hero: ciuEventPhotos.parkPicnic,
  featured: ciuEventPhotos.picnicBlanket,
  quranClass: ciuProgramPosterImages.quran,
  partnership:
    "https://res.cloudinary.com/b98znxsw/image/upload/about-community_peqwp7.jpg",
  pastEvents: {
    communityWelcome: ciuEventPhotos.parkPicnic,
    youthLeadership: ciuEventPhotos.volleyball,
    familyLearningDay: ciuEventPhotos.picnicBlanket,
    educationWorkshop: ciuEventPhotos.treeFriends,
    volunteerOutreach: ciuEventPhotos.soccerPlay,
    communityHalaqah: ciuEventPhotos.badminton,
  },
} as const;

export const eventsHeroContent = {
  label: "EVENTS & GATHERINGS",
  heading: "Learn, Connect and Grow Together",
  intro:
    "Explore upcoming classes, family gatherings, youth programs, workshops, community initiatives, and special events hosted by the Canadian Islamic Union.",
  supportLine: "Welcoming opportunities for individuals, youth, and families.",
  primaryButton: { label: "View Upcoming Events", href: "#upcoming-events" },
  secondaryButton: { label: "Contact the Events Team", href: "/Contact" },
  imageSrc: eventsImages.hero,
  imageAlt: "Families gathered in the park at a CIU community picnic",
};

export const eventAnnouncementContent = {
  message: "One Big Family Picnic — Sunday, August 23 at Chinguacousy Park. Join us for potluck & BBQ!",
  buttonLabel: "View Event",
  buttonHref: "/Events/family-picnic",
};

export const featuredEventContent = {
  label: "FEATURED EVENT",
  title: "One Big Family Picnic",
  dateLabel: "Sunday, August 23, 2026",
  time: "11:00 AM",
  location: "Chinguacousy Park — Brampton",
  description:
    "Join the Canadian Islamic Union for our One Big Family Picnic — a potluck and BBQ for families and community members to connect, share a meal, and enjoy a day outdoors together.",
  chips: ["Family Friendly", "Potluck & BBQ", "In Person"],
  primaryButton: { label: "Contact Us to Register", href: "/Contact" },
  secondaryButton: { label: "View Details", href: "/Events/family-picnic" },
  note: "Bring a dish to share for the potluck. More details will be shared closer to the event date.",
  imageSrc: eventsImages.featured,
  imageAlt: "Youth sharing a meal on picnic blankets at the CIU family picnic",
};

export const eventFilterCategories = [
  { id: "all", label: "All Events" },
  { id: "education", label: "Education" },
  { id: "family", label: "Family" },
] as const;

export type EventFilterCategoryId = (typeof eventFilterCategories)[number]["id"];

export const eventDateFilters = [
  { id: "upcoming", label: "Upcoming" },
  { id: "recurring", label: "Recurring" },
] as const;

export type EventDateFilterId = (typeof eventDateFilters)[number]["id"];

export const upcomingEventsSection = {
  id: "upcoming-events",
  heading: "Upcoming Events",
  subheading:
    "Our featured gathering, recurring Quran classes, and weekend kids program.",
  loadMoreLabel: "Load More Events",
  loadMoreNote: "Additional events will be published here as they are announced.",
};

export const upcomingEvents: EventItem[] = [
  {
    id: "one-big-family-picnic",
    title: "One Big Family Picnic",
    category: "family",
    dateLabel: "Sunday, August 23, 2026",
    date: "2026-08-23",
    time: "11:00 AM",
    location: "Chinguacousy Park — Brampton",
    description:
      "Join CIU families and community members for a potluck and BBQ — connect, share a meal, and enjoy fellowship outdoors.",
    tags: ["Family Friendly", "Potluck & BBQ", "In Person"],
    href: "/Events/family-picnic",
    buttonLabel: "View Details",
    image: eventsImages.featured,
    featured: true,
  },
  {
    id: "quran-class",
    title: "Quran Class",
    category: "education",
    dateLabel: "Every Tuesday & Thursday",
    time: "7:00 PM",
    location: "CIU Community Centre — Mississauga",
    description:
      "Recurring evening Quran classes focused on recitation, tajweed, and guided study for learners of all levels.",
    tags: ["Recurring", "Education", "Evenings"],
    href: quranRegistrationHref,
    buttonLabel: "Register Now",
    image: eventsImages.quranClass,
    recurring: true,
  },
  {
    id: "ciu-kids-weekend",
    title: "CIU Kids Program",
    category: "education",
    dateLabel: "Every Weekend",
    time: "10:00 AM – 2:00 PM",
    location: "Canadian Islamic Centre — Mississauga",
    description:
      "Recurring weekend Quran classes and kids learning sessions hosted by CIU for grades 1 through 12.",
    tags: ["Recurring", "Kids", "Weekends"],
    href: kidsRegistrationHref,
    buttonLabel: "Register Now",
    image: ciuProgramKidsImages.kids01,
    recurring: true,
  },
];

export const recurringProgramsContent = {
  id: "recurring-programs",
  label: "EVERY WEEK",
  heading: "Recurring Programs",
  subheading: "Join us for ongoing Quran classes and weekend kids programming.",
  note: "Schedules may change during holidays, Ramadan, or special community periods.",
  programs: [
    {
      id: "quran-class",
      title: "Quran Class",
      frequency: "Every Tuesday & Thursday",
      time: "7:00 PM",
      audience: "All learners",
      href: quranRegistrationHref,
      buttonLabel: "Register Now",
    },
    {
      id: "ciu-kids-weekend",
      title: "CIU Kids Program",
      frequency: "Every weekend",
      time: "10:00 AM – 2:00 PM",
      audience: "Grades 1 – 12",
      href: kidsRegistrationHref,
      buttonLabel: "Register Now",
    },
  ] satisfies RecurringProgram[],
};

export const eventCalendarContent = {
  id: "event-calendar",
  heading: "Monthly Calendar",
  viewFullLabel: "View Full Calendar",
  viewFullHref: "#event-calendar",
  demoEvents: [
    { date: "2026-08-23", title: "One Big Family Picnic", time: "11:00 AM" },
    { date: "2026-08-25", title: "Quran Class", time: "7:00 PM" },
    { date: "2026-08-27", title: "Quran Class", time: "7:00 PM" },
    { date: "2026-08-29", title: "CIU Kids Program", time: "10:00 AM" },
    { date: "2026-08-30", title: "CIU Kids Program", time: "10:00 AM" },
  ] satisfies CalendarDemoEvent[],
};

export const eventCategoriesContent = {
  heading: "Browse by Category",
  categories: [
    {
      id: "education",
      title: "Islamic Education",
      description: "Quran classes, kids programs, and learning opportunities at CIU.",
      filterCategory: "education",
      href: "/Events?category=education",
    },
    {
      id: "family",
      title: "Family Events",
      description: "Gatherings and family-focused programs for the community.",
      filterCategory: "family",
      href: "/Events?category=family",
    },
  ] satisfies EventCategoryCard[],
};

export const pastEventsContent = {
  id: "past-events",
  heading: "Past Events",
  subheading:
    "A look back at previous classes, gatherings, workshops, and community initiatives.",
  viewGalleryLabel: "View Event Gallery",
  viewGalleryHref: "/Events/family-picnic",
  items: [
    {
      id: "past-1",
      title: "Family Picnic",
      dateLabel: "Summer 2026",
      category: "Family",
      imageSrc: eventsImages.pastEvents.familyLearningDay,
      imageAlt: "Youth sitting on picnic blankets sharing food at a CIU family picnic",
    },
    {
      id: "past-2",
      title: "Community Picnic",
      dateLabel: "Summer 2026",
      category: "Community",
      imageSrc: eventsImages.pastEvents.communityWelcome,
      imageAlt: "Families gathered on picnic sheets in the park at a CIU community event",
    },
    {
      id: "past-3",
      title: "Community Volleyball",
      dateLabel: "Summer 2026",
      category: "Youth",
      imageSrc: eventsImages.pastEvents.youthLeadership,
      imageAlt: "A student giving a thumbs up during volleyball at a CIU sports event",
    },
    {
      id: "past-4",
      title: "Afternoon at the Park",
      dateLabel: "Summer 2026",
      category: "Family",
      imageSrc: eventsImages.pastEvents.educationWorkshop,
      imageAlt: "Two children standing together by a tree at a CIU outdoor event",
    },
    {
      id: "past-5",
      title: "Community Soccer",
      dateLabel: "Summer 2026",
      category: "Community",
      imageSrc: eventsImages.pastEvents.volunteerOutreach,
      imageAlt: "Community members competing in a soccer game at a CIU sports event",
    },
    {
      id: "past-6",
      title: "Park Badminton",
      dateLabel: "Summer 2026",
      category: "Community",
      imageSrc: eventsImages.pastEvents.communityHalaqah,
      imageAlt: "Community members playing badminton at a CIU outdoor sports event",
    },
  ] satisfies PastEventItem[],
};

export const sportEventContent = {
  label: "SPORTS & OUTDOORS",
  heading: "Sport Event",
  intro:
    "CIU community sports days bring families together for soccer, volleyball, badminton, and outdoor games at the park.",
  imageSrc: ciuEventPhotos.volleyball,
  imageAlt: "A student giving a thumbs up during volleyball at a CIU sports event",
  galleryHeading: "Sports Day Photos",
  gallerySubheading: "Soccer, volleyball, badminton, and outdoor games from CIU community sports events.",
  gallery: sportsEventGallery,
  picnicLink: { label: "View Family Picnic", href: "/Events/family-picnic" },
} as const;

export const hostEventContent = {
  id: "host-event",
  label: "COLLABORATE WITH US",
  heading: "Host or Support a Community Event",
  body: "CIU welcomes opportunities to collaborate with educators, scholars, volunteers, charity organizations, community groups, and service providers on initiatives that align with its mission and values.",
  areas: [
    "Educational workshops",
    "Family programming",
    "Youth activities",
    "Community outreach",
    "Volunteer projects",
    "Charitable initiatives",
  ],
  note: "All proposed events and partnerships are subject to review and approval.",
  primaryButton: { label: "Propose an Event", href: "/Contact" },
  secondaryButton: { label: "Contact CIU", href: "/Contact" },
  imageSrc: eventsImages.partnership,
  imageAlt: "Community members gathered during a CIU seminar",
};

export const eventRegistrationInfoContent = {
  heading: "Before You Register",
  points: [
    "Some events may require advance registration.",
    "Capacity may be limited.",
    "Children may require parent or guardian supervision.",
    "Fees, if applicable, will be clearly displayed on the event page.",
    "Photos or videos may only be taken and published according to CIU's approved consent and privacy practices.",
    "Event details may change due to venue availability, weather, speaker availability, or operational needs.",
  ],
  closing: "Please review the full event details before attending.",
};

export const eventNewsletterContent = {
  heading: "Never Miss an Event",
  intro:
    "Receive updates about upcoming classes, youth programs, family gatherings, volunteer opportunities, and important community announcements.",
  consent:
    "By subscribing, you agree to receive CIU event and community updates. You may unsubscribe at any time.",
  buttonLabel: "Subscribe for Updates",
};

export const eventsFinalCtaContent = {
  label: "JOIN THE COMMUNITY",
  heading: "Be Part of What's Happening at CIU",
  intro:
    "Attend an event, volunteer your time, support a community initiative, or connect with our team to learn how you can participate.",
  buttons: [
    { label: "Browse Events", href: "#upcoming-events", variant: "primary" as const },
    { label: "Become a Volunteer", href: "/Services/volunteer", variant: "outline" as const },
    { label: "Contact Us", href: "/Contact", variant: "gold" as const },
  ],
};

export const categoryLabels: Record<EventCategory, string> = {
  education: "Education",
  youth: "Youth",
  family: "Family",
  community: "Community",
  spiritual: "Spiritual",
  volunteer: "Volunteer",
};
