import { usePersistentState } from "@/hooks/use-persistent-state";
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

/**
 * Recessive tick style shared by every chart axis. Body sans, not mono: these
 * are month names and single decimals, and mono made a patient's own chart read
 * like a terminal. Mono is kept for the measured value in the tooltip.
 */
const tickStyle = {
  fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif",
  fontSize: 12,
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
    <div className="rounded-xl bg-card px-3.5 py-2.5 shadow-lift">
      <div className="text-[13px] text-muted-foreground">{label} 2026 · monthly average</div>
      <div className="mt-0.5 font-mono text-[15px] font-semibold text-ink">
        {payload[0]!.value.toFixed(1)} g/g
      </div>
    </div>
  );
}

/** Check-ins Maria logged before tonight; tonight's adds one once sent. */
const PAST_CHECKINS = 41;

function Tracking() {
  const [answers, setAnswers, resetAnswers] = usePersistentState<Record<string, string>>(
    "checkin.answers",
    {},
  );
  const [sent, setSent, resetSent] = usePersistentState("checkin.sent", false);
  const done = questions.every((q) => answers[q.id]);
  const escalate = answers["urine"] === "Foamy" || answers["swell"] === "Worse than yesterday";

  const latest = vitalsTrend[vitalsTrend.length - 1]!;

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">{PAST_CHECKINS + (sent ? 1 : 0)} check-ins so far</div>
        <h1 className="mt-1.5 text-[32px] font-semibold text-ink">Between visits</h1>
        <p className="mt-2 max-w-[66ch] text-[17px]">
          The nine months between rheumatology appointments is where lupus does its damage. Four
          questions a day builds a chart your specialists open before you walk in — and one that
          raises its hand on its own when something moves.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        {/* Check-in */}
        <section className="panel overflow-hidden">
          <PanelHeader
            icon={ClipboardList}
            title="Tonight's check-in"
            aside={`${Object.keys(answers).length} of ${questions.length} answered`}
          />
          {/* Lives outside the spaced column so it never affects layout; announces the result. */}
          <p role="status" className="sr-only">
            {sent
              ? escalate
                ? "Check-in sent. We picked this one up: Tasha will call you within the hour."
                : "Check-in logged. Nothing needs chasing."
              : ""}
          </p>
          <div className="space-y-5 border-t border-hairline p-5">
            {questions.map((q) => (
              <fieldset key={q.id}>
                <legend className="text-[15.5px] font-medium text-slate">{q.q}</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {q.opts.map((o) => {
                    const on = answers[q.id] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          setAnswers((a) => ({ ...a, [q.id]: o }));
                          setSent(false);
                        }}
                        className={`rounded-full border px-3.5 py-1.5 text-[14.5px] transition-colors ${
                          on
                            ? "border-action bg-action text-cream"
                            : "border-hairline bg-card text-slate hover:border-plum hover:bg-blush-wash"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
              <button
                type="button"
                disabled={!done || sent}
                onClick={() => setSent(true)}
                className={`rounded-full px-5 py-2.5 text-[14.5px] font-medium text-cream transition-colors ${
                  sent ? "bg-routine" : "bg-action hover:bg-action-deep disabled:opacity-40"
                }`}
              >
                {sent ? "Logged" : "Send tonight's check-in"}
              </button>
              {!done && (
                <span className="text-[14.5px] text-muted-foreground">All four, then send.</span>
              )}
              {(sent || Object.keys(answers).length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    resetAnswers();
                    resetSent();
                  }}
                  className="text-[14.5px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-plum hover:underline"
                >
                  {sent ? "Start a new check-in" : "Clear answers"}
                </button>
              )}
            </div>

            {sent && (
              <div
                className={`rise rounded-2xl p-5 text-[15px] ${
                  escalate ? "bg-urgent/10" : "bg-routine/10"
                }`}
              >
                {escalate ? (
                  <>
                    <div className="font-medium text-urgent">We picked this one up</div>
                    <p className="mt-1.5 text-muted-foreground">
                      That is a kidney signal on your history. A urine test is already waiting at
                      the Vine Street lab, Dr. Kaur has your trend chart, and Tasha will call you
                      within the hour. You did not have to know this one mattered.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-medium text-routine">Logged — nothing needs chasing</div>
                    <p className="mt-1.5 text-muted-foreground">
                      Added to the trend Dr. Osei reads on Monday. We will ask again tomorrow at 8
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
          <PanelHeader icon={Activity} title="Protein in your urine" aside="Monthly average" />
          <div className="border-t border-hairline px-2 pt-4">
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
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[14px] font-medium text-muted-foreground">{m.name}</span>
                  <span className="text-[15px] font-semibold text-ink">
                    {latest[m.key]}
                    <span className="ml-1 font-normal text-routine">{m.dir}</span>
                  </span>
                </div>
                <div className="text-[12.5px] text-muted-foreground">how you rated it, 0–10</div>
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

          <p className="border-t border-hairline px-5 py-3.5 text-[14px] text-muted-foreground">
            Your doctors call this the urine protein/creatinine ratio. Under 0.5 g/g is the target,
            and two rises in a row get a kidney review without waiting for your next visit.
          </p>
        </section>
      </div>

      {/* Log */}
      <section className="panel overflow-hidden">
        <PanelHeader icon={History} title="Recent log" aside="Your whole care team can see this" />
        <ul>
          {checkins.map((c) => (
            <li
              key={c.day}
              className="grid gap-1 border-t border-hairline px-5 py-4 sm:grid-cols-[100px_minmax(0,1fr)]"
            >
              <span className="text-[14px] font-medium text-rose-deep">{c.day}</span>
              <div>
                <div className="text-[15px] text-slate">{c.items.join(" · ")}</div>
                {c.flag && <div className="mt-1 text-[14px] font-medium text-plum">→ {c.flag}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
