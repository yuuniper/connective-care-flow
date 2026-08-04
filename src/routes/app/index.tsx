import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlarmClock,
  CalendarClock,
  CircleCheck,
  ClipboardList,
  FlaskConical,
  ListTodo,
  MessageCircleWarning,
  Pill,
} from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import { Portrait } from "@/components/thyma/portrait";
import { careTeam, checkins, patient, recentLabs } from "@/data/thyma";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Today — Maria Delgado | Thyma member portal" },
      {
        name: "description",
        content:
          "Maria's Thyma dashboard: today's plan, upcoming specialist visits, medications and open items across her care team.",
      },
      { property: "og:title", content: "Today — Maria Delgado | Thyma member portal" },
      {
        property: "og:description",
        content:
          "One coordinated view of a lupus nephritis care plan across rheumatology, nephrology and dermatology.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Today,
});

function Today() {
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Tuesday · 7:04 PM</div>
        <h1 className="mt-1.5 text-[28px] font-semibold">Good evening, {patient.first}.</h1>
        <p className="mt-1 max-w-[68ch] text-[15.5px] text-muted-foreground">
          Two things need you today, and one thing is being handled for you. Nothing here requires a
          phone tree.
        </p>
      </div>

      {/* Action queue */}
      <section className="panel overflow-hidden">
        <PanelHeader
          icon={ListTodo}
          title="Your queue"
          aside={<span className="font-mono">3 items</span>}
        />

        <div className="flex flex-wrap items-center gap-4 border-b border-hairline px-4 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-urgent px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-white">
            <AlarmClock size={11} strokeWidth={2.5} /> Do now
          </span>
          <div className="min-w-[220px] flex-1">
            <div className="font-semibold">Log tonight's check-in</div>
            <div className="text-[13.5px] text-muted-foreground">
              90 seconds. Stiffness, swelling, energy, meds taken.
            </div>
          </div>
          <Link
            to="/app/tracking"
            className="rounded-md bg-action px-3.5 py-2 text-[14px] font-semibold text-white hover:bg-action-deep"
          >
            Start check-in
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-b border-hairline px-4 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-emergent px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-white">
            <MessageCircleWarning size={11} strokeWidth={2.5} /> Symptoms?
          </span>
          <div className="min-w-[220px] flex-1">
            <div className="font-semibold">Something feels off tonight</div>
            <div className="text-[13.5px] text-muted-foreground">
              Ask Thyma runs the red-flag screen and books what you need. Answers 24/7.
            </div>
          </div>
          <Link
            to="/app/chat"
            className="rounded-md bg-action px-3.5 py-2 text-[14px] font-semibold text-white hover:bg-action-deep"
          >
            Ask Thyma
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-4 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-routine px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-white">
            <CircleCheck size={11} strokeWidth={2.5} /> Handled
          </span>
          <div className="min-w-[220px] flex-1">
            <div className="font-semibold">Mycophenolate refill authorization</div>
            <div className="mt-0.5 flex items-start gap-2 text-[13.5px] text-muted-foreground">
              <Portrait who="brant" size="xs" className="mt-0.5" />
              <span>
                Tasha reopened the prior auth Friday. Approved this morning; 90-day supply ready at
                Vine Street.
              </span>
            </div>
          </div>
          <span className="font-mono text-[13px] text-routine">No action needed</span>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        {/* Appointments + results */}
        <div className="space-y-5">
          <section className="panel overflow-hidden">
            <PanelHeader
              icon={CalendarClock}
              title="Coming up"
              aside="One shared chart across every visit"
            />
            <ul>
              {careTeam.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-3.5 last:border-0"
                >
                  <Portrait who={c.photo} size="md" />
                  <div className="min-w-[180px] flex-1">
                    <div className="font-semibold">
                      {c.name}
                      {c.lead && (
                        <span className="ml-2 rounded-sm border border-hairline px-2 py-0.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-plum">
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="text-[13.5px] text-muted-foreground">
                      {c.role} · {c.site}
                    </div>
                  </div>
                  <span className="font-mono text-[13.5px] text-plum">{c.next}</span>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3">
              <Link
                to="/app/care"
                className="text-[14px] font-semibold text-plum underline underline-offset-4 hover:text-ink"
              >
                Manage referrals and visits →
              </Link>
            </div>
          </section>

          {/* Lab results */}
          <section className="panel overflow-hidden">
            <PanelHeader
              icon={FlaskConical}
              title="Recent results"
              aside={<span className="font-mono">Jul 28 · Vine St lab</span>}
            />
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-hairline bg-cream/40 text-left">
                  {["Test", "Result", "Reference", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLabs.map((l) => (
                  <tr key={l.name} className="border-b border-hairline last:border-0">
                    <td className="px-4 py-2.5 font-medium">{l.name}</td>
                    <td
                      className={`px-4 py-2.5 font-mono ${l.flag ? "font-semibold text-urgent" : ""}`}
                    >
                      {l.value} {l.unit}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[13px] text-muted-foreground">
                      {l.ref}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {l.flag && (
                        <span className="rounded-sm bg-urgent/15 px-1.5 py-0.5 font-mono text-[11.5px] font-bold text-urgent">
                          {l.flag}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-hairline px-4 py-2.5 text-[13px] text-muted-foreground">
              Reviewed by Dr. Kaur · trending in{" "}
              <Link
                to="/app/tracking"
                className="font-semibold text-plum underline underline-offset-4"
              >
                Between visits
              </Link>
            </p>
          </section>
        </div>

        {/* Regimen + recent */}
        <div className="space-y-5">
          <section className="panel overflow-hidden">
            <PanelHeader icon={Pill} title="Current regimen" />
            <ul className="space-y-2 p-4 text-[14.5px]">
              {patient.regimen.map((r) => (
                <li
                  key={r}
                  className="flex items-baseline gap-2.5 border-b border-hairline pb-2 last:border-0"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-action" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="px-4 pb-4 text-[13px] text-muted-foreground">
              Every prescriber on your team writes against this one list.
            </p>
          </section>

          <section className="panel overflow-hidden">
            <PanelHeader icon={ClipboardList} title="Recent check-ins" />
            <ul className="space-y-3 p-4">
              {checkins.slice(0, 3).map((c) => (
                <li
                  key={c.day}
                  className="border-b border-hairline pb-3 text-[14px] last:border-0 last:pb-0"
                >
                  <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                    {c.day}
                  </div>
                  <div className="mt-1">{c.items.join(" · ")}</div>
                  {c.flag && (
                    <div className="mt-1.5 text-[13px] font-medium text-urgent">↳ {c.flag}</div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
