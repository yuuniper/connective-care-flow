/**
 * Portrait registry for the prototype's cast.
 *
 * Every photograph is licensed stock standing in for a fictional person — no
 * one depicted is a real Thyma member, clinician or patient, and none of them
 * has any of the conditions named on this site. Photographer credits live in
 * `public/people/CREDITS.md`; the models-depicted notice is in the site footer.
 *
 * Initials are the pre-load and failure fallback, so a portrait box is never
 * empty even before the image lands.
 */
export type PersonKey =
  | "maria"
  | "osei"
  | "kaur"
  | "linde"
  | "brant"
  | "rosalind"
  | "denise"
  | "alicia"
  | "dennis"
  | "priya"
  | "karen";

type Person = {
  /** Square 192×192 face crop, used for every avatar size. */
  src: string;
  /** Fallback shown behind the image. */
  initials: string;
  /** Only used where the name is not already adjacent in the markup. */
  alt: string;
};

export const people: Record<PersonKey, Person> = {
  maria: { src: "/people/maria.jpg", initials: "MD", alt: "Maria Delgado" },
  osei: { src: "/people/osei.jpg", initials: "AO", alt: "Dr. Amara Osei" },
  kaur: { src: "/people/kaur.jpg", initials: "RK", alt: "Dr. Ravi Kaur" },
  linde: { src: "/people/linde.jpg", initials: "JL", alt: "Dr. Joan Linde" },
  brant: { src: "/people/brant.jpg", initials: "TB", alt: "Tasha Brant, RN" },
  rosalind: { src: "/people/rosalind.jpg", initials: "RK", alt: "Rosalind K." },
  denise: { src: "/people/denise.jpg", initials: "DA", alt: "Denise A." },
  alicia: { src: "/people/alicia.jpg", initials: "AB", alt: "Alicia Brooks" },
  dennis: { src: "/people/dennis.jpg", initials: "DO", alt: "Dennis Ochoa" },
  priya: { src: "/people/priya.jpg", initials: "PR", alt: "Priya Raman" },
  karen: { src: "/people/karen.jpg", initials: "KL", alt: "Karen Liu" },
};

/** Tall crop of the same frame as `maria.jpg`, for the homepage hero. */
export const mariaPortrait = "/people/maria-portrait.jpg";
