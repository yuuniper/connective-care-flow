import { Link } from "@tanstack/react-router";

export function Wordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={`font-display text-[19px] font-bold tracking-[0.22em] ${
        tone === "light" ? "text-cream" : "text-ink"
      }`}
    >
      THY<span className={tone === "light" ? "text-blush" : "text-rose"}>MA</span>
    </span>
  );
}

const nav = [
  { to: "/", label: "Platform" },
  { to: "/providers", label: "For providers" },
  { to: "/payers", label: "For plans" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline-dark bg-ink">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-7 gap-y-2 px-5 py-3.5">
        <Link to="/" className="flex items-center gap-3">
          <Wordmark />
        </Link>
        <span className="hidden border-l border-hairline-dark pl-4 text-[12.5px] text-cream/60 md:block">
          Virtual managed care for autoimmune disease
        </span>
        <nav className="ml-auto flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-sm px-2.5 py-1.5 text-[13.5px] text-cream/60 transition-colors hover:text-cream data-[status=active]:text-cream"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/app"
            className="ml-2 rounded-sm bg-indigo px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/90 hover:text-ink"
          >
            Open Maria's portal
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline bg-cream/40">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark tone="dark" />
          <p className="mt-3 max-w-[46ch] text-[13.5px] text-muted-foreground">
            One platform where autoimmune patients get referred in, receive coordinated specialty
            care, and stay tracked between visits.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Product</div>
          <ul className="space-y-1.5 text-[13.5px]">
            <li>
              <Link to="/app" className="hover:text-plum">
                Patient portal
              </Link>
            </li>
            <li>
              <Link to="/app/chat" className="hover:text-plum">
                Ask Thyma
              </Link>
            </li>
            <li>
              <Link to="/app/community" className="hover:text-plum">
                Community
              </Link>
            </li>
            <li>
              <Link to="/console" className="hover:text-plum">
                Clinical console
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Company</div>
          <ul className="space-y-1.5 text-[13.5px]">
            <li>
              <Link to="/providers" className="hover:text-plum">
                For providers
              </Link>
            </li>
            <li>
              <Link to="/payers" className="hover:text-plum">
                For health plans
              </Link>
            </li>
            <li>
              <span className="text-muted-foreground">Conditions: SLE, RA</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <p className="mx-auto max-w-[1180px] px-5 py-5 text-[12px] leading-relaxed text-muted-foreground">
          <strong className="font-semibold text-slate">Prototype.</strong> Members, claims,
          transcripts and scores are simulated. The red-flag screen illustrates sorting logic; it is
          not a validated clinical decision instrument and is not for clinical use.{" "}
          <strong className="font-semibold text-slate">Photographs depict models,</strong> not real
          Thyma members, patients or clinicians; no one pictured has any condition named on this
          site.
        </p>
      </div>
    </footer>
  );
}
