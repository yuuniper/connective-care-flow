import { Link } from "@tanstack/react-router";
import {
  ClipboardList,
  FileBarChart2,
  FilePlus2,
  FlaskConical,
  Home,
  Inbox,
  MessageSquarePlus,
  Printer,
  Rows3,
  Stethoscope,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Wordmark } from "@/components/thyma/site-chrome";
import { cn } from "@/lib/utils";

/**
 * Console chrome: the standing left rail and the standing bottom action bar.
 *
 * Between them they replace the top navigation bar the console used to carry.
 * A horizontal brand header costs a full row of vertical space on every screen
 * and puts navigation, identity and actions in the same strip; splitting them
 * to the edges leaves the middle entirely to the chart.
 *
 * The wordmark survives that move rather than being dropped — losing it is what
 * made the console read as a separate gray application instead of one surface
 * of Thyma. It just sits at the head of the rail now instead of across the top.
 */

export type ConsoleSection =
  "worklist" | "schedule" | "results" | "messages" | "orders" | "reports";

const NAV: { id: ConsoleSection; label: string; icon: LucideIcon }[] = [
  { id: "worklist", label: "Worklist", icon: Rows3 },
  { id: "schedule", label: "Schedule", icon: ClipboardList },
  { id: "results", label: "Results", icon: FlaskConical },
  { id: "messages", label: "In basket", icon: Inbox },
  { id: "orders", label: "Orders", icon: Stethoscope },
  { id: "reports", label: "Reports", icon: FileBarChart2 },
];

export function ConsoleSidebar({
  active,
  onSelect,
  openCount,
}: {
  active: ConsoleSection;
  onSelect: (id: ConsoleSection) => void;
  openCount: number;
}) {
  return (
    // Icons only until lg, where labels appear. The rail never collapses to
    // zero: losing navigation entirely on a narrow screen is worse than losing
    // the words next to it.
    <nav
      aria-label="Console sections"
      className="sticky top-0 flex h-screen w-12 shrink-0 flex-col border-r border-hairline bg-cream lg:w-52"
    >
      <div className="flex h-11 items-center border-b border-hairline px-3 lg:px-3.5">
        {/* The full wordmark once there is room for it; its initial, in the same
            display face and the same rose, when the rail is 48px wide. */}
        <span className="hidden lg:block">
          <Wordmark />
        </span>
        <span
          aria-hidden="true"
          className="font-display text-[19px] font-semibold text-ink lg:hidden"
        >
          T<span className="text-rose-deep">.</span>
        </span>
        <span className="ml-auto hidden text-[11px] text-muted-foreground lg:inline">Console</span>
      </div>

      <ul className="flex flex-1 flex-col py-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                // Labels vanish below lg, so the accessible name has to come
                // from somewhere: aria-label carries it at every width.
                aria-label={label}
                title={label}
                className={cn(
                  "flex h-8 w-full cursor-pointer items-center gap-2.5 px-3 text-[12.5px] lg:px-3.5",
                  // Selection is periwinkle with a plum marker — the same
                  // device the worklist uses, so "selected" reads the same way
                  // in both places.
                  isActive
                    ? "border-l-2 border-plum bg-peri-wash pl-[10px] font-semibold text-plum lg:pl-[12px]"
                    : "border-l-2 border-transparent text-slate hover:bg-blush-wash hover:text-ink",
                )}
              >
                <Icon size={16} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                <span className="hidden truncate lg:inline">{label}</span>
                {id === "worklist" && openCount > 0 && (
                  <span className="ml-auto hidden font-mono text-[11px] font-semibold text-emergent lg:inline">
                    {openCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-hairline py-1">
        {[
          { to: "/app", label: "Member view", icon: UserPlus },
          { to: "/", label: "Site home", icon: Home },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            title={label}
            className="flex h-8 items-center gap-2.5 px-3 text-[12.5px] text-muted-foreground hover:bg-blush-wash hover:text-plum lg:px-3.5"
          >
            <Icon size={16} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
            <span className="hidden truncate lg:inline">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

const ACTIONS: { label: string; icon: LucideIcon; primary?: boolean }[] = [
  { label: "New note", icon: FilePlus2, primary: true },
  { label: "Order", icon: Stethoscope },
  { label: "Message", icon: MessageSquarePlus },
  { label: "Assign", icon: UserPlus },
  { label: "Print", icon: Printer },
];

/**
 * Standing action bar, pinned to the bottom of the chart pane.
 *
 * A floating action button hides everything but the one action someone guessed
 * would be most common, and covers chart content to do it. A fixed strip shows
 * the whole set at once, never overlaps a row, and puts the actions in a
 * predictable place — which is what makes them fast on the hundredth use rather
 * than the first.
 */
export function ActionBar({ context }: { context?: string }) {
  return (
    <div className="sticky bottom-0 z-20 flex items-center gap-1 border-t border-hairline bg-cream px-2 py-1.5">
      {ACTIONS.map(({ label, icon: Icon, primary }) => (
        <button
          key={label}
          type="button"
          className={cn(
            "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-ehr border px-2.5",
            "text-[12px] font-medium whitespace-nowrap transition-colors",
            primary
              ? "border-action bg-action text-cream hover:bg-action-deep"
              : "border-hairline bg-card text-slate hover:bg-blush-wash hover:text-ink",
          )}
        >
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          {label}
        </button>
      ))}
      {context && (
        <span className="ml-auto hidden truncate pr-1 text-[11.5px] text-muted-foreground md:block">
          {context}
        </span>
      )}
    </div>
  );
}
