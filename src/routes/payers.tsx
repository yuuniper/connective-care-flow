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

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-linear-to-b from-blush-wash via-paper to-paper">
          <div className="mx-auto max-w-[1180px] px-5 py-20">
            <div className="eyebrow">Session ledger and contract economics</div>
            <h1 className="mt-3 max-w-[22ch] text-[38px] font-semibold leading-[1.1] text-ink sm:text-[44px]">
              Only what the mechanism actually avoided.
            </h1>
            <p className="mt-5 max-w-[64ch] text-[17.5px] leading-relaxed">
              Every resolved session posts to a ledger under the lever that produced it. Correct
              escalations to the emergency department are recorded as clinical wins and credited
              zero dollars — the screen has to be allowed to say yes.
            </p>
          </div>
        </section>

        {/* Two levers */}
        <section className="mx-auto max-w-[1180px] px-5 pt-16">
          <div className="eyebrow">Two levers, two savings pools, counted separately</div>
          <h2 className="mt-3 max-w-[30ch] text-[30px] font-semibold text-ink">
            A deflected visit and a prevented admission are avoided by different mechanisms. No
            dollar is claimed twice.
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
              <div key={l.lever} className="panel-soft p-7">
                <div className="text-[14px] font-medium text-rose-deep">{l.lever}</div>
                <div className="mt-1.5 text-[21px] font-semibold text-ink">{l.t}</div>
                <div className="mt-5 font-display text-[38px] font-semibold leading-none text-ink">
                  {l.v}
                </div>
                <p className="mt-2.5 font-mono text-[12.5px] text-muted-foreground">{l.calc}</p>
                <p className="mt-5 border-t border-hairline pt-4 text-[14.5px] text-muted-foreground">
                  {l.m}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
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
              <div key={c.k} className="panel-soft p-6">
                <div className="text-[14px] font-medium text-rose-deep">{c.k}</div>
                <div className="mt-2 font-display text-[30px] font-semibold leading-none text-ink">
                  {c.v}
                </div>
                <p className="mt-2.5 text-[14px] text-muted-foreground">{c.s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {payerStats.map((s, i) => (
              <div key={s.k} className={`panel-soft p-6 ${i === 2 ? "bg-ink-deep" : ""}`}>
                <div
                  className={`font-display text-[34px] font-semibold leading-none ${i === 2 ? "text-cream" : "text-ink"}`}
                >
                  {s.v}
                </div>
                <div
                  className={`mt-2.5 text-[14px] ${i === 2 ? "text-cream/75" : "text-muted-foreground"}`}
                >
                  {s.k}
                </div>
              </div>
            ))}
          </div>

          <div className="panel mt-10 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-5">
              <h2 className="font-display text-[19px] font-semibold text-ink">
                Contract model — 8,000 engaged members
              </h2>
              <span className="rounded-full bg-blush-soft px-3 py-1 text-[13.5px] font-medium text-rose-deep">
                $100 PMPM + 20% of net savings above fees
              </span>
            </div>
            {payerMath.map((m) => (
              <div
                key={m.label}
                className={`flex flex-wrap items-baseline justify-between gap-4 border-t border-hairline px-5 py-3.5 ${m.total ? "bg-blush-wash font-medium" : ""}`}
              >
                <span className="text-[15px] text-slate">
                  {m.label}
                  <span className="ml-3 font-mono text-[12.5px] font-normal text-muted-foreground">
                    {m.calc}
                  </span>
                </span>
                <span className={`font-mono text-[15px] ${m.neg ? "text-emergent" : "text-slate"}`}>
                  {m.amt}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                tag: "Deflected",
                tone: "bg-urgent/12 text-urgent",
                t: "Avoided emergency department visit",
                s: "Low-acuity flare routed to next-day rheumatology",
                v: "$2,000",
              },
              {
                tag: "Prevented",
                tone: "bg-routine/12 text-routine",
                t: "Avoided admission",
                s: "Therapy gap closed after a PA appeal",
                v: "$18,000",
              },
              {
                tag: "Escalated",
                tone: "bg-emergent/12 text-emergent",
                t: "Correct escalation to the ED",
                s: "Febrile hypotension on immunosuppression",
                v: "$0",
              },
            ].map((r) => (
              <div key={r.tag} className="panel-soft p-6">
                <span className={`rounded-full px-3 py-1 text-[13.5px] font-medium ${r.tone}`}>
                  {r.tag}
                </span>
                <div className="mt-4 text-[16px] font-medium text-slate">{r.t}</div>
                <div className="mt-1 text-[14px] text-muted-foreground">{r.s}</div>
                <div className="mt-4 border-t border-hairline pt-4 font-mono text-[19px] font-semibold text-ink">
                  {r.v}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-[80ch] text-[14px] leading-relaxed text-muted-foreground">
            Per-member savings reflect the 1.5× super-utilizer concentration factor — enrollment
            deliberately targets the high-utilizer tail, not the average member. Unit costs ($2,000
            per avoided ED visit, $18,000 per avoided admission) follow the July 2026 sizing deck.
            Every cell here is an editable input in the model.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
