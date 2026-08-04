import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PhoneCall, UserRound, Users } from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import { Portrait } from "@/components/thyma/portrait";
import { Wordmark } from "@/components/thyma/site-chrome";
import type { PersonKey } from "@/data/people";

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

const roster: {
  name: string;
  photo: PersonKey;
  meta: string;
  risk: number;
  ed: number;
  open: string | null;
  drivers: string[];
  live: boolean;
}[] = [
  {
    name: "Maria Delgado",
    photo: "maria",
    meta: "34 · F · SLE + class III nephritis",
    risk: 87,
    ed: 2,
    open: "7:02 PM",
    drivers: ["2 ED visits", "3 steroid bursts", "Nephritis", "PA lapse 6wk"],
    live: true,
  },
  {
    name: "Alicia Brooks",
    photo: "alicia",
    meta: "41 · F · SLE, prednisone 40 mg taper",
    risk: 91,
    ed: 3,
    open: "2:14 AM",
    drivers: ["3 ED visits", "Steroid 40mg", "Immunosuppressed"],
    live: true,
  },
  {
    name: "Dennis Ochoa",
    photo: "dennis",
    meta: "66 · M · RA, erosive",
    risk: 58,
    ed: 1,
    open: null,
    drivers: ["Biologic gap 74d"],
    live: false,
  },
  {
    name: "Priya Raman",
    photo: "priya",
    meta: "29 · F · SLE",
    risk: 64,
    ed: 1,
    open: null,
    drivers: ["Missed infusion"],
    live: false,
  },
  {
    name: "Karen Liu",
    photo: "karen",
    meta: "47 · F · SLE",
    risk: 41,
    ed: 0,
    open: null,
    drivers: [],
    live: false,
  },
];

function Console() {
  const [sel, setSel] = useState<string | null>("Maria Delgado");
  const row = roster.find((r) => r.name === sel) ?? null;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline-dark bg-ink">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-5 py-3">
          <Link to="/">
            <Wordmark />
          </Link>
          <span className="hidden border-l border-hairline-dark pl-4 text-[13.5px] text-cream/60 sm:block">
            Clinical console · Meridian Health Plan
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-sm border border-hairline-dark bg-cream/10 px-2.5 py-1 font-mono text-[12.5px] text-cream">
              <span className="pulse-dot size-1.5 rounded-full bg-emergent" /> 2 open contacts
            </span>
            <Link
              to="/app"
              className="rounded-sm bg-indigo px-3 py-1.5 text-[13.5px] font-semibold text-white hover:bg-white/90 hover:text-ink"
            >
              Member view
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 py-8">
        <div className="eyebrow">Claims-based risk stratification</div>
        <h1 className="mt-2 text-[28px] font-semibold">
          The high-utilizer tail, surfaced before the flare
        </h1>
        <p className="mt-2 max-w-[74ch] text-[15.5px] text-muted-foreground">
          Eligibility and claims feeds rank the enrolled panel on 90-day ED risk: prior ED use,
          nephritis, steroid bursts, polypharmacy, missed infusions and lapsed prior authorizations.
          Select a member to see what the platform is doing for them right now.
        </p>

        <div className="mt-6 flex flex-wrap gap-8">
          {[
            ["8,412", "Enrolled members"],
            ["1,190", "High-risk tier"],
            ["2", "Open contacts tonight"],
            ["4 days", "Median time to specialist"],
          ].map(([v, k]) => (
            <div key={k}>
              <div className="font-display text-[22px] font-semibold leading-tight">{v}</div>
              <div className="text-[13px] text-muted-foreground">{k}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="panel overflow-hidden">
            <PanelHeader
              icon={Users}
              title="Enrolled panel"
              aside={<span className="font-mono">Risk recomputed nightly</span>}
            />
            <table className="w-full border-collapse text-[14.5px]">
              <thead>
                <tr className="bg-cream">
                  {["Member", "90-day ED risk", "ED 12mo", "Risk drivers", "Status"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-hairline px-3.5 py-2.5 text-left font-mono text-[12.5px] font-medium uppercase tracking-[0.08em] text-plum"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roster.map((r) => (
                  <tr
                    key={r.name}
                    onClick={() => setSel(r.name)}
                    className={`cursor-pointer border-b border-hairline/60 last:border-0 ${sel === r.name ? "bg-plum/10" : "hover:bg-plum/5"}`}
                  >
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Portrait
                          who={r.photo}
                          size="sm"
                          className={r.live ? "" : "opacity-60 saturate-50"}
                        />
                        <div className="min-w-0">
                          <div className={`font-semibold ${r.live ? "" : "text-muted-foreground"}`}>
                            {r.name}
                          </div>
                          <div className="text-[13px] text-muted-foreground">{r.meta}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-[5px] w-14 overflow-hidden rounded-full bg-plum/15">
                          <span
                            className={`block h-full rounded-full ${r.risk > 85 ? "bg-emergent" : "bg-plum"}`}
                            style={{ width: `${r.risk}%` }}
                          />
                        </span>
                        <span className="font-mono text-[13.5px] font-semibold">{r.risk}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 font-mono">{r.ed}</td>
                    <td className="hidden px-3.5 py-3 md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {r.drivers.map((d) => (
                          <span
                            key={d}
                            className="rounded-sm border border-hairline bg-paper px-2 py-1 font-mono text-[12.5px] text-plum"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      {r.open ? (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[13px] font-semibold uppercase tracking-[0.06em] text-emergent">
                          <span className="pulse-dot size-1.5 rounded-full bg-emergent" /> Open{" "}
                          {r.open}
                        </span>
                      ) : (
                        <span className="text-[13.5px] text-muted-foreground">
                          Routine outreach
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="panel overflow-hidden">
            <PanelHeader icon={UserRound} title="Member detail" />
            {row ? (
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Portrait who={row.photo} size="lg" />
                  <div className="min-w-0">
                    <div className="font-display text-[18px] font-semibold">{row.name}</div>
                    <div className="text-[13.5px] text-muted-foreground">{row.meta}</div>
                  </div>
                </div>
                <dl className="mt-3 border-t border-hairline text-[13.5px]">
                  {[
                    ["90-day ED risk", String(row.risk)],
                    ["ED visits, 12 mo", String(row.ed)],
                    ["Contact", row.open ?? "None open"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between gap-3 border-b border-hairline py-2 last:border-0"
                    >
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-mono font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                {row.open ? (
                  <Link
                    to="/app/chat"
                    className="mt-4 flex items-center justify-center gap-2 rounded-md bg-action px-4 py-2.5 text-center text-[14px] font-semibold text-white hover:bg-action-deep"
                  >
                    <PhoneCall size={14} strokeWidth={2.25} /> Open triage session
                  </Link>
                ) : (
                  <p className="mt-4 text-[13.5px] text-muted-foreground">
                    No open contact. Scheduled for proactive outreach in this week's queue.
                  </p>
                )}
              </div>
            ) : (
              <p className="p-6 text-center text-[14px] text-muted-foreground">Select a member.</p>
            )}
          </aside>
        </div>

        <p className="mt-6 max-w-[80ch] text-[13.5px] text-muted-foreground">
          Risk scores are model output on simulated claims. In production the score is recomputed
          nightly and the top decile is routed to proactive outreach regardless of whether the
          member calls. Prototype — not for clinical use. Photographs depict models, not real
          members or patients; no one pictured has any condition named on this site.
        </p>
      </div>
    </div>
  );
}
