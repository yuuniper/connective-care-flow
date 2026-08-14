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

/**
 * Standing context strip: the few facts worth having on every screen.
 *
 * This replaced an Epic-style patient banner. That pattern exists so a
 * clinician can confirm they have the right chart open — it led with the
 * member's own name, age, sex, DOB and MRN in monospace. Shown back to Maria on
 * her own portal it read like an ID badge, and it duplicated the name the Today
 * page already greets her with. Identity moved to the account chip in the
 * header; what stays here is what she might actually need mid-task: her
 * diagnosis in plain words, her allergy, who leads her care, and when she is
 * next seen. Member ID stays because it is what a phone call asks for, but it
 * is last and quiet rather than second and set in mono.
 */
function CareContext() {
  const lead = careTeam.find((c) => c.lead) ?? careTeam[0]!;
  return (
    <div className="border-b border-hairline bg-card">
      <dl className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3.5 text-[14.5px]">
        <div className="min-w-0">
          <dt className="text-[13px] text-muted-foreground">Living with</dt>
          <dd className="truncate font-medium text-slate">{patient.dx}</dd>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emergent/12 text-emergent">
            <TriangleAlert size={14} strokeWidth={2.25} />
          </span>
          <div>
            <dt className="text-[13px] text-muted-foreground">Allergic to</dt>
            <dd className="font-medium text-emergent">{patient.allergies.join(", ")}</dd>
          </div>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Portrait who={lead.photo} size="sm" />
          <div>
            <dt className="text-[13px] text-muted-foreground">Leads your care</dt>
            <dd className="font-medium text-slate">
              {lead.name} · {lead.role}
            </dd>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-plum/12 text-plum">
            <CalendarClock size={14} strokeWidth={2.25} />
          </span>
          <div>
            <dt className="text-[13px] text-muted-foreground">Next visit</dt>
            <dd className="font-medium text-slate">{lead.next}</dd>
          </div>
        </div>

        <div className="ml-auto hidden text-right xl:block">
          <dt className="text-[13px] text-muted-foreground">Member ID</dt>
          <dd className="text-muted-foreground">{patient.memberId}</dd>
        </div>
      </dl>
    </div>
  );
}

export function PortalShell() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5">
          <Link to="/">
            <Wordmark />
          </Link>
          <span className="hidden text-[13.5px] text-muted-foreground sm:block">Member portal</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-[13.5px] text-muted-foreground md:block">
              {patient.plan}
            </span>
            {/* Account chip — identity lives here rather than in a banner. */}
            <span className="flex items-center gap-2.5">
              <Portrait who={patient.photo} size="sm" />
              <span className="hidden text-[14.5px] font-medium text-slate sm:block">
                {patient.name}
              </span>
            </span>
          </div>
        </div>
      </header>

      <CareContext />

      <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-8 lg:grid-cols-[224px_minmax(0,1fr)]">
        {/* min-w-0: without it this grid item cannot shrink below the rail's
            content width, and the horizontal rail stretches the whole column
            past the viewport on phones. */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          {/* No borders on the inactive items: five bordered boxes stacked in a
              224px column read as a control panel. Only the current page is filled. */}
          <nav className="-mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {rail.map((r) => {
              const active = r.to === "/app" ? pathname === "/app" : pathname.startsWith(r.to);
              const Icon = r.icon;
              return (
                <Link
                  key={r.to}
                  to={r.to}
                  className={`flex shrink-0 items-start gap-2.5 rounded-xl px-3 py-2.5 text-[14.5px] transition-colors lg:shrink ${
                    active
                      ? "bg-action text-cream"
                      : "text-slate hover:bg-blush-wash hover:text-ink"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className={`mt-0.5 shrink-0 ${active ? "text-cream" : "text-plum"}`}
                  />
                  <span>
                    <span className="block font-medium">{r.label}</span>
                    <span
                      className={`hidden text-[13px] lg:block ${active ? "text-cream/75" : "text-muted-foreground"}`}
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
            className="mt-5 hidden items-center gap-2 px-3 text-[13.5px] text-muted-foreground hover:text-plum lg:flex"
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
