import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const TONES = {
  plum: "bg-plum/12 text-plum",
  urgent: "bg-urgent/12 text-urgent",
  emergent: "bg-emergent/12 text-emergent",
  routine: "bg-routine/12 text-routine",
} as const;

/**
 * Standard panel header: icon in a tinted disc, sentence-case title, optional
 * right-aligned meta. One shape everywhere so panels read as sections of a
 * page rather than decorated boxes. `tone` is semantic — reserve
 * urgent/emergent for safety-related panels.
 *
 * Deliberately has no rule beneath it and no filled bar: the title's size and
 * the disc carry the hierarchy. The earlier version stacked a tinted bar and a
 * hairline on top of the panel's own border, which made every panel read as a
 * spreadsheet frame.
 */
export function PanelHeader({
  icon: Icon,
  title,
  aside,
  tone = "plum",
}: {
  icon: LucideIcon;
  title: ReactNode;
  aside?: ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 pb-3 pt-4">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${TONES[tone]}`}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <h2 className="text-[17px] font-semibold leading-tight text-ink">{title}</h2>
      {aside && <span className="ml-auto text-[14px] text-muted-foreground">{aside}</span>}
    </div>
  );
}
