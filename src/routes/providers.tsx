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

      <section className="border-b border-hairline bg-cream/35">
        <div className="mx-auto max-w-[1180px] px-5 py-14">
          <div className="eyebrow">For referring providers</div>
          <h1 className="mt-3 max-w-[20ch] text-[36px] font-semibold leading-[1.1]">
            You should not have to fax a patient into a nine-week queue.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[16px] text-muted-foreground">
            Thyma holds contracted specialty capacity for lupus and rheumatoid arthritis. You send
            the referral; you get a confirmed appointment back, and a coordinator who owns
            everything between now and that visit.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <PortraitStack who={["osei", "kaur", "linde", "brant"]} size="md" />
            <p className="text-[13px] text-muted-foreground">
              Rheumatology, nephrology and dermatology on the receiving end —
              <br className="hidden sm:block" /> plus the coordinator who closes the loop back to
              you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-14">
        <div className="flex flex-wrap gap-2">
          {providerActions.map((a) => (
            <button
              key={a.id}
              onClick={() => setTab(a.id)}
              className={`rounded-md border px-4 py-2.5 text-[13.5px] font-medium transition-colors ${
                tab === a.id
                  ? "border-ink bg-ink text-cream"
                  : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"
              }`}
            >
              {a.title}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[21px] font-semibold">{act.title}</h2>
              <span className="rounded-sm bg-cream px-2.5 py-1 font-mono text-[11.5px] text-plum">
                {act.sla}
              </span>
            </div>
            <p className="mt-3 text-[14.5px] text-muted-foreground">{act.body}</p>
            <ol className="mt-5 border-t border-hairline">
              {act.steps.map((s, i) => (
                <li
                  key={s}
                  className="flex gap-4 border-b border-hairline py-3 text-[14px] last:border-0"
                >
                  <span className="font-mono text-[12px] text-plum">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* Referral form workflow */}
          <div className="panel overflow-hidden">
            <div className="border-b border-hairline bg-cream/60 px-4 py-2.5">
              <span className="eyebrow">Send a referral · sample form</span>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="eyebrow" htmlFor="pt">
                  Patient
                </label>
                <input
                  id="pt"
                  defaultValue="Delgado, Maria · 34F · SLE, class III nephritis"
                  className="mt-1.5 w-full rounded-md border border-hairline bg-paper px-3 py-2 text-[13.5px] outline-none focus:border-plum"
                />
              </div>

              <div>
                <div className="eyebrow">Specialty</div>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {["Rheumatology", "Nephrology", "Dermatology"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpec(s);
                        setSubmitted(false);
                      }}
                      className={`rounded-full border px-3 py-1.5 text-[12.5px] ${spec === s ? "border-action bg-action text-white" : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="eyebrow">Urgency</div>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {["Routine — 2 weeks", "Urgent — 24 h", "Emergent — now"].map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        setUrgency(u);
                        setSubmitted(false);
                      }}
                      className={`rounded-full border px-3 py-1.5 text-[12.5px] ${urgency === u ? "border-action bg-action text-white" : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"}`}
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
                  className="mt-1.5 w-full resize-none rounded-md border border-hairline bg-paper px-3 py-2 text-[13.5px] outline-none focus:border-plum"
                />
              </div>

              <button
                onClick={() => setSubmitted(true)}
                className="rounded-md bg-action px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-action-deep"
              >
                Send referral
              </button>

              {submitted && (
                <div className="rise rounded-md border border-routine/40 bg-routine/8 p-4 text-[13.5px]">
                  <div className="font-semibold text-routine">
                    {urgency.startsWith("Emergent")
                      ? "Escalated — Mercy General pre-notified"
                      : `Slot returned — ${spec}, ${urgency.startsWith("Urgent") ? "tomorrow 8:40 AM" : "next Thursday 2:15 PM"}`}
                  </div>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>→ Patient texted the appointment and directions</li>
                    <li>→ Your note and labs attached to the specialist's chart</li>
                    <li className="flex items-center gap-2">
                      <span>→</span>
                      <Portrait who="brant" size="xs" />
                      Coordinator Tasha Brant assigned; closes the loop back to you
                    </li>
                    <li>→ Prior authorization pre-drafted if the specialist escalates therapy</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-8 text-[13.5px] text-muted-foreground">
          Curious what happens after the referral?{" "}
          <Link to="/app" className="font-semibold text-plum underline underline-offset-4">
            Follow Maria into the member portal
          </Link>
          , or{" "}
          <Link to="/console" className="font-semibold text-plum underline underline-offset-4">
            open the clinical console
          </Link>
          .
        </p>
      </section>

      <SiteFooter />
    </>
  );
}
