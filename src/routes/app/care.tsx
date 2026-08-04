import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, FileCheck2 } from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import { Portrait } from "@/components/thyma/portrait";
import { careTeam, referralSlots } from "@/data/thyma";

export const Route = createFileRoute("/app/care")({
  head: () => ({
    meta: [
      { title: "Care team & referrals — Thyma member portal" },
      {
        name: "description",
        content:
          "Rheumatology, nephrology and dermatology in one shared chart, with contracted specialist slots bookable in days rather than months.",
      },
      { property: "og:title", content: "Care team & referrals — Thyma member portal" },
      {
        property: "og:description",
        content:
          "Book a specialist in days, see who shares your chart, and track prior authorizations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Care,
});

function Care() {
  const [picked, setPicked] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const slot = referralSlots.find((s) => s.id === picked) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Referrals · shared record · prior authorizations</div>
        <h1 className="mt-1.5 text-[28px] font-semibold">Your care team</h1>
        <p className="mt-1 max-w-[70ch] text-[15.5px] text-muted-foreground">
          Four people, one chart, one medication list. When rheumatology changes your dose,
          nephrology sees it the same afternoon.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {careTeam.map((c) => (
          <article key={c.id} className="panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3.5">
                <Portrait who={c.photo} size="lg" />
                <div className="min-w-0">
                  <div className="eyebrow">{c.role}</div>
                  <h2 className="mt-1 text-[18px] font-semibold">{c.name}</h2>
                  <div className="text-[13.5px] text-muted-foreground">{c.site}</div>
                </div>
              </div>
              <span className="whitespace-nowrap rounded-sm border border-hairline bg-cream px-2 py-1 font-mono text-[12.5px] text-plum">
                {c.next}
              </span>
            </div>
            <p className="mt-3 border-t border-hairline pt-3 text-[14px] text-muted-foreground">
              {c.note}
            </p>
          </article>
        ))}
      </section>

      {/* Booking workflow */}
      <section className="panel overflow-hidden">
        <PanelHeader
          icon={CalendarPlus}
          tone="urgent"
          title="Open referral"
          aside={
            <span className="font-mono font-semibold text-urgent">Urgent — book within 24 h</span>
          }
        />

        <div className="p-5">
          <h2 className="text-[18px] font-semibold">Choose a slot</h2>
          <p className="mt-1 max-w-[70ch] text-[14.5px] text-muted-foreground">
            These are contracted Thyma slots, held open for members with an active red flag. Median
            time to seen across the network is four days.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {referralSlots.map((s) => {
              const on = picked === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setPicked(s.id);
                    setConfirmed(null);
                  }}
                  className={`rounded-md border p-3.5 text-left transition-colors ${
                    on
                      ? "border-plum bg-cream shadow-panel"
                      : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"
                  }`}
                >
                  <div className="eyebrow">{s.spec}</div>
                  <div className="mt-1 font-semibold">{s.when}</div>
                  <div className="mt-1.5 flex items-center gap-2 text-[13.5px] text-muted-foreground">
                    <Portrait who={s.photo} size="xs" />
                    {s.who}
                  </div>
                  <div className="mt-2 border-t border-hairline pt-2 font-mono text-[12px] text-plum">
                    {s.mode} · {s.tag}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              disabled={!slot || !!confirmed}
              onClick={() => slot && setConfirmed(slot.id)}
              className="rounded-md bg-action px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-action-deep disabled:opacity-40"
            >
              {confirmed ? "Appointment confirmed ✓" : "Confirm appointment"}
            </button>
            {!picked && (
              <span className="text-[13.5px] text-muted-foreground">Pick a slot to continue.</span>
            )}
          </div>

          {confirmed && slot && (
            <div className="rise mt-4 rounded-md border border-routine/40 bg-routine/8 p-4 text-[14.5px]">
              <div className="font-semibold text-routine">
                Confirmed — {slot.when} with {slot.who}
              </div>
              <ul className="mt-2 space-y-1.5 text-muted-foreground">
                <li>→ Records, trend chart and last labs sent ahead automatically</li>
                <li>→ Ride credit issued; text reminder 2 hours before</li>
                <li>→ Dr. Osei notified so the two visits do not duplicate work</li>
                <li>→ Tasha will call you the morning after with the plan in plain language</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Auth tracker */}
      <section className="panel overflow-hidden">
        <PanelHeader icon={FileCheck2} title="Prior authorizations & prescriptions" />
        <ul className="text-[14.5px]">
          {[
            {
              t: "Mycophenolate 1 g BID · 90-day",
              s: "Approved",
              tone: "text-routine",
              d: "Reopened Fri, approved Mon",
            },
            {
              t: "Prednisone bridge 20 mg",
              s: "Filled",
              tone: "text-routine",
              d: "Same night, Vine Street",
            },
            {
              t: "Belimumab (if labs confirm)",
              s: "Pre-drafted",
              tone: "text-urgent",
              d: "Submits automatically on Dr. Kaur's sign-off",
            },
          ].map((r) => (
            <li
              key={r.t}
              className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-3 last:border-0"
            >
              <span className="min-w-[220px] flex-1 font-medium">{r.t}</span>
              <span className="text-[13.5px] text-muted-foreground">{r.d}</span>
              <span className={`font-mono text-[13px] ${r.tone}`}>{r.s}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[14px] text-muted-foreground">
        Need something tonight instead?{" "}
        <Link to="/app/chat" className="font-semibold text-plum underline underline-offset-4">
          Ask Thyma
        </Link>{" "}
        and the agent books it for you.
      </p>
    </div>
  );
}
