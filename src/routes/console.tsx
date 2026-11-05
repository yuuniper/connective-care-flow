import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PhoneCall, UserRound, Users } from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import { Portrait } from "@/components/thyma/portrait";
import { SkipLink, Wordmark } from "@/components/thyma/site-chrome";
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
      <SkipLink />
      <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5">
          <Link to="/">
            <Wordmark />
          </Link>
          <span className="hidden text-[13.5px] text-muted-foreground sm:block">
            Clinical console · Meridian Health Plan
          </span>
          <div className="ml-auto flex items-center gap-4">
            {/* The pulsing alert dot stays: unlike the member portal, this
                surface exists so a coordinator notices an open contact. */}
            <span className="inline-flex items-center gap-2 rounded-full bg-emergent/12 px-3 py-1 text-[13.5px] font-medium text-emergent">
              <span className="pulse-dot size-2 rounded-full bg-emergent" /> 2 open contacts
            </span>
            <Link
              to="/app"
              className="rounded-full bg-action px-4 py-2 text-[14px] font-medium text-cream transition-colors hover:bg-action-deep"
            >
              Member view
            </Link>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-[1240px] px-5 py-8 outline-none">
        <div className="eyebrow">Claims-based risk stratification</div>
        <h1 className="mt-2 text-[32px] font-semibold text-ink">
          The high-utilizer tail, surfaced before the flare
        </h1>
        <p className="mt-2.5 max-w-[74ch] text-[17px]">
          Eligibility and claims feeds rank the enrolled panel on 90-day ED risk: prior ED use,
          nephritis, steroid bursts, polypharmacy, missed infusions and lapsed prior authorizations.
          Select a member to see what the platform is doing for them right now.
        </p>

        <div className="mt-8 flex flex-wrap gap-10">
          {[
            ["8,412", "Enrolled members"],
            ["1,190", "High-risk tier"],
            ["2", "Open contacts tonight"],
            ["4 days", "Median time to specialist"],
          ].map(([v, k]) => (
            <div key={k}>
              <div className="font-display text-[26px] font-semibold leading-tight text-ink">
                {v}
              </div>
              <div className="text-[14px] text-muted-foreground">{k}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="panel min-w-0 overflow-hidden">
            <PanelHeader icon={Users} title="Enrolled panel" aside="Risk recomputed nightly" />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr className="border-t border-hairline">
                    {["Member", "90-day ED risk", "ED 12mo", "Risk drivers", "Status"].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-3.5 py-2.5 text-left text-[13px] font-medium text-muted-foreground"
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
                      className={`cursor-pointer border-t border-hairline ${sel === r.name ? "bg-peri-wash" : "hover:bg-blush-wash"}`}
                    >
                      <td className="px-3.5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Portrait
                            who={r.photo}
                            size="sm"
                            className={r.live ? "" : "opacity-60 saturate-50"}
                          />
                          <div className="min-w-0">
                            <div
                              className={`font-medium ${r.live ? "text-slate" : "text-muted-foreground"}`}
                            >
                              {r.name}
                            </div>
                            <div className="text-[13.5px] text-muted-foreground">{r.meta}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-plum/15">
                            <span
                              className={`block h-full rounded-full ${r.risk > 85 ? "bg-emergent" : "bg-plum"}`}
                              style={{ width: `${r.risk}%` }}
                            />
                          </span>
                          <span className="font-mono text-[14px] font-semibold text-slate">
                            {r.risk}
                          </span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3.5 font-mono text-slate">{r.ed}</td>
                      <td className="hidden px-3.5 py-3.5 md:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {r.drivers.map((d) => (
                            <span
                              key={d}
                              className="whitespace-nowrap rounded-full bg-blush-soft px-2.5 py-0.5 text-[13px] font-medium text-rose-deep"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3.5 py-3.5">
                        {r.open ? (
                          <span className="inline-flex items-center gap-2 whitespace-nowrap text-[14px] font-medium text-emergent">
                            <span className="pulse-dot size-2 rounded-full bg-emergent" /> Open{" "}
                            {r.open}
                          </span>
                        ) : (
                          <span className="whitespace-nowrap text-[14px] text-muted-foreground">
                            Routine outreach
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="panel min-w-0 overflow-hidden">
            <PanelHeader icon={UserRound} title="Member detail" />
            {row ? (
              <div className="border-t border-hairline p-5">
                <div className="flex items-center gap-3.5">
                  <Portrait who={row.photo} size="lg" />
                  <div className="min-w-0">
                    <div className="font-display text-[20px] font-semibold text-ink">
                      {row.name}
                    </div>
                    <div className="text-[14px] text-muted-foreground">{row.meta}</div>
                  </div>
                </div>
                <dl className="mt-4 text-[14.5px]">
                  {[
                    ["90-day ED risk", String(row.risk)],
                    ["ED visits, 12 mo", String(row.ed)],
                    ["Contact", row.open ?? "None open"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between gap-3 border-t border-hairline py-2.5"
                    >
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium text-slate">{v}</dd>
                    </div>
                  ))}
                </dl>
                {row.open ? (
                  <Link
                    to="/app/chat"
                    className="mt-5 flex items-center justify-center gap-2 rounded-full bg-action px-4 py-2.5 text-center text-[14.5px] font-medium text-cream transition-colors hover:bg-action-deep"
                  >
                    <PhoneCall size={14} strokeWidth={2.25} /> Open triage session
                  </Link>
                ) : (
                  <p className="mt-5 text-[14.5px] text-muted-foreground">
                    No open contact. Scheduled for proactive outreach in this week's queue.
                  </p>
                )}
              </div>
            ) : (
              <p className="p-6 text-center text-[15px] text-muted-foreground">Select a member.</p>
            )}
          </aside>
        </div>

        <p className="mt-8 max-w-[80ch] text-[14px] leading-relaxed text-muted-foreground">
          Risk scores are model output on simulated claims. In production the score is recomputed
          nightly and the top decile is routed to proactive outreach regardless of whether the
          member calls. Prototype — not for clinical use. Photographs depict models, not real
          members or patients; no one pictured has any condition named on this site.
        </p>
      </main>
    </div>
  );
}
