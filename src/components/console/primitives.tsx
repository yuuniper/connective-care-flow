import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LabFlag as LabFlagKind } from "@/data/console-panel";

/**
 * Console-only primitives.
 *
 * These exist rather than reaching for `components/ui/*` because those are
 * shared with the member portal and the marketing pages: restyling them for
 * chart density would change every page on the site. Nothing here is imported
 * outside the console.
 *
 * Everything below draws on the Thyma tokens — the console is the same product
 * as the rest of the site, rendered denser. Blue carries structure and action,
 * magenta carries section labels and the active tab, and the status trio
 * (emergent / urgent / routine) carries clinical meaning and nothing else.
 */

/* ------------------------------------------------------------------ flags */

/**
 * The `/12` tint under a full-strength foreground is the pattern the design
 * system already uses for status (see the TONES map in `thyma/panel.tsx`);
 * reusing it means a critical flag here reads identically to a critical marker
 * in the member portal.
 */
const SEVERITY = {
  critical: "bg-emergent/12 text-emergent border-emergent/25",
  abnormal: "bg-urgent/12 text-urgent border-urgent/25",
  normal: "bg-routine/12 text-routine border-routine/25",
  /* Non-clinical chips — risk drivers, dispositions. Pink, as the deck intends:
     warmth on the things that are context rather than alarm. */
  neutral: "bg-blush-soft text-rose-deep border-transparent",
} as const;

export type Severity = keyof typeof SEVERITY;

/**
 * The smallest unit of alarm on the screen.
 *
 * Deliberately a chip and not a filled row or card: on a screen where most
 * values are normal, the abnormal one is found by hue in a field of calm, and
 * that only works while the status colors stay rare. Tinting whole rows would
 * spend the same signal on far more area.
 */
export function Chip({
  severity = "neutral",
  children,
  className,
  title,
}: {
  severity?: Severity;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex h-[17px] shrink-0 items-center gap-1 rounded-ehr border px-1.5",
        "text-[11px] font-semibold leading-none whitespace-nowrap",
        SEVERITY[severity],
        className,
      )}
    >
      {children}
    </span>
  );
}

const LAB_FLAG = {
  H: { severity: "abnormal", label: "High" },
  L: { severity: "abnormal", label: "Low" },
  HH: { severity: "critical", label: "Critically high" },
  LL: { severity: "critical", label: "Critically low" },
} as const;

/**
 * Standard H/L result flag, doubled (HH/LL) for critical — the convention a
 * clinician already reads without a legend. The glyph is short enough to sit in
 * a 32px row beside the value; the full word is exposed to screen readers,
 * since "H" alone announces as a letter.
 */
export function LabFlagChip({ flag }: { flag: LabFlagKind }) {
  if (!flag) return null;
  const { severity, label } = LAB_FLAG[flag];
  return (
    <Chip severity={severity} title={label}>
      <span aria-hidden="true">{flag}</span>
      <span className="sr-only">{label}</span>
    </Chip>
  );
}

/* --------------------------------------------------------------- sections */

/**
 * Section label: the deck's magenta on a cream strip with a hairline under it.
 *
 * Sentence case, not the uppercase tracked treatment a chart interface reaches
 * for by reflex — `styles.css` records that decision explicitly, having thrown
 * out an "uppercase 0.09em-tracked slate" label for shouting above every
 * heading. Density comes from the 11.5px size and the tight strip, which costs
 * less vertical space than the tinted icon disc used elsewhere on the site
 * without raising its voice.
 */
export function SectionHeader({
  title,
  aside,
  className,
}: {
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-hairline bg-cream px-2.5 py-1",
        className,
      )}
    >
      {/* font-sans is not an override of the base h1–h4 rule so much as the
          system's own answer for section labels — see the `eyebrow` utility. */}
      <h2 className="font-sans text-[11.5px] font-semibold text-rose-deep">{title}</h2>
      {aside && <span className="ml-auto text-[11px] text-muted-foreground">{aside}</span>}
    </div>
  );
}

/** Label/value pair for the snapshot grid. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 border-b border-hairline px-2.5 py-1.5">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-[13px] text-slate">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------- tabs */

/**
 * Radix tabs used directly rather than through `components/ui/tabs.tsx`.
 *
 * That wrapper bakes in `rounded-lg bg-muted` and `data-[state=active]:shadow`
 * — a pill switcher, which is the consumer pattern this redesign is moving
 * away from — and unpicking those through tailwind-merge is fragile. Going to
 * the primitive costs one import and keeps Radix's roving focus: arrow keys
 * move between tabs, Home/End jump to the ends, Tab enters the panel.
 */
export const ChartTabs = TabsPrimitive.Root;

export function ChartTabList({ children }: { children: ReactNode }) {
  return (
    <TabsPrimitive.List className="flex items-stretch gap-0 overflow-x-auto border-b border-hairline bg-cream">
      {children}
    </TabsPrimitive.List>
  );
}

export function ChartTab({
  value,
  count,
  children,
}: {
  value: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "relative -mb-px shrink-0 cursor-pointer border-r border-hairline px-3 py-1.5",
        "text-[12.5px] whitespace-nowrap text-muted-foreground transition-colors",
        "hover:bg-blush-wash hover:text-ink",
        // The active tab lifts to card-white and is tied to the panel below by a
        // magenta rule — the warm half of the palette doing exactly the job the
        // deck gives it, on a state rather than a wash. The label goes to plum,
        // the app-wide active color. No shadow, no pill.
        "data-[state=active]:border-b-2 data-[state=active]:border-b-rose",
        "data-[state=active]:bg-card data-[state=active]:font-semibold",
        "data-[state=active]:text-plum",
      )}
    >
      {children}
      {count !== undefined && <span className="ml-1.5 font-mono text-[11px]">({count})</span>}
    </TabsPrimitive.Trigger>
  );
}

export function ChartTabPanel({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsPrimitive.Content value={value} className="focus-visible:outline-none">
      {children}
    </TabsPrimitive.Content>
  );
}
