import { TriangleAlert } from "lucide-react";
import { Portrait } from "@/components/thyma/portrait";
import { fmtDateTime, type PanelPatient } from "@/data/console-panel";
import { Chip } from "./primitives";

/**
 * Epic-style patient context banner.
 *
 * The pattern exists for one reason: so a clinician can confirm, at any moment
 * and without scrolling, that they are acting on the right chart. That is why
 * it is sticky, why it leads with name and MRN, and why allergies sit in it
 * rather than behind a tab — an allergy that has to be navigated to is an
 * allergy that gets missed while an order is being written.
 *
 * `portal-shell.tsx` documents this same banner being *removed* from the member
 * portal, where it read to Maria like an ID badge for her own life. The
 * reasoning there and the reasoning here are the same one: identity-confirmation
 * chrome is for the person holding the chart, not the person in it.
 *
 * The name is set in Fraunces. It is the one genuine heading on the screen, and
 * the display face is what keeps this reading as Thyma rather than as a
 * generic terminal — the density lives in the measurements, not in the type.
 */

/** Sits between fields in the identity strip. */
function Sep() {
  return <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-hairline" />;
}

function Item({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <span className="flex shrink-0 items-baseline gap-1.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className={`text-[12.5px] text-slate ${mono ? "font-mono font-semibold tabular-nums" : ""}`}
      >
        {value}
      </span>
    </span>
  );
}

export function PatientBanner({ p }: { p: PanelPatient }) {
  return (
    <header
      // top-0 within the scrolling chart pane, so it survives any scroll of the
      // chart without the worklist needing to move with it.
      className="sticky top-0 z-30 border-b border-hairline bg-card"
      aria-label={`Patient context: ${p.last}, ${p.first}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-2.5 py-1.5">
        {/* Functional, not decorative: a face is part of how the right chart
            gets confirmed. Held to 28px so it costs no extra banner height. */}
        <Portrait who={p.photo} size="xs" alt={`${p.first} ${p.last}`} />

        <h1 className="text-[16px] font-semibold text-ink">
          {p.last}, {p.first}
        </h1>

        <Sep />
        <Item label="MRN" value={p.mrn} mono />
        <Sep />
        <Item label="DOB" value={`${fmtDateTime(p.dob)} (${p.age}y)`} />
        <Sep />
        <Item label="Sex" value={p.sex} />
        <Sep />

        {/* Allergies are the one field allowed to shout. */}
        {p.allergies.length > 0 ? (
          <span className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] text-muted-foreground">Allergies</span>
            {p.allergies.map((a) => (
              <Chip key={a} severity="critical">
                <TriangleAlert size={12} strokeWidth={2.25} aria-hidden="true" />
                {a}
              </Chip>
            ))}
          </span>
        ) : (
          <Item label="Allergies" value="No known allergies" />
        )}

        {p.flags.length > 0 && (
          <span className="flex flex-wrap items-center gap-1">
            {p.flags.map((f) => (
              <Chip key={f} severity="abnormal">
                {f}
              </Chip>
            ))}
          </span>
        )}

        <span className="ml-auto flex shrink-0 items-center gap-2">
          <Item label="ED risk 90d" value={String(p.risk)} mono />
          {p.openedAt ? (
            <Chip severity="critical">Open contact {fmtDateTime(p.openedAt)}</Chip>
          ) : (
            <Chip severity="normal">Routine outreach</Chip>
          )}
        </span>
      </div>
    </header>
  );
}
