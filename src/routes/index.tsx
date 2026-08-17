import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/thyma/site-chrome";
import { Portrait } from "@/components/thyma/portrait";
import { mariaPortrait } from "@/data/people";
import { beforeAfter, careTeam, patient, voices } from "@/data/thyma";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thyma — Coordinated care for lupus and rheumatoid arthritis" },
      {
        name: "description",
        content:
          "Thyma is one care team for lupus and rheumatoid arthritis: specialists who share a record, someone who picks up at 2 a.m., and a check-in between visits so nothing falls through the gaps.",
      },
      {
        property: "og:title",
        content: "Thyma — Coordinated care for lupus and rheumatoid arthritis",
      },
      {
        property: "og:description",
        content:
          "Thyma is one care team for lupus and rheumatoid arthritis: specialists who share a record, someone who picks up at 2 a.m., and a check-in between visits so nothing falls through the gaps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const capabilities = [
  {
    n: "1",
    step: "Finding you",
    title: "We reach out before the flare does",
    to: "/console" as const,
    cta: "See how we find people",
    body: "Your health plan's records already show who is most likely to end up in an emergency room this year. We start the conversation before that happens, instead of after.",
  },
  {
    n: "2",
    step: "The hard nights",
    title: "One number that answers at 2 a.m.",
    to: "/app/chat" as const,
    cta: "Walk through a hard night",
    body: "Tell us what's happening in your own words. There are nurses and a rheumatologist behind every answer. We'll say honestly whether tonight is a home night, a morning visit, or a real emergency — and if it's the emergency, we call ahead.",
  },
  {
    n: "3",
    step: "Getting seen",
    title: "Specialists in days, reading the same chart",
    to: "/app/care" as const,
    cta: "Meet the care team",
    body: "Next-day rheumatology, prescriptions the same day, and one record every one of your doctors reads. Your coordinator takes on the insurance paperwork rather than handing you a phone number.",
  },
  {
    n: "4",
    step: "In between",
    title: "We check in between visits, not just during them",
    to: "/app/tracking" as const,
    cta: "See what we track",
    body: "A ninety-second check-in and regular labs, so a number moving the wrong way becomes a lab order this week instead of a biopsy next year.",
  },
  {
    n: "5",
    step: "Company",
    title: "People who know exactly what this is like",
    to: "/app/community" as const,
    cta: "Visit the community",
    body: "Small moderated rooms by condition and life stage, with a care coordinator in the conversation. What gets shared there shapes your care plan.",
  },
];

function Home() {
  const lead = careTeam.find((c) => c.lead) ?? careTeam[0]!;

  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="bg-linear-to-b from-blush-wash via-paper to-paper">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 pb-16 pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20 lg:pt-24">
          <div>
            <h1 className="text-[38px] font-semibold leading-[1.1] text-ink sm:text-[48px]">
              Lupus is complicated enough.
              <br />
              Your care shouldn't be.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17.5px] leading-relaxed">
              When you live with lupus or rheumatoid arthritis, you can end up holding your own care
              together — repeating your history to a rheumatologist, a kidney doctor, and an
              emergency room that have never spoken to each other. Thyma is one team that shares one
              record, picks up when you call, and checks in on the quiet weeks too.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to="/app/chat"
                className="rounded-full bg-action px-6 py-3.5 text-[15.5px] font-medium text-cream shadow-panel transition-colors hover:bg-action-deep"
              >
                Walk through a night with Maria
              </Link>
              <Link
                to="/app"
                className="text-[15.5px] font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 hover:text-ink"
              >
                or look around her portal
              </Link>
            </div>
          </div>

          <figure className="lg:justify-self-end">
            <img
              src={mariaPortrait}
              alt={patient.photoAlt}
              width={880}
              height={587}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-3/2 w-full rounded-2xl object-cover shadow-lift"
            />
            <figcaption className="mt-5 space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-[16px] font-medium text-slate">Maria, {patient.age}</span>
                <span className="text-[15px] text-muted-foreground">Lupus</span>
              </div>
              <div className="flex items-center gap-2.5 text-[15px] text-muted-foreground">
                <Portrait who={lead.photo} size="sm" />
                <span>
                  Next visit with <span className="font-medium text-slate">{lead.name}</span>,{" "}
                  {lead.next}
                </span>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* What went wrong before */}
      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <div className="max-w-[58ch]">
          <div className="eyebrow">Maria's year before Thyma</div>
          <h2 className="mt-3 text-[34px] font-semibold text-ink">
            Nobody made a mistake. The care still failed.
          </h2>
          <p className="mt-4 text-[17px]">
            Every person she saw that year was competent and did something reasonable. None of them
            could see what the last one saw.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-16">
          <ol className="relative space-y-8 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-hairline">
            {beforeAfter.before.map((r) => (
              <li key={r.when} className="relative pl-8">
                <span className="absolute left-0 top-2.5 size-2.5 rounded-full bg-rose ring-4 ring-paper" />
                <div className="text-[14.5px] font-semibold text-rose-deep">{r.when}</div>
                <p className="mt-1 text-[16.5px] text-slate">{r.what}</p>
                <span className="mt-2 inline-block rounded-full bg-emergent/10 px-3 py-1 text-[13.5px] font-medium text-emergent">
                  {r.cost}
                </span>
              </li>
            ))}
          </ol>

          <div className="panel-soft h-fit overflow-hidden">
            <div className="bg-peri-wash px-6 py-4">
              <h3 className="text-[19px] font-semibold text-ink">The same person, with us</h3>
              <p className="mt-0.5 text-[14.5px] text-muted-foreground">
                Enrolled March 2026. Nothing about her disease got easier — the year around it did.
              </p>
            </div>
            <ol className="space-y-6 px-6 py-6">
              {beforeAfter.after.map((r) => (
                <li key={r.when}>
                  <div className="text-[14.5px] font-semibold text-plum">{r.when}</div>
                  <p className="mt-0.5 text-[16px] text-slate">{r.what}</p>
                  <span className="mt-1.5 inline-block text-[14px] font-medium text-plum">
                    {r.cost}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Maria, in her own words */}
      <section className="wash-band">
        <div className="mx-auto max-w-[1180px] px-5 py-20">
          <figure className="mx-auto max-w-[46rem] text-center">
            <Portrait who="maria" size="xl" alt="" className="ring-4 ring-paper" />
            <blockquote className="mt-7 font-display text-[26px] font-medium leading-[1.35] text-ink sm:text-[31px]">
              “Four months between one doctor saying <em>see nephrology</em> and actually seeing
              nephrology. By then it wasn't a referral anymore. It was a biopsy.”
            </blockquote>
            <figcaption className="mt-6 text-[15.5px] text-muted-foreground">
              <span className="font-medium text-slate">{patient.name}</span> · in the Thyma
              community
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The 7pm problem */}
      <section className="bg-ink-deep">
        <div className="mx-auto max-w-[1180px] px-5 py-24">
          <h2 className="max-w-[30ch] font-display text-[34px] font-semibold leading-[1.2] text-cream sm:text-[40px]">
            It's 7 p.m. and a flare is starting. The only door open is the emergency room.
          </h2>
          <p className="mt-6 max-w-[56ch] text-[17.5px] leading-relaxed text-cream/80">
            Most of those visits happen because there was nowhere else to call. Thyma is somewhere
            else to call — day or night, someone picks up, listens to the whole thing, and books
            what tonight actually needs.
          </p>
          <Link
            to="/payers"
            className="mt-9 inline-block rounded-full border border-cream/45 px-6 py-3 text-[15.5px] font-medium text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            How this works for health plans
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1180px] px-5 py-20">
          <div className="max-w-[52ch]">
            <div className="eyebrow">How it works</div>
            <h2 className="mt-3 text-[34px] font-semibold text-ink">
              Five things we do, over and over, for as long as you need us.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <Link
                key={c.n}
                to={c.to}
                className="panel-soft group flex flex-col p-7 transition-shadow hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-blush-soft font-display text-[15px] font-semibold text-ink">
                    {c.n}
                  </span>
                  <span className="text-[14.5px] font-semibold text-plum">{c.step}</span>
                </div>
                <h3 className="mt-4 text-[21px] font-semibold leading-snug text-ink">{c.title}</h3>
                <p className="mt-3 flex-1 text-[16px]">{c.body}</p>
                <span className="mt-5 inline-block text-[15px] font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 group-hover:text-ink">
                  {c.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Voices */}
      <section className="mx-auto max-w-[1180px] px-5 py-20">
        <div className="max-w-[46ch]">
          <div className="eyebrow">From the people in it</div>
          <h2 className="mt-3 text-[34px] font-semibold text-ink">
            The part that's hard to put in a brochure.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {voices.map((v) => (
            <figure key={v.name} className="panel-accent flex h-full flex-col p-7">
              <blockquote className="flex-1 text-[17px] leading-relaxed text-slate">
                “{v.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Portrait who={v.photo} size="md" />
                <span className="text-[14.5px]">
                  <span className="block font-medium text-slate">{v.name}</span>
                  <span className="text-muted-foreground">{v.meta}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto grid max-w-[1180px] gap-6 px-5 pb-20 md:grid-cols-2">
        <Link
          to="/providers"
          className="panel-soft group block p-8 transition-shadow hover:shadow-lift"
        >
          <div className="eyebrow">If you're referring someone in</div>
          <h3 className="mt-2 text-[24px] font-semibold text-ink">
            Send a referral, get an appointment back
          </h3>
          <p className="mt-3 text-[16.5px]">
            Specialty slots within days, urgent prescriptions the same day, and an escalation path
            that tells the emergency room your patient is coming and why.
          </p>
          <span className="mt-5 inline-block text-[15px] font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 group-hover:text-ink">
            See the referral workflow →
          </span>
        </Link>
        <Link
          to="/payers"
          className="panel-soft group block p-8 transition-shadow hover:shadow-lift"
        >
          <div className="eyebrow">If you're a health plan</div>
          <h3 className="mt-2 text-[24px] font-semibold text-ink">
            Paid for what the care actually prevented
          </h3>
          <p className="mt-3 text-[16.5px]">
            Risk stratification across your high-utilizer members, a session-level ledger, and
            correct emergency escalations credited at zero dollars.
          </p>
          <span className="mt-5 inline-block text-[15px] font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 group-hover:text-ink">
            See the contract model →
          </span>
        </Link>
      </section>

      <SiteFooter />
    </>
  );
}
