import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/thyma/site-chrome";
import { payerMath, payerStats } from "@/data/thyma";

export const Route = createFileRoute("/payers")({
  head: () => ({
    meta: [
      { title: "Contract model — Thyma for health plans" },
      {
        name: "description",
        content:
          "Risk stratification on the autoimmune high-utilizer tail, a session ledger of what was actually avoided, and a $100 PMPM plus shared-savings contract.",
      },
      { property: "og:title", content: "Contract model — Thyma for health plans" },
      {
        property: "og:description",
        content:
          "Correct ED escalations are credited at zero dollars. Only what the mechanism avoided counts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Payers,
});

function Payers() {
  return (
    <>
      <SiteHeader />

      <section className="border-b border-hairline bg-cream/35">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className="eyebrow">Session ledger & contract economics</div>
          <h1 className="mt-3 max-w-[22ch] text-[36px] font-semibold leading-[1.1]">
            Only what the mechanism actually avoided.
          </h1>
          <p className="mt-4 max-w-[64ch] text-[16px] text-muted-foreground">
            Every resolved session posts to a ledger under the lever that produced it. Correct
            escalations to the emergency department are recorded as clinical wins and credited zero
            dollars — the screen has to be allowed to say yes.
          </p>
        </div>
      </section>

      {/* Two levers */}
      <section className="mx-auto max-w-[1180px] px-5 pt-14">
        <div className="eyebrow">Two levers, two savings pools, counted separately</div>
        <h2 className="mt-3 max-w-[30ch] text-[26px] font-semibold">
          A deflected visit and a prevented admission are avoided by different mechanisms. No dollar
          is claimed twice.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            {
              lever: "Lever 1",
              t: "Deflect the visit",
              v: "$0.94B",
              calc: "554K low-acuity visits × 85% that don't admit × $2,000",
              m: "Symptom triage line plus contracted next-day rheumatology access.",
            },
            {
              lever: "Lever 2",
              t: "Prevent the admission",
              v: "$0.52B",
              calc: "320K ED-originating admissions × 9% preventable × $18,000",
              m: "DMARD adherence, prior-auth navigation, lab monitoring, management of lupus-specific ambulatory-care-sensitive conditions.",
            },
          ].map((l) => (
            <div key={l.lever} className="panel p-6">
              <div className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-plum">
                {l.lever}
              </div>
              <div className="mt-2 text-[19px] font-semibold">{l.t}</div>
              <div className="mt-4 font-display text-[34px] font-semibold leading-none">{l.v}</div>
              <p className="mt-2 font-mono text-[11.5px] text-muted-foreground">{l.calc}</p>
              <p className="mt-4 border-t border-hairline pt-3 text-[13px] text-muted-foreground">
                {l.m}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-3">
          {[
            {
              k: "TAM",
              v: "$1.46B",
              s: "Lever 1 ($0.94B) + Lever 2 ($0.52B), mechanism-separated",
            },
            {
              k: "SAM",
              v: "$175M",
              s: "~12% in target plans — Medicaid MCOs and regional plans in launch states",
            },
            {
              k: "SOM",
              v: "$19.7M",
              s: "25% enrolled × 30% efficacy × 1.5× super-utilizer targeting",
            },
          ].map((c) => (
            <div key={c.k} className="bg-card p-5">
              <div className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-plum">
                {c.k}
              </div>
              <div className="mt-2 font-display text-[28px] font-semibold leading-none">{c.v}</div>
              <p className="mt-2 text-[12.5px] text-muted-foreground">{c.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {payerStats.map((s, i) => (
            <div key={s.k} className={`panel p-5 ${i === 2 ? "border-ink bg-ink" : ""}`}>
              <div
                className={`font-display text-[31px] font-semibold leading-none ${i === 2 ? "text-cream" : ""}`}
              >
                {s.v}
              </div>
              <div
                className={`mt-2 text-[12.5px] ${i === 2 ? "text-cream/65" : "text-muted-foreground"}`}
              >
                {s.k}
              </div>
            </div>
          ))}
        </div>

        <div className="panel mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-cream/60 px-4 py-3">
            <strong className="font-display text-[15px]">
              Contract model — 8,000 engaged members
            </strong>
            <span className="font-mono text-[12px] text-plum">
              $100 PMPM + 20% of net savings above fees
            </span>
          </div>
          {payerMath.map((m) => (
            <div
              key={m.label}
              className={`flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline px-4 py-3 last:border-0 ${m.total ? "bg-cream/40 font-semibold" : ""}`}
            >
              <span className="text-[14px]">
                {m.label}
                <span className="ml-3 font-mono text-[11.5px] font-normal text-muted-foreground">
                  {m.calc}
                </span>
              </span>
              <span className={`font-mono text-[14px] ${m.neg ? "text-emergent" : ""}`}>
                {m.amt}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              tag: "Deflected",
              tone: "bg-urgent",
              t: "Avoided emergency department visit",
              s: "Low-acuity flare routed to next-day rheumatology",
              v: "$2,000",
            },
            {
              tag: "Prevented",
              tone: "bg-routine",
              t: "Avoided admission",
              s: "Therapy gap closed after a PA appeal",
              v: "$18,000",
            },
            {
              tag: "Escalated",
              tone: "bg-emergent",
              t: "Correct escalation to the ED",
              s: "Febrile hypotension on immunosuppression",
              v: "$0",
            },
          ].map((r) => (
            <div key={r.tag} className="panel p-5">
              <span
                className={`rounded-sm px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.07em] text-white ${r.tone}`}
              >
                {r.tag}
              </span>
              <div className="mt-3 text-[14.5px] font-semibold">{r.t}</div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">{r.s}</div>
              <div className="mt-3 border-t border-hairline pt-3 font-mono text-[17px] font-semibold">
                {r.v}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[80ch] text-[12.5px] text-muted-foreground">
          Per-member savings reflect the 1.5× super-utilizer concentration factor — enrollment
          deliberately targets the high-utilizer tail, not the average member. Unit costs ($2,000
          per avoided ED visit, $18,000 per avoided admission) follow the July 2026 sizing deck.
          Every cell here is an editable input in the model.
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
