import { kidsRegistrationHref, programRegistrationFormUrl, quranRegistrationHref } from "@frontend/content/RegistrationLinks";

const ciuImage = (name: string) =>
  `https://res.cloudinary.com/b98znxsw/image/upload/${name}`;

export const ciuProgramPosterImages = {
  quran: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.11.jpg"),
  weekendClass:
    "https://res.cloudinary.com/dpcnwntmv/image/upload/v1785118836/CIU_Weekend_Class_kody05.png",
} as const;

export const ciuProgramKidsImages = {
  kids01: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.11_1.jpg"),
  kids02: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10.jpg"),
  kids03: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10_5.jpg"),
  kids04: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10_4.jpg"),
  kids05: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10_3.jpg"),
  kids06: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10_2.jpg"),
  kids07: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10_1.jpg"),
  kidsClassroom: ciuImage("WhatsApp_Image_2026-09-15_at_17.10.10_2.jpg"),
  /** Community classroom session — program location section */
  classroom:
    "https://res.cloudinary.com/b98znxsw/image/upload/AA684D23-C680-4CF2-9EC4-6EE9C152005C_vhdyyd.jpg",
} as const;

export type CiuProgramPoster = {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  registrationHref: string;
  buttonLabel: string;
};

export const ciuProgramsContent = {
  hero: {
    label: "CIU EDUCATION",
    heading: "CIU Programs",
    intro:
      "Weekend Quran classes and kids programs at the Canadian Islamic Centre — practical Islamic learning for children and families in a welcoming community setting.",
    imageSrc: ciuProgramKidsImages.kidsClassroom,
    imageAlt: "Students gathered for a CIU class at the Canadian Islamic Centre",
  },
  overview: {
    label: "About CIU Programs",
    heading: "Weekend Quran & Kids Classes",
    paragraphs: [
      "While Azhar Canada College delivers Al-Azhar accredited diploma and course offerings, CIU directly hosts evening Quran classes and weekend children's programs at the Canadian Islamic Centre in Mississauga.",
      "These programs give learners of all ages a chance to connect with Islam, build Quranic literacy, and grow alongside peers in a modern, nurturing environment rooted in community.",
    ],
    highlights: [
      "Evening Quran classes on Tuesday and Thursday",
      "Weekend school for grades 1 through 12",
      "Programs hosted at the Canadian Islamic Centre",
      "Welcoming environment for families across the GTA",
    ],
    imageSrc: ciuProgramKidsImages.kids01,
    imageAlt: "Two students in the CIU kids program smiling during class",
  },
  postersHeading: "Registration & Program Details",
  postersSubheading:
    "View the program posters below and register using the shared registration form.",
  posters: [
    {
      id: "ciu-quran-class",
      title: "CIU Quran Class",
      imageSrc: ciuProgramPosterImages.quran,
      imageAlt: "Students studying Quran together in the CIU classroom",
      registrationHref: quranRegistrationHref,
      buttonLabel: "Register Now",
    },
    {
      id: "ciu-weekend-kids-class",
      title: "Weekend School Registration",
      imageSrc: ciuProgramPosterImages.weekendClass,
      imageAlt: "CIU weekend school registration poster for grades 1 through 12",
      registrationHref: kidsRegistrationHref,
      buttonLabel: "Register Now",
    },
  ] satisfies CiuProgramPoster[],
  galleryHeading: "Kids Program in Action",
  gallerySubheading: "Photos from CIU kids classes and weekend learning sessions.",
  gallery: [
    {
      id: "kids-01",
      title: "Classroom Session",
      imageSrc: ciuProgramKidsImages.kids01,
      imageAlt: "Two students in the CIU kids program smiling during class",
    },
    {
      id: "kids-02",
      title: "Learning Together",
      imageSrc: ciuProgramKidsImages.kids02,
      imageAlt: "Two boys seated together during a CIU kids program session",
    },
    {
      id: "kids-03",
      title: "Weekend Class",
      imageSrc: ciuProgramKidsImages.kids03,
      imageAlt: "Boys at classroom tables during a CIU kids program",
    },
    {
      id: "kids-04",
      title: "Art Activity",
      imageSrc: ciuProgramKidsImages.kids04,
      imageAlt: "Two girls coloring during a CIU kids program activity",
    },
    {
      id: "kids-05",
      title: "Table Time",
      imageSrc: ciuProgramKidsImages.kids05,
      imageAlt: "Two students talking together at a CIU kids program table",
    },
    {
      id: "kids-06",
      title: "Classroom Gathering",
      imageSrc: ciuProgramKidsImages.kids06,
      imageAlt: "Students and teacher gathered around tables in a CIU class",
    },
    {
      id: "kids-07",
      title: "Classmates",
      imageSrc: ciuProgramKidsImages.kids07,
      imageAlt: "Students smiling together during a CIU kids program class",
    },
  ],
  location: {
    title: "Program Location",
    body: "CIU Quran and weekend school classes are held at the Canadian Islamic Centre in Mississauga.",
    addressLines: ["6185 Tomken Rd #8", "Mississauga, ON L5T 1X6, Canada"],
    mapHref: "https://maps.google.com/?q=6185+Tomken+Rd+%238+Mississauga+ON",
    imageSrc: ciuProgramKidsImages.classroom,
    imageAlt: "Families and students gathered for a CIU weekend program at the Canadian Islamic Centre",
  },
  cta: {
    label: "Get Started",
    heading: "Register for CIU Programs",
    subheading:
      "Use the registration form to sign up for evening Quran classes or weekend school for grades 1 through 12.",
    primary: {
      label: "Register Now",
      href: programRegistrationFormUrl,
    },
    secondary: {
      label: "Browse Azhar Canada College",
      href: "/Education/azhar",
    },
    media: {
      label: "View Photos & Videos",
      href: "/Media/images",
    },
  },
};
