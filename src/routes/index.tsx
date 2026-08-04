import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/thyma/site-chrome";
import { Portrait } from "@/components/thyma/portrait";
import { mariaPortrait } from "@/data/people";
import { beforeAfter, careTeam, patient } from "@/data/thyma";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thyma — Coordinated virtual care for autoimmune disease" },
      {
        name: "description",
        content:
          "Thyma is virtual managed care for lupus and rheumatoid arthritis: referral in, coordinated specialty care, and tracking between visits so nothing falls through the gaps.",
      },
      { property: "og:title", content: "Thyma — Coordinated virtual care for autoimmune disease" },
      {
        property: "og:description",
        content:
          "Thyma is virtual managed care for lupus and rheumatoid arthritis: referral in, coordinated specialty care, and tracking between visits so nothing falls through the gaps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const capabilities = [
  {
    n: "01",
    step: "Identify",
    title: "Claims find the tail before the flare does",
    to: "/console" as const,
    cta: "Open the risk panel",
    body: "Claims data surfaces the members most likely to end up in the emergency department, so enrollment starts before the flare does.",
  },
  {
    n: "02",
    step: "Triage",
    title: "One number that answers at 2 AM",
    to: "/app/chat" as const,
    cta: "Walk through the night flare",
    body: "A symptom-triggered agent, with nurses and rheumatology behind it, runs a red-flag screen in plain language — then routes you home, to an urgent visit, or to the ED with the receiving team already notified.",
  },
  {
    n: "03",
    step: "Fast access",
    title: "Specialists in days, in the same chart",
    to: "/app/care" as const,
    cta: "See the care team",
    body: "Next-day rheumatology slots, urgent prescriptions, and one shared record across specialties. A coordinator owns the prior authorization instead of handing you a phone number.",
  },
  {
    n: "04",
    step: "Stay controlled",
    title: "Tracked between the visits, not just during them",
    to: "/app/tracking" as const,
    cta: "Open the trend log",
    body: "Daily check-ins and lab monitoring between appointments, so a trend that moves the wrong way becomes a lab order this week — not a biopsy next year.",
  },
  {
    n: "05",
    step: "Stay connected",
    title: "People who have the same disease",
    to: "/app/community" as const,
    cta: "Visit the community",
    body: "Moderated rooms by condition and life stage, with a care coordinator in the thread. What gets shared shapes the care plan.",
  },
];

function Home() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-hairline bg-linear-to-br from-blush-wash via-paper to-blush-soft/50">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-16 lg:grid-cols-[1.35fr_1fr] lg:py-20">
          <div>
            <h1 className="text-[38px] font-semibold leading-[1.08] sm:text-[52px]">
              Coordinated autoimmune care,
              <br />
              before the next flare.
            </h1>
            <p className="mt-5 max-w-[58ch] text-[16px] text-muted-foreground">
              The average lupus patient bounces between a rheumatologist, a nephrologist and an
              emergency department that have never spoken. Thyma holds them together — triage, fast
              specialist access, and tracking between visits, so a flare becomes a lab order this
              week instead of an ER visit tonight.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/app/chat"
                className="rounded-md bg-action px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-action-deep"
              >
                Walk through Maria's night flare
              </Link>
              <Link
                to="/app"
                className="text-[14px] font-medium text-plum underline underline-offset-4"
              >
                or start in her portal
              </Link>
            </div>
          </div>

          <div className="panel self-start overflow-hidden">
            <div className="relative">
              <img
                src={mariaPortrait}
                alt={patient.photoAlt}
                width={880}
                height={587}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-3/2 w-full object-cover"
              />
              <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-ink/70 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-cream">
                <span className="pulse-dot size-1.5 rounded-full bg-white/90" /> Enrolled
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 via-ink/55 to-transparent px-4 pb-3.5 pt-12">
                <div className="font-display text-[20px] font-semibold text-cream">
                  {patient.name}
                </div>
                <p className="text-[12.5px] text-cream/80">
                  {patient.age} · {patient.dx}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Portrait who={careTeam[0]!.photo} size="sm" />
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-medium">
                    Next visit — {careTeam[0]!.name}
                  </div>
                  <div className="truncate text-[11.5px] text-muted-foreground">
                    {careTeam[0]!.role} · {careTeam[0]!.site}
                  </div>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[12px] text-plum">{careTeam[0]!.next}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The gap */}
      <section className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="max-w-[62ch]">
          <div className="eyebrow">The year before Thyma</div>
          <h2 className="mt-3 text-[28px] font-semibold">
            Nobody made a mistake. The care still failed.
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Maria's 2025, reconstructed from claims. Each row is a competent clinician doing a
            reasonable thing without seeing what the last one saw.
          </p>
        </div>

        <ol className="mt-9 border-t border-hairline">
          {beforeAfter.before.map((r) => (
            <li
              key={r.when}
              className="grid gap-2 border-b border-hairline py-4 sm:grid-cols-[110px_minmax(0,1fr)_180px] sm:items-baseline"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                {r.when}
              </span>
              <span className="text-[15px]">{r.what}</span>
              <span className="font-mono text-[13px] text-emergent sm:text-right">{r.cost}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <blockquote className="border-l-2 border-action pl-5 font-display text-[21px] leading-snug">
            “Four months between one doctor saying <em>see nephrology</em> and actually seeing
            nephrology. By then it wasn't a referral anymore. It was a biopsy.”
            <footer className="mt-4 flex items-center gap-3 font-sans text-[13px] font-normal text-muted-foreground">
              <Portrait who="maria" size="lg" />
              <span>
                <span className="block font-semibold text-ink">{patient.name}</span>
                in the Thyma community
              </span>
            </footer>
          </blockquote>

          <div className="panel overflow-hidden">
            <div className="border-b border-hairline bg-cream/60 px-4 py-2.5">
              <span className="eyebrow">The same patient, on the platform</span>
            </div>
            <ul>
              {beforeAfter.after.map((r) => (
                <li
                  key={r.when}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-hairline px-4 py-3 last:border-0"
                >
                  <span className="w-[70px] font-mono text-[11.5px] uppercase text-muted-foreground">
                    {r.when}
                  </span>
                  <span className="flex-1 text-[13.5px]">{r.what}</span>
                  <span className="font-mono text-[12px] text-routine">{r.cost}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Brand band */}
      <section className="gradient-brand border-y border-hairline-dark">
        <div className="mx-auto max-w-[1180px] px-5 py-16">
          <h2 className="max-w-[28ch] font-display text-[30px] font-semibold leading-snug text-white">
            It's 7pm and a flare is starting. The only door open is the emergency department.
          </h2>
          <p className="mt-4 max-w-[54ch] text-[15px] text-white/85">
            Most of those visits are access failures, not emergencies. Thyma exists so there is a
            better door — one that answers, sorts safely, and books what tonight actually needs.
          </p>
          <Link
            to="/payers"
            className="mt-6 inline-block text-[13.5px] font-semibold text-white underline underline-offset-4 hover:text-white/80"
          >
            The numbers behind this, for health plans →
          </Link>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-hairline bg-cream/35">
        <div className="mx-auto max-w-[1180px] px-5 py-16">
          <div className="eyebrow">How it works</div>
          <h2 className="mt-3 max-w-[24ch] text-[28px] font-semibold">
            Five steps in one loop, from claims data to controlled disease.
          </h2>

          <div className="mt-10 border-t border-hairline">
            {capabilities.map((c) => (
              <div
                key={c.n}
                className="grid gap-3 border-b border-hairline py-6 md:grid-cols-[132px_minmax(0,1.1fr)_minmax(0,1.4fr)] md:gap-8"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {c.n} · {c.step}
                </div>
                <h3 className="text-[18px] font-semibold leading-snug">{c.title}</h3>
                <div>
                  <p className="text-[14px] text-muted-foreground">{c.body}</p>
                  <Link
                    to={c.to}
                    className="mt-2.5 inline-block text-[13.5px] font-semibold text-plum underline underline-offset-4 hover:text-ink"
                  >
                    {c.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto grid max-w-[1180px] gap-5 px-5 py-16 md:grid-cols-2">
        <Link to="/providers" className="panel group block p-7 transition-shadow hover:shadow-lift">
          <div className="eyebrow">For referring providers</div>
          <h3 className="mt-2 text-[21px] font-semibold">Refer in, and get an appointment back</h3>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Specialty slots within days, urgent prescriptions the same day, and a one-tap ED
            escalation that pre-notifies the receiving team.
          </p>
          <span className="mt-4 inline-block text-[13.5px] font-semibold text-plum group-hover:text-ink">
            See the referral workflow →
          </span>
        </Link>
        <Link to="/payers" className="panel group block p-7 transition-shadow hover:shadow-lift">
          <div className="eyebrow">For health plans</div>
          <h3 className="mt-2 text-[21px] font-semibold">Paid on what the mechanism avoided</h3>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Risk stratification on the high-utilizer tail, a session ledger, and correct ED
            escalations credited at zero dollars.
          </p>
          <span className="mt-4 inline-block text-[13.5px] font-semibold text-plum group-hover:text-ink">
            See the contract model →
          </span>
        </Link>
      </section>

      <SiteFooter />
    </>
  );
}
