import { Link } from "@tanstack/react-router";

/**
 * `tone` names the surface the wordmark sits on: "light" for cream text on a
 * dark aubergine block, "dark" for aubergine text on cream.
 */
export function Wordmark({ tone = "dark" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={`font-wordmark text-[21px] font-semibold tracking-[0.15em] ${
        tone === "light" ? "text-cream" : "text-ink"
      }`}
    >
      THY<span className={tone === "light" ? "text-blush" : "text-rose-deep"}>MA</span>
    </span>
  );
}

const nav = [
  { to: "/", label: "Platform" },
  { to: "/providers", label: "For providers" },
  { to: "/payers", label: "For plans" },
];

/**
 * First focusable element on every page. Hidden until a keyboard user tabs to
 * it, then lets them jump past the header and nav straight to `#main`.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:text-[14.5px] focus:font-medium focus:text-cream focus:shadow-panel"
    >
      Skip to content
    </a>
  );
}

export function SiteHeader() {
  return (
    <>
      <SkipLink />
      <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur-md">
        {/*
         * Below sm the nav drops to its own full-width row and the portal pill
         * rides beside the wordmark, so nothing has to wrap mid-phrase. From sm
         * up the order flips back to wordmark → nav → pill on one line.
         */}
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-7 gap-y-3 px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <Wordmark />
          </Link>
          <span className="hidden text-[13.5px] text-muted-foreground lg:block">
            Care for autoimmune disease, held together
          </span>
          <Link
            to="/app"
            className="order-2 ml-auto shrink-0 whitespace-nowrap rounded-full bg-action px-4 py-2 text-[14px] font-medium text-cream transition-colors hover:bg-action-deep sm:order-3 sm:ml-2"
          >
            Open Maria's portal
          </Link>
          <nav className="order-3 flex w-full items-center gap-1 sm:order-2 sm:ml-auto sm:w-auto">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-[14.5px] text-slate transition-colors hover:bg-blush-wash hover:text-ink data-[status=active]:font-medium data-[status=active]:text-plum"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-hairline bg-cream">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark tone="dark" />
          <p className="mt-3 max-w-[42ch] text-[14.5px] text-muted-foreground">
            One place where your specialists talk to each other, and someone is always there to pick
            up.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Product</div>
          <ul className="space-y-2 text-[14.5px]">
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
          <ul className="space-y-2 text-[14.5px]">
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
