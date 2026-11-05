import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Portrait, PortraitStack } from "@/components/thyma/portrait";
import { SiteFooter, SiteHeader } from "@/components/thyma/site-chrome";
import { providerActions } from "@/data/thyma";

export const Route = createFileRoute("/providers")({
  head: () => ({
    meta: [
      { title: "Refer a patient — Thyma for providers" },
      {
        name: "description",
        content:
          "Refer autoimmune patients to rheumatology, nephrology or dermatology in days, fill urgent prescriptions the same day, or escalate to the ED with a warm handoff.",
      },
      { property: "og:title", content: "Refer a patient — Thyma for providers" },
      {
        property: "og:description",
        content:
          "One form, a confirmed appointment back, and a coordinator who owns the prior authorization.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Providers,
});

function Providers() {
  const [tab, setTab] = useState(providerActions[0]!.id);
  const [urgency, setUrgency] = useState("Urgent — 24 h");
  const [spec, setSpec] = useState("Rheumatology");
  const [submitted, setSubmitted] = useState(false);
  const act = providerActions.find((a) => a.id === tab)!;

  return (
    <>
      <SiteHeader />

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-linear-to-b from-blush-wash via-paper to-paper">
          <div className="mx-auto max-w-[1180px] px-5 py-20">
            <div className="eyebrow">For referring providers</div>
            <h1 className="mt-3 max-w-[22ch] text-[38px] font-semibold leading-[1.1] text-ink sm:text-[44px]">
              You should not have to fax a patient into a nine-week queue.
            </h1>
            <p className="mt-5 max-w-[62ch] text-[17.5px] leading-relaxed">
              Thyma holds contracted specialty capacity for lupus and rheumatoid arthritis. You send
              the referral; you get a confirmed appointment back, and a coordinator who owns
              everything between now and that visit.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <PortraitStack who={["osei", "kaur", "linde", "brant"]} size="md" />
              <p className="text-[15px] text-muted-foreground">
                Rheumatology, nephrology and dermatology on the receiving end —
                <br className="hidden sm:block" /> plus the coordinator who closes the loop back to
                you.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 pb-20">
          <div className="flex flex-wrap gap-2.5">
            {providerActions.map((a) => (
              <button
                key={a.id}
                onClick={() => setTab(a.id)}
                className={`rounded-full border px-4 py-2 text-[14.5px] font-medium transition-colors ${
                  tab === a.id
                    ? "border-action bg-action text-cream"
                    : "border-hairline bg-card text-slate hover:border-plum hover:bg-blush-wash"
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <div className="panel-soft p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[23px] font-semibold text-ink">{act.title}</h2>
                <span className="rounded-full bg-blush-soft px-3 py-1 text-[13.5px] font-medium text-rose-deep">
                  {act.sla}
                </span>
              </div>
              <p className="mt-3 text-[16px]">{act.body}</p>
              <ol className="mt-6 space-y-4">
                {act.steps.map((s, i) => (
                  <li key={s} className="flex items-baseline gap-3.5 text-[15.5px] text-slate">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blush-soft font-display text-[13.5px] font-semibold text-ink">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* Referral form workflow */}
            <div className="panel overflow-hidden">
              <div className="px-5 pt-5">
                <span className="eyebrow">Send a referral · sample form</span>
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <label className="eyebrow" htmlFor="pt">
                    Patient
                  </label>
                  <input
                    id="pt"
                    defaultValue="Delgado, Maria · 34F · SLE, class III nephritis"
                    className="mt-2 w-full rounded-xl border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-slate outline-none focus:border-plum"
                  />
                </div>

                <div>
                  <div className="eyebrow">Specialty</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Rheumatology", "Nephrology", "Dermatology"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSpec(s);
                          setSubmitted(false);
                        }}
                        className={`rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${spec === s ? "border-action bg-action text-cream" : "border-hairline bg-card text-slate hover:border-plum hover:bg-blush-wash"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="eyebrow">Urgency</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Routine — 2 weeks", "Urgent — 24 h", "Emergent — now"].map((u) => (
                      <button
                        key={u}
                        onClick={() => {
                          setUrgency(u);
                          setSubmitted(false);
                        }}
                        className={`rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${urgency === u ? "border-action bg-action text-cream" : "border-hairline bg-card text-slate hover:border-plum hover:bg-blush-wash"}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="eyebrow" htmlFor="why">
                    What made you worried
                  </label>
                  <textarea
                    id="why"
                    rows={2}
                    defaultValue="UPCR 1.9 g/g, new ankle oedema x3 days, foamy urine. No fever, BP 118/74."
                    className="mt-2 w-full resize-none rounded-xl border border-hairline bg-paper px-3.5 py-2.5 text-[15px] text-slate outline-none focus:border-plum"
                  />
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="rounded-full bg-action px-5 py-2.5 text-[14.5px] font-medium text-cream transition-colors hover:bg-action-deep"
                >
                  Send referral
                </button>

                {submitted && (
                  <div className="rise rounded-2xl bg-routine/10 p-5 text-[15px]">
                    <div className="font-medium text-routine">
                      {urgency.startsWith("Emergent")
                        ? "Escalated — Mercy General pre-notified"
                        : `Slot returned — ${spec}, ${urgency.startsWith("Urgent") ? "tomorrow 8:40 AM" : "next Thursday 2:15 PM"}`}
                    </div>
                    <ul className="mt-3 space-y-2 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-routine" />
                        Patient texted the appointment and directions
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-routine" />
                        Your note and labs attached to the specialist's chart
                      </li>
                      <li className="flex items-center gap-3">
                        <Portrait who="brant" size="xs" />
                        Tasha Brant assigned as coordinator; she closes the loop back to you
                      </li>
                      <li className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-routine" />
                        Prior authorization pre-drafted if the specialist escalates therapy
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-10 text-[15px] text-muted-foreground">
            Curious what happens after the referral?{" "}
            <Link
              to="/app"
              className="font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 hover:text-ink"
            >
              Follow Maria into the member portal
            </Link>
            , or{" "}
            <Link
              to="/console"
              className="font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 hover:text-ink"
            >
              open the clinical console
            </Link>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
