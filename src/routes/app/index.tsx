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

/**
 * Queue markers. Tinted disc + sentence case rather than the previous
 * uppercase monospace on a saturated fill — three of those stacked in one
 * panel read as an alarm console, which is the wrong register for someone
 * checking in on a bad evening.
 */
const MARKERS = {
  now: "bg-urgent/12 text-urgent",
  symptoms: "bg-emergent/12 text-emergent",
  handled: "bg-routine/12 text-routine",
} as const;

function Marker({
  tone,
  icon: Icon,
  children,
}: {
  tone: keyof typeof MARKERS;
  icon: typeof AlarmClock;
  children: React.ReactNode;
}) {
  return (
    // Fixed-width slot so the three queue titles start on the same x; the pill
    // inside keeps its natural width rather than being padded to fill it.
    <span className="w-[124px] shrink-0">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13.5px] font-medium ${MARKERS[tone]}`}
      >
        <Icon size={13} strokeWidth={2.25} />
        {children}
      </span>
    </span>
  );
}

function Today() {
  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Tuesday evening</div>
        <h1 className="mt-1.5 text-[32px] font-semibold text-ink">
          Good evening, {patient.first}.
        </h1>
        <p className="mt-2 max-w-[64ch] text-[17px]">
          Two things need you today, and one is already being handled. Nothing here requires a phone
          tree.
        </p>
      </div>

      {/* Action queue */}
      <section className="panel overflow-hidden">
        <PanelHeader icon={ListTodo} title="Your queue" aside="3 things" />

        <div className="flex flex-wrap items-start gap-4 border-t border-hairline px-5 py-4">
          <Marker tone="now" icon={AlarmClock}>
            Do now
          </Marker>
          <div className="min-w-[220px] flex-1">
            <div className="font-medium text-slate">Log tonight's check-in</div>
            <div className="text-[14.5px] text-muted-foreground">
              90 seconds. Stiffness, swelling, energy, meds taken.
            </div>
          </div>
          <Link
            to="/app/tracking"
            className="rounded-full bg-action px-4 py-2 text-[14.5px] font-medium text-cream transition-colors hover:bg-action-deep"
          >
            Start check-in
          </Link>
        </div>

        <div className="flex flex-wrap items-start gap-4 border-t border-hairline px-5 py-4">
          <Marker tone="symptoms" icon={MessageCircleWarning}>
            Feeling off?
          </Marker>
          <div className="min-w-[220px] flex-1">
            <div className="font-medium text-slate">Something feels off tonight</div>
            <div className="text-[14.5px] text-muted-foreground">
              Tell us what's going on in your own words. A nurse reads it and books what you need,
              any hour.
            </div>
          </div>
          <Link
            to="/app/chat"
            className="rounded-full bg-action px-4 py-2 text-[14.5px] font-medium text-cream transition-colors hover:bg-action-deep"
          >
            Ask Thyma
          </Link>
        </div>

        <div className="flex flex-wrap items-start gap-4 border-t border-hairline px-5 py-4">
          <Marker tone="handled" icon={CircleCheck}>
            Handled
          </Marker>
          <Portrait who="brant" size="sm" alt="Tasha Brant, RN" />
          <div className="min-w-[220px] flex-1">
            <div className="font-medium text-slate">Your mycophenolate refill</div>
            <div className="text-[14.5px] text-muted-foreground">
              Tasha reopened the prior authorization on Friday. Approved this morning — a 90-day
              supply is ready at Vine Street.
            </div>
          </div>
          <span className="text-[14.5px] text-routine">Nothing for you to do</span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Appointments + results */}
        <div className="min-w-0 space-y-6">
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
                  className="flex flex-wrap items-center gap-3 border-t border-hairline px-5 py-4"
                >
                  <Portrait who={c.photo} size="md" />
                  <div className="min-w-[180px] flex-1">
                    <div className="font-medium text-slate">
                      {c.name}
                      {c.lead && (
                        <span className="ml-2 rounded-full bg-blush-soft px-2.5 py-0.5 text-[12.5px] font-medium text-rose-deep">
                          Care lead
                        </span>
                      )}
                    </div>
                    <div className="text-[14.5px] text-muted-foreground">
                      {c.role} · {c.site}
                    </div>
                  </div>
                  <span className="text-[14.5px] font-medium text-plum">{c.next}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-hairline px-5 py-4">
              <Link
                to="/app/care"
                className="text-[14.5px] font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 hover:text-ink"
              >
                Manage referrals and visits →
              </Link>
            </div>
          </section>

          {/* Lab results */}
          <section className="panel overflow-hidden">
            <PanelHeader icon={FlaskConical} title="Recent results" aside="28 July · Vine St lab" />
            {/* Only the test name is allowed to wrap; values and ranges stay on
                one line so the numbers remain comparable down the column. That
                gives the table a min-width, so it scrolls on a phone rather
                than stretching the page. */}
            <div className="overflow-x-auto">
              <table className="w-full text-[15px]">
                <thead>
                  <tr className="border-t border-hairline text-left text-[13px] font-medium text-muted-foreground">
                    <th className="py-2.5 pl-5 pr-3 font-medium">Test</th>
                    <th className="whitespace-nowrap px-3 py-2.5 font-medium">Result</th>
                    <th className="whitespace-nowrap px-3 py-2.5 font-medium">Usual range</th>
                    <th className="py-2.5 pl-3 pr-5" />
                  </tr>
                </thead>
                <tbody>
                  {recentLabs.map((l) => (
                    <tr key={l.name} className="border-t border-hairline">
                      <td className="py-3 pl-5 pr-3 text-slate">{l.name}</td>
                      <td
                        className={`whitespace-nowrap px-3 py-3 font-mono ${l.flag ? "font-semibold text-urgent" : "text-slate"}`}
                      >
                        {l.value} {l.unit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-[14px] text-muted-foreground">
                        {l.ref}
                      </td>
                      <td className="py-3 pl-3 pr-5 text-right">
                        {l.flag && (
                          <span className="whitespace-nowrap rounded-full bg-urgent/12 px-2.5 py-0.5 text-[13px] font-medium text-urgent">
                            {l.flag === "H" ? "High" : "Low"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-hairline px-5 py-3.5 text-[14px] text-muted-foreground">
              Reviewed by Dr. Kaur · trending in{" "}
              <Link
                to="/app/tracking"
                className="font-medium text-plum underline decoration-blush decoration-2 underline-offset-4"
              >
                Between visits
              </Link>
            </p>
          </section>
        </div>

        {/* Regimen + recent */}
        <div className="min-w-0 space-y-6">
          <section className="panel overflow-hidden">
            <PanelHeader icon={Pill} title="Current regimen" />
            <ul className="space-y-3 px-5 pb-2 pt-1 text-[15.5px]">
              {patient.regimen.map((r) => (
                <li key={r} className="flex items-baseline gap-3 text-slate">
                  <span className="size-1.5 shrink-0 rounded-full bg-rose" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="px-5 pb-5 pt-3 text-[14px] text-muted-foreground">
              Every doctor on your team prescribes from this one list.
            </p>
          </section>

          <section className="panel overflow-hidden">
            <PanelHeader icon={ClipboardList} title="Recent check-ins" />
            <ul className="space-y-4 px-5 pb-5 pt-1">
              {checkins.slice(0, 3).map((c) => (
                <li key={c.day} className="text-[15px]">
                  <div className="text-[14px] font-medium text-rose-deep">{c.day}</div>
                  <div className="mt-1 text-slate">{c.items.join(" · ")}</div>
                  {c.flag && (
                    <div className="mt-1.5 text-[14px] font-medium text-plum">→ {c.flag}</div>
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
