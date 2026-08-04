import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const TONES = {
  plum: "bg-plum/12 text-plum",
  urgent: "bg-urgent/12 text-urgent",
  emergent: "bg-emergent/12 text-emergent",
  routine: "bg-routine/12 text-routine",
} as const;

/**
 * Standard panel header: icon in a tinted tile, sentence-case title, optional
 * right-aligned meta. One shape everywhere so panels read as chart sections,
 * not decorated boxes. `tone` is semantic — reserve urgent/emergent for
 * safety-related panels.
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
    <div className="flex flex-wrap items-center gap-2.5 border-b border-hairline bg-cream px-4 py-2.5">
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-md ${TONES[tone]}`}
      >
        <Icon size={15} strokeWidth={2} />
      </span>
      <h2 className="text-[15px] font-semibold leading-tight">{title}</h2>
      {aside && <span className="ml-auto text-[12.5px] text-muted-foreground">{aside}</span>}
    </div>
  );
}
