import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { ActionBar, ConsoleSidebar, type ConsoleSection } from "@/components/console/ehr-chrome";
import { DataTable, type Column } from "@/components/console/data-table";
import { PatientBanner } from "@/components/console/patient-banner";
import {
  ChartTab,
  ChartTabList,
  ChartTabPanel,
  ChartTabs,
  Chip,
  Field,
  LabFlagChip,
  SectionHeader,
} from "@/components/console/primitives";
import {
  fmtDateTime,
  panel,
  panelStats,
  type Encounter,
  type Lab,
  type Med,
  type PanelPatient,
} from "@/data/console-panel";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "Clinical console — panel triage | Thyma" },
      {
        name: "description",
        content:
          "The care team's view: an enrolled autoimmune panel ranked on 90-day ED risk, with open contacts routed to triage sessions.",
      },
      { property: "og:title", content: "Clinical console — panel triage | Thyma" },
      {
        property: "og:description",
        content:
          "Risk-stratified panel, open contacts and dispositions from the coordinator side of the platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Console,
});

/* -------------------------------------------------------------- worklist */

const worklistColumns: Column<PanelPatient>[] = [
  {
    key: "patient",
    header: "Patient",
    sortable: true,
    sortValue: (r) => r.last,
    render: (r) => (
      <>
        <div className="truncate text-[12.5px] font-semibold text-slate">
          {r.last}, {r.first}
        </div>
        <div className="truncate text-[11.5px] text-muted-foreground">
          {r.age}
          {r.sex} · {r.dx}
        </div>
      </>
    ),
  },
  {
    key: "risk",
    header: "ED risk",
    align: "right",
    sortable: true,
    sortValue: (r) => r.risk,
    className: "w-[92px]",
    render: (r) => (
      <span className="flex items-center justify-end gap-1.5">
        <span className="font-semibold">{r.risk}</span>
        {/* The score earns a flag, not a filled bar: a progress bar spends a
            whole column on a number that is already right there. */}
        {r.risk >= 85 ? (
          <Chip severity="critical">HIGH</Chip>
        ) : r.risk >= 55 ? (
          <Chip severity="abnormal">MOD</Chip>
        ) : null}
      </span>
    ),
  },
  {
    key: "ed",
    header: "ED 12mo",
    align: "right",
    sortable: true,
    sortValue: (r) => r.ed,
    className: "w-[74px]",
    render: (r) => r.ed,
  },
  {
    key: "contact",
    header: "Last contact",
    sortable: true,
    sortValue: (r) => r.openedAt ?? "",
    className: "w-[150px]",
    render: (r) =>
      r.openedAt ? (
        <span className="font-mono text-[11.5px] font-semibold text-emergent tabular-nums">
          {fmtDateTime(r.openedAt)}
        </span>
      ) : (
        <span className="text-muted-foreground">Routine</span>
      ),
  },
  {
    key: "drivers",
    header: "Risk drivers",
    className: "hidden 2xl:table-cell",
    render: (r) => (
      <span className="flex flex-wrap gap-1">
        {r.drivers.map((d) => (
          <Chip key={d}>{d}</Chip>
        ))}
      </span>
    ),
  },
];

/* ------------------------------------------------------------ chart tabs */

const labColumns: Column<Lab>[] = [
  { key: "name", header: "Test", sortable: true, sortValue: (l) => l.name, render: (l) => l.name },
  {
    key: "value",
    header: "Value",
    align: "right",
    className: "w-[86px]",
    render: (l) => (
      <span className="flex items-center justify-end gap-1.5">
        <span className={l.flag ? "font-semibold" : ""}>{l.value}</span>
        <LabFlagChip flag={l.flag} />
      </span>
    ),
  },
  {
    key: "unit",
    header: "Units",
    className: "w-[70px] text-muted-foreground",
    render: (l) => l.unit,
  },
  {
    key: "ref",
    header: "Reference",
    align: "right",
    className: "w-[92px]",
    // Item 6: the range sits beside the value, so "0.8" can be judged in place
    // rather than remembered against a legend somewhere else.
    render: (l) => <span className="text-muted-foreground">{l.ref}</span>,
  },
  {
    key: "drawn",
    header: "Collected",
    align: "right",
    sortable: true,
    sortValue: (l) => l.drawn,
    className: "w-[130px]",
    render: (l) => <span className="text-muted-foreground">{fmtDateTime(l.drawn)}</span>,
  },
];

const medColumns: Column<Med>[] = [
  {
    key: "name",
    header: "Medication",
    sortable: true,
    sortValue: (m) => m.name,
    render: (m) => <span className="font-medium">{m.name}</span>,
  },
  { key: "dose", header: "Dose", align: "right", className: "w-[80px]", render: (m) => m.dose },
  { key: "sig", header: "Sig", className: "w-[130px]", render: (m) => m.sig },
  {
    key: "started",
    header: "Started",
    align: "right",
    sortable: true,
    sortValue: (m) => m.started,
    className: "w-[100px]",
    render: (m) => <span className="text-muted-foreground">{fmtDateTime(m.started)}</span>,
  },
  {
    key: "alert",
    header: "Alert",
    className: "w-[220px]",
    render: (m) => (m.alert ? <Chip severity="abnormal">{m.alert}</Chip> : null),
  },
];

const encounterColumns: Column<Encounter>[] = [
  {
    key: "when",
    header: "Date / time",
    sortable: true,
    sortValue: (e) => e.when,
    className: "w-[136px]",
    render: (e) => (
      <span className="font-mono text-[11.5px] tabular-nums">{fmtDateTime(e.when)}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    sortValue: (e) => e.type,
    className: "w-[130px]",
    render: (e) => (
      <span className="flex items-center gap-1.5">
        <span className="font-medium">{e.type}</span>
        {e.acute && <Chip severity="critical">ACUTE</Chip>}
      </span>
    ),
  },
  { key: "where", header: "Location", className: "w-[140px]", render: (e) => e.where },
  {
    key: "clinician",
    header: "Clinician",
    className: "w-[120px]",
    render: (e) => <span className="text-muted-foreground">{e.clinician}</span>,
  },
  { key: "disposition", header: "Disposition", render: (e) => e.disposition },
];

function Chart({ p }: { p: PanelPatient }) {
  const abnormal = p.labs.filter((l) => l.flag).length;

  return (
    <ChartTabs defaultValue="snapshot">
      <ChartTabList>
        <ChartTab value="snapshot">Snapshot</ChartTab>
        <ChartTab value="labs" count={p.labs.length}>
          Labs
        </ChartTab>
        <ChartTab value="meds" count={p.meds.length}>
          Meds
        </ChartTab>
        <ChartTab value="encounters" count={p.encounters.length}>
          Encounters
        </ChartTab>
        <ChartTab value="notes" count={p.notes.length}>
          Notes
        </ChartTab>
      </ChartTabList>

      <ChartTabPanel value="snapshot">
        <dl className="grid grid-cols-2 border-b border-hairline bg-card lg:grid-cols-4">
          <Field label="Diagnosis">{p.dx}</Field>
          <Field label="90-day ED risk">
            <span className="font-mono font-semibold tabular-nums">{p.risk}</span>
          </Field>
          <Field label="ED visits, 12 mo">
            <span className="font-mono tabular-nums">{p.ed}</span>
          </Field>
          <Field label="Open contact">{p.openedAt ? fmtDateTime(p.openedAt) : "None open"}</Field>
        </dl>
        <div className="bg-card">
          <SectionHeader title="Risk drivers" aside="Claims-derived, recomputed nightly" />
          <div className="flex flex-wrap gap-1 px-2.5 py-2">
            {p.drivers.length > 0 ? (
              p.drivers.map((d) => (
                <Chip key={d} severity="abnormal">
                  {d}
                </Chip>
              ))
            ) : (
              <span className="text-[12px] text-muted-foreground">
                No active risk drivers. Routine outreach cadence.
              </span>
            )}
          </div>
          <SectionHeader
            title="Abnormal results"
            aside={`${abnormal} of ${p.labs.length} flagged`}
          />
          <DataTable
            label={`Abnormal results for ${p.last}, ${p.first}`}
            rows={p.labs.filter((l) => l.flag)}
            columns={labColumns}
            rowKey={(l) => l.name}
            empty="All results within reference range."
          />
        </div>
      </ChartTabPanel>

      <ChartTabPanel value="labs">
        <DataTable
          label={`Laboratory results for ${p.last}, ${p.first}`}
          rows={p.labs}
          columns={labColumns}
          rowKey={(l) => l.name}
          initialSort={{ key: "drawn", dir: "desc" }}
        />
      </ChartTabPanel>

      <ChartTabPanel value="meds">
        <DataTable
          label={`Active medications for ${p.last}, ${p.first}`}
          rows={p.meds}
          columns={medColumns}
          rowKey={(m) => m.name}
        />
      </ChartTabPanel>

      <ChartTabPanel value="encounters">
        <DataTable
          label={`Encounters for ${p.last}, ${p.first}`}
          rows={p.encounters}
          columns={encounterColumns}
          rowKey={(e) => e.when}
          initialSort={{ key: "when", dir: "desc" }}
        />
      </ChartTabPanel>

      <ChartTabPanel value="notes">
        {/* Notes stay prose in a bordered list rather than a table: a narrative
            forced into a cell either truncates or blows the row rhythm. */}
        <ul className="bg-card">
          {p.notes.map((n) => (
            <li key={n.when} className="border-b border-hairline px-2.5 py-2">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[12.5px] font-semibold text-slate">{n.kind}</span>
                <span className="font-mono text-[11.5px] text-muted-foreground tabular-nums">
                  {fmtDateTime(n.when)}
                </span>
                <span className="text-[11.5px] text-muted-foreground">{n.author}</span>
              </div>
              <p className="mt-0.5 max-w-[92ch] text-[12.5px] leading-[1.45] text-slate">
                {n.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </ChartTabPanel>
    </ChartTabs>
  );
}

/* ----------------------------------------------------------------- shell */

function Placeholder({ section }: { section: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8 text-[12.5px] text-muted-foreground">
      {section} is not part of this prototype.
    </div>
  );
}

function Console() {
  const [section, setSection] = useState<ConsoleSection>("worklist");
  const [selId, setSelId] = useState<string | null>("delgado-m");
  const p = panel.find((r) => r.id === selId) ?? null;

  return (
    // h-screen + overflow-hidden makes this an app shell rather than a
    // document: the rail, the worklist and the chart each scroll on their own,
    // which is what lets the patient banner stay pinned while the chart moves.
    <div className="ehr-shell flex h-screen overflow-hidden bg-canvas">
      <ConsoleSidebar active={section} onSelect={setSection} openCount={panelStats.openContacts} />

      {section !== "worklist" ? (
        <Placeholder section={NAV_LABEL[section]} />
      ) : (
        <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
          <section
            aria-label="Worklist"
            className="flex max-h-[38vh] min-w-0 shrink-0 flex-col border-b border-hairline bg-card xl:max-h-none xl:w-[560px] xl:border-r xl:border-b-0"
          >
            <SectionHeader
              title="Enrolled panel"
              aside={`${panel.length} patients · ${panelStats.openContacts} open`}
            />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DataTable
                label="Enrolled panel worklist"
                rows={panel}
                columns={worklistColumns}
                rowKey={(r) => r.id}
                selected={selId ?? undefined}
                onSelect={(r) => setSelId(r.id)}
                initialSort={{ key: "risk", dir: "desc" }}
              />
              <p className="border-t border-hairline px-2.5 py-2 text-[11px] leading-[1.45] text-muted-foreground">
                Risk scores are model output on simulated claims, recomputed nightly; the top decile
                routes to proactive outreach whether or not the patient calls. Prototype — not for
                clinical use. Photographs depict models, not real patients.
              </p>
            </div>
          </section>

          <section aria-label="Patient chart" className="flex min-w-0 flex-1 flex-col">
            {p ? (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <PatientBanner p={p} />
                  <Chart p={p} />
                </div>
                <ActionBar context={`${p.last}, ${p.first} · MRN ${p.mrn}`} />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
                <UserRound size={16} strokeWidth={1.75} aria-hidden="true" />
                <p className="text-[12.5px]">Select a patient from the worklist.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

const NAV_LABEL: Record<ConsoleSection, string> = {
  worklist: "Worklist",
  schedule: "Schedule",
  results: "Results",
  messages: "In basket",
  orders: "Orders",
  reports: "Reports",
};
