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
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Referrals and prior authorizations</div>
        <h1 className="mt-1.5 text-[32px] font-semibold text-ink">Your care team</h1>
        <p className="mt-2 max-w-[66ch] text-[17px]">
          Four people, one chart, one medication list. When your rheumatologist changes a dose, your
          kidney doctor sees it the same afternoon.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        {careTeam.map((c) => (
          <article key={c.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-4">
                <Portrait who={c.photo} size="lg" />
                <div className="min-w-0">
                  <div className="eyebrow">{c.role}</div>
                  <h2 className="mt-1 text-[20px] font-semibold text-ink">{c.name}</h2>
                  <div className="text-[14.5px] text-muted-foreground">{c.site}</div>
                </div>
              </div>
              <span className="whitespace-nowrap text-[14.5px] font-medium text-plum">
                {c.next}
              </span>
            </div>
            <p className="mt-4 border-t border-hairline pt-4 text-[15px] text-muted-foreground">
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
            <span className="rounded-full bg-urgent/12 px-3 py-1 text-[13.5px] font-medium text-urgent">
              Book within 24 hours
            </span>
          }
        />

        <div className="border-t border-hairline p-5">
          <h2 className="text-[20px] font-semibold text-ink">Choose a time</h2>
          <p className="mt-1.5 max-w-[66ch] text-[15px] text-muted-foreground">
            These are slots Thyma holds open for members who need to be seen quickly. Across the
            network, most people are seen within four days.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {referralSlots.map((s) => {
              const on = picked === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setPicked(s.id);
                    setConfirmed(null);
                  }}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    on
                      ? "border-plum bg-blush-wash shadow-panel"
                      : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"
                  }`}
                >
                  <div className="eyebrow">{s.spec}</div>
                  <div className="mt-1 text-[16px] font-medium text-slate">{s.when}</div>
                  <div className="mt-2 flex items-center gap-2 text-[14px] text-muted-foreground">
                    <Portrait who={s.photo} size="xs" />
                    {s.who}
                  </div>
                  <div className="mt-3 border-t border-hairline pt-3 text-[13.5px] text-plum">
                    {s.mode} · {s.tag}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              aria-live="polite"
              disabled={!slot || !!confirmed}
              onClick={() => slot && setConfirmed(slot.id)}
              className={`rounded-full px-5 py-2.5 text-[14.5px] font-medium text-cream transition-colors ${
                confirmed ? "bg-routine" : "bg-action hover:bg-action-deep disabled:opacity-40"
              }`}
            >
              {confirmed ? "Appointment confirmed" : "Confirm appointment"}
            </button>
            {!picked && (
              <span className="text-[14.5px] text-muted-foreground">Pick a time to continue.</span>
            )}
          </div>

          {confirmed && slot && (
            <div className="rise mt-5 rounded-2xl bg-routine/10 p-5 text-[15px]">
              <div className="font-medium text-routine">
                Confirmed — {slot.when} with {slot.who}
              </div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {[
                  "Your records, trend chart and last labs go ahead of you",
                  "Ride credit issued, and a text reminder two hours before",
                  "Dr. Osei notified, so the two visits do not repeat each other",
                  "Tasha calls you the morning after, in plain language",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-routine" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Auth tracker */}
      <section className="panel overflow-hidden">
        <PanelHeader icon={FileCheck2} title="Prescriptions and paperwork" />
        <ul className="text-[15px]">
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
              className="flex flex-wrap items-center gap-3 border-t border-hairline px-5 py-3.5"
            >
              <span className="min-w-[220px] flex-1 font-medium text-slate">{r.t}</span>
              <span className="text-[14px] text-muted-foreground">{r.d}</span>
              <span
                className={`rounded-full px-3 py-1 text-[13.5px] font-medium ${r.tone === "text-routine" ? "bg-routine/12 text-routine" : "bg-urgent/12 text-urgent"}`}
              >
                {r.s}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[15px] text-muted-foreground">
        Need something tonight instead?{" "}
        <Link
          to="/app/chat"
          className="font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 hover:text-ink"
        >
          Ask Thyma
        </Link>{" "}
        and we book it for you.
      </p>
    </div>
  );
}
