import { people, type PersonKey } from "@/data/people";

/**
 * Circular portrait with an initials fallback underneath, so the box is filled
 * before the image loads and stays filled if it never does.
 *
 * Alt text defaults to empty: in every current usage the person's name sits
 * immediately beside the portrait, so announcing it again is duplication.
 * Pass `alt` explicitly where the image stands alone.
 */
const SIZE = {
  xs: { cls: "size-7", text: "text-[9.5px]", px: 28 },
  sm: { cls: "size-9", text: "text-[11px]", px: 36 },
  md: { cls: "size-11", text: "text-[13px]", px: 44 },
  lg: { cls: "size-14", text: "text-[16px]", px: 56 },
  xl: { cls: "size-20", text: "text-[22px]", px: 80 },
} as const;

export function Portrait({
  who,
  size = "md",
  alt = "",
  className = "",
}: {
  who: PersonKey;
  size?: keyof typeof SIZE;
  alt?: string;
  className?: string;
}) {
  const p = people[who];
  const s = SIZE[size];

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blush-soft font-display font-semibold text-ink ring-1 ring-hairline ${s.cls} ${s.text} ${className}`}
    >
      <span aria-hidden="true">{p.initials}</span>
      <img
        src={p.src}
        alt={alt}
        width={s.px}
        height={s.px}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  );
}

/** Overlapping row of portraits — used to show a care team as one unit. */
export function PortraitStack({
  who,
  size = "sm",
}: {
  who: PersonKey[];
  size?: keyof typeof SIZE;
}) {
  return (
    <span className="flex items-center -space-x-2">
      {who.map((k) => (
        <Portrait key={k} who={k} size={size} className="ring-2 ring-card" />
      ))}
    </span>
  );
}
