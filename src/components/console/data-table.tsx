import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDir = "asc" | "desc";

export type Column<T> = {
  key: string;
  header: string;
  /** Numerics right-align; everything else reads from the left edge. */
  align?: "left" | "right";
  /** Column sizing / responsive hiding, e.g. "w-24" or "hidden lg:table-cell". */
  className?: string;
  sortable?: boolean;
  /** Sort key. Falls back to the raw cell only when this is a plain value. */
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
};

/**
 * Dense clinical data table.
 *
 * Deliberately not `components/ui/table.tsx`: that one is shared with the
 * member-facing pages and sets a comfortable 48px+ rhythm. The contract here is
 * 32px rows, no zebra striping, and separation by a single hairline — zebra
 * bands compete with the abnormal-value flags for the eye, which is the one
 * thing this table exists to make findable.
 *
 * Selection is periwinkle, the same tint the console used before this redesign
 * and the same one the sidebar uses, so "selected" means one thing throughout.
 *
 * Sorting is presentation state only. The incoming array is never mutated; the
 * sort runs on a copy, so the caller's data is untouched.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  label,
  selected,
  onSelect,
  initialSort,
  empty = "No rows.",
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Accessible name — these tables have no visible <caption>. */
  label: string;
  selected?: string | undefined;
  onSelect?: (row: T) => void;
  initialSort?: { key: string; dir: SortDir };
  empty?: ReactNode;
}) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(initialSort ?? null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = col.sortValue!(a);
      const y = col.sortValue!(b);
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return String(x).localeCompare(String(y)) * dir;
    });
  }, [rows, columns, sort]);

  function toggle(key: string) {
    setSort((s) =>
      s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  }

  return (
    <table className="w-full border-collapse text-[12px]" aria-label={label}>
      <thead>
        <tr className="border-b border-hairline bg-cream">
          {columns.map((col) => {
            const active = sort?.key === col.key;
            // aria-sort belongs on the header cell, not the button inside it.
            const ariaSort = !col.sortable
              ? undefined
              : active
                ? sort.dir === "asc"
                  ? "ascending"
                  : "descending"
                : "none";
            return (
              <th
                key={col.key}
                scope="col"
                aria-sort={ariaSort}
                className={cn(
                  // Sentence case rather than uppercase-tracked: styles.css
                  // records that treatment being thrown out for shouting.
                  "h-7 text-[11.5px] font-semibold whitespace-nowrap text-muted-foreground",
                  col.align === "right" ? "text-right" : "text-left",
                  col.className,
                )}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggle(col.key)}
                    className={cn(
                      "flex h-7 w-full cursor-pointer items-center gap-1 px-2.5",
                      "hover:text-ink",
                      col.align === "right" && "justify-end",
                      active && "text-plum",
                    )}
                  >
                    <span>{col.header}</span>
                    {active ? (
                      sort.dir === "asc" ? (
                        <ChevronUp size={12} strokeWidth={2.25} aria-hidden="true" />
                      ) : (
                        <ChevronDown size={12} strokeWidth={2.25} aria-hidden="true" />
                      )
                    ) : (
                      <ChevronsUpDown
                        size={12}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="opacity-40"
                      />
                    )}
                  </button>
                ) : (
                  <span className="block px-2.5">{col.header}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="px-2.5 py-4 text-center text-muted-foreground">
              {empty}
            </td>
          </tr>
        )}
        {sorted.map((row) => {
          const key = rowKey(row);
          const isSelected = selected === key;
          return (
            <tr
              key={key}
              onClick={onSelect ? () => onSelect(row) : undefined}
              className={cn(
                "h-ehr-row border-b border-hairline",
                onSelect && "cursor-pointer",
                isSelected ? "bg-peri-wash" : onSelect ? "bg-card hover:bg-blush-wash" : "bg-card",
              )}
            >
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-2.5 align-middle",
                    // Mono is reserved for real data. Every right-aligned
                    // column here is a measured value, a count or a date —
                    // never anything human.
                    col.align === "right"
                      ? "text-right font-mono tabular-nums text-slate"
                      : "text-slate",
                    // The activator owns the padding so its hit area fills the cell.
                    onSelect && i === 0 && "p-0",
                    col.className,
                  )}
                >
                  {/*
                   * Row selection lives on a real button in the first cell
                   * rather than a click handler on <tr>. A bare onClick on a
                   * row is mouse-only — it is not focusable and not
                   * announceable — so the whole worklist would be unreachable
                   * by keyboard. The row keeps its own onClick purely so a
                   * click anywhere still works for the mouse.
                   */}
                  {onSelect && i === 0 ? (
                    <button
                      type="button"
                      aria-current={isSelected ? "true" : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(row);
                      }}
                      className="h-ehr-row w-full cursor-pointer px-2.5 text-left"
                    >
                      {col.render(row)}
                    </button>
                  ) : (
                    col.render(row)
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
