import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, ClipboardList, History } from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { checkins, vitalsTrend } from "@/data/thyma";

export const Route = createFileRoute("/app/tracking")({
  head: () => ({
    meta: [
      { title: "Between visits — symptom tracking | Thyma" },
      {
        name: "description",
        content:
          "Two-minute daily check-ins that build a trend your rheumatologist and nephrologist actually read, with automatic escalation when the numbers move.",
      },
      { property: "og:title", content: "Between visits — symptom tracking | Thyma" },
      {
        property: "og:description",
        content:
          "Proteinuria, pain and energy trends that turn into lab orders before they turn into admissions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tracking,
});

const questions = [
  {
    id: "stiff",
    q: "Morning stiffness today",
    opts: ["None", "Under 30 min", "30–60 min", "Over an hour"],
  },
  {
    id: "swell",
    q: "Ankle or eyelid swelling",
    opts: ["None", "Mild", "Noticeable", "Worse than yesterday"],
  },
  { id: "urine", q: "Urine looks", opts: ["Normal", "Darker", "Foamy"] },
  { id: "energy", q: "Energy", opts: ["Good", "Okay", "Low", "Wiped out"] },
];

/** Recessive mono tick style shared by every chart axis. */
const tickStyle = {
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11.5,
  fill: "var(--color-muted-foreground)",
};

function UpcrTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-hairline bg-card px-3 py-2 shadow-panel">
      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {label} 2026 · monthly avg
      </div>
      <div className="mt-0.5 font-mono text-[14.5px] font-semibold text-ink">
        {payload[0]!.value.toFixed(1)} g/g
      </div>
    </div>
  );
}

function Tracking() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const done = questions.every((q) => answers[q.id]);
  const escalate = answers["urine"] === "Foamy" || answers["swell"] === "Worse than yesterday";

  const latest = vitalsTrend[vitalsTrend.length - 1]!;

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Passive tracking · 41 check-ins logged</div>
        <h1 className="mt-1.5 text-[28px] font-semibold">Between visits</h1>
        <p className="mt-1 max-w-[70ch] text-[15.5px] text-muted-foreground">
          The nine months between rheumatology appointments is where lupus does its damage. Four
          questions a day builds a chart your specialists open before you walk in — and one that
          escalates itself when it needs to.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        {/* Check-in */}
        <section className="panel overflow-hidden">
          <PanelHeader
            icon={ClipboardList}
            title="Tonight's check-in"
            aside={
              <span className="font-mono">
                {Object.keys(answers).length}/{questions.length} answered
              </span>
            }
          />
          <div className="space-y-4 p-4">
            {questions.map((q) => (
              <fieldset key={q.id}>
                <legend className="text-[14.5px] font-medium">{q.q}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.opts.map((o) => {
                    const on = answers[q.id] === o;
                    return (
                      <button
                        key={o}
                        onClick={() => {
                          setAnswers((a) => ({ ...a, [q.id]: o }));
                          setSent(false);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-[13.5px] transition-colors ${
                          on
                            ? "border-action bg-action text-white"
                            : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
              <button
                disabled={!done || sent}
                onClick={() => setSent(true)}
                className="rounded-md bg-action px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-action-deep disabled:opacity-40"
              >
                {sent ? "Logged ✓" : "Submit check-in"}
              </button>
              {!done && (
                <span className="text-[13.5px] text-muted-foreground">Answer all four.</span>
              )}
            </div>

            {sent && (
              <div
                className={`rise rounded-md border p-3.5 text-[14px] ${
                  escalate ? "border-urgent/50 bg-urgent/8" : "border-routine/40 bg-routine/8"
                }`}
              >
                {escalate ? (
                  <>
                    <div className="font-semibold text-urgent">Escalated automatically</div>
                    <p className="mt-1 text-muted-foreground">
                      Renal signal on a nephritis history. A UPCR order is at the Vine Street lab,
                      Dr. Kaur has the trend chart, and Tasha will call you within the hour. You did
                      not have to know this was important.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-routine">
                      Logged — nothing needs escalating
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Added to the trend Dr. Osei reviews at Monday panel. Next prompt tomorrow at 8
                      PM.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Trend */}
        <section className="panel overflow-hidden">
          <PanelHeader
            icon={Activity}
            title="Urine protein / creatinine ratio"
            aside={<span className="font-mono">g/g · monthly</span>}
          />
          <div className="px-2 pt-4">
            <div className="h-[196px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsTrend} margin={{ top: 6, right: 14, bottom: 0, left: -18 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-hairline)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={tickStyle}
                    dy={4}
                  />
                  <YAxis
                    domain={[0, 2]}
                    ticks={[0, 0.5, 1, 1.5, 2]}
                    tickLine={false}
                    axisLine={false}
                    tick={tickStyle}
                  />
                  <ReferenceArea y1={0} y2={0.5} fill="var(--color-routine)" fillOpacity={0.06} />
                  <ReferenceLine
                    y={0.5}
                    stroke="var(--color-routine)"
                    strokeDasharray="5 4"
                    strokeOpacity={0.65}
                    label={{
                      value: "target < 0.5",
                      position: "insideBottomRight",
                      ...tickStyle,
                      fill: "var(--color-routine)",
                    }}
                  />
                  <Tooltip content={<UpcrTooltip />} cursor={{ stroke: "var(--color-hairline)" }} />
                  <Line
                    type="monotone"
                    dataKey="upcr"
                    stroke="var(--color-plum)"
                    strokeWidth={2}
                    dot={{
                      r: 3.5,
                      fill: "var(--color-plum)",
                      stroke: "var(--color-card)",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patient-reported scores — own 0–10 scale, so they get their own panels. */}
          <div className="mx-4 grid grid-cols-2 gap-4 border-t border-hairline py-3.5">
            {(
              [
                { key: "pain", name: "Pain", dir: "↓" },
                { key: "energy", name: "Energy", dir: "↑" },
              ] as const
            ).map((m) => (
              <div key={m.key}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[12.5px] font-medium text-muted-foreground">
                    {m.name} <span className="text-[11px]">· self-reported, 0–10</span>
                  </span>
                  <span className="font-mono text-[13px] font-semibold text-ink">
                    {latest[m.key]}
                    <span className="ml-1 font-normal text-routine">{m.dir}</span>
                  </span>
                </div>
                <div className="mt-1 h-[44px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vitalsTrend} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
                      <YAxis domain={[0, 10]} hide />
                      <XAxis dataKey="label" hide />
                      <Line
                        type="monotone"
                        dataKey={m.key}
                        stroke="var(--color-plum)"
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>

          <p className="border-t border-hairline px-4 py-3 text-[13.5px] text-muted-foreground">
            Target is under 0.5 g/g. Two consecutive rises trigger a nephrology review without
            waiting for the next scheduled visit.
          </p>
        </section>
      </div>

      {/* Log */}
      <section className="panel overflow-hidden">
        <PanelHeader icon={History} title="Recent log" aside="Visible to your whole care team" />
        <ul>
          {checkins.map((c) => (
            <li
              key={c.day}
              className="grid gap-1 border-b border-hairline px-4 py-3.5 last:border-0 sm:grid-cols-[90px_minmax(0,1fr)]"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                {c.day}
              </span>
              <div>
                <div className="text-[14.5px]">{c.items.join(" · ")}</div>
                {c.flag && (
                  <div className="mt-1 text-[13.5px] font-medium text-urgent">↳ {c.flag}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
