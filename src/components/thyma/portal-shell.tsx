import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Activity,
  CalendarClock,
  HeartHandshake,
  LayoutDashboard,
  MessageCircleQuestion,
  MonitorCog,
  TriangleAlert,
  Users,
} from "lucide-react";
import { careTeam, patient } from "@/data/thyma";
import { Portrait } from "./portrait";
import { Wordmark } from "./site-chrome";

const rail = [
  { to: "/app", label: "Today", hint: "Your day at a glance", icon: LayoutDashboard },
  {
    to: "/app/chat",
    label: "Ask Thyma",
    hint: "Symptom triage, 24/7",
    icon: MessageCircleQuestion,
  },
  { to: "/app/care", label: "Care team", hint: "Specialists & referrals", icon: Users },
  { to: "/app/tracking", label: "Between visits", hint: "Check-ins & trends", icon: Activity },
  {
    to: "/app/community",
    label: "Community",
    hint: "People with your disease",
    icon: HeartHandshake,
  },
];

/** Epic-style patient banner: identity + safety-critical facts on every screen. */
function PatientBanner() {
  const lead = careTeam.find((c) => c.lead) ?? careTeam[0]!;
  return (
    <div className="border-b border-hairline bg-card">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Portrait who={patient.photo} size="sm" />
          <div className="min-w-0 leading-tight">
            <span className="font-semibold">{patient.name}</span>
            <span className="ml-2 font-mono text-[12.5px] text-muted-foreground">
              {patient.age} · {patient.sex} · DOB {patient.dob}
            </span>
            <div className="truncate text-[13px] text-muted-foreground">{patient.dx}</div>
          </div>
        </div>

        <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 border-hairline text-[13px] sm:border-l sm:pl-6">
          <div>
            <dt className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              MRN
            </dt>
            <dd className="font-mono text-[13px]">{patient.memberId}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-emergent">
              <TriangleAlert size={11} strokeWidth={2.25} /> Allergies
            </dt>
            <dd className="font-medium text-emergent">{patient.allergies.join(", ")}</dd>
          </div>
          <div className="hidden md:block">
            <dt className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Care team lead
            </dt>
            <dd>
              {lead.name} · {lead.role}
            </dd>
          </div>
          <div className="hidden lg:block">
            <dt className="flex items-center gap-1 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              <CalendarClock size={11} strokeWidth={2.25} /> Next visit
            </dt>
            <dd className="font-mono text-[13px] text-plum">
              {lead.next} · {lead.role}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function PortalShell() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline-dark bg-ink">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-5 py-3">
          <Link to="/">
            <Wordmark />
          </Link>
          <span className="hidden border-l border-hairline-dark pl-4 text-[13.5px] text-cream/60 sm:block">
            Member portal
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="rounded-sm border border-hairline-dark bg-cream/10 px-2.5 py-1 font-mono text-[12.5px] text-cream">
              {patient.plan}
            </span>
          </div>
        </div>
      </header>

      <PatientBanner />

      <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-6 lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {rail.map((r) => {
              const active = r.to === "/app" ? pathname === "/app" : pathname.startsWith(r.to);
              const Icon = r.icon;
              return (
                <Link
                  key={r.to}
                  to={r.to}
                  className={`flex shrink-0 items-start gap-2.5 rounded-md border px-3 py-2.5 text-[14.5px] transition-colors lg:shrink ${
                    active
                      ? "border-action bg-action text-white shadow-panel"
                      : "border-hairline bg-card text-ink hover:border-plum hover:bg-blush-wash"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className={`mt-0.5 shrink-0 ${active ? "text-white" : "text-plum"}`}
                  />
                  <span>
                    <span className="block font-semibold">{r.label}</span>
                    <span
                      className={`hidden text-[12.5px] lg:block ${active ? "text-cream/70" : "text-muted-foreground"}`}
                    >
                      {r.hint}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <Link
            to="/console"
            className="mt-3 hidden items-center gap-2 rounded-md border border-dashed border-hairline px-3 py-2.5 text-[13.5px] text-muted-foreground hover:border-plum hover:text-plum lg:flex"
          >
            <MonitorCog size={14} strokeWidth={2} />
            Switch to clinical console →
          </Link>
        </aside>

        <main className="min-w-0">
          <Outlet />
          <p className="mt-8 border-t border-hairline pt-4 text-[12.5px] leading-relaxed text-muted-foreground">
            Prototype — not for clinical use. Photographs depict models, not real Thyma members,
            patients or clinicians; no one pictured has any condition named on this site.
          </p>
        </main>
      </div>
    </div>
  );
}
