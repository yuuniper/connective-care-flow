import { useEffect, useMemo, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { RotateCcw, ShieldAlert } from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import { Portrait, PortraitStack } from "@/components/thyma/portrait";
import { chatFlow, dispositions, patient, redFlags, type ChatTurn } from "@/data/thyma";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Ask Thyma — 24/7 symptom triage for lupus flares" },
      {
        name: "description",
        content:
          "An AI agent that knows your diagnosis, medications and labs, runs a red-flag screen in plain language, and routes you to home care, an urgent specialist, or the ED.",
      },
      { property: "og:title", content: "Ask Thyma — 24/7 symptom triage for lupus flares" },
      {
        property: "og:description",
        content:
          "Interactive triage walkthrough: answer as Maria and watch the red-flag screen resolve into a disposition.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Chat,
});

type Line =
  | { kind: "agent"; text: string; at: string }
  | { kind: "you"; text: string; at: string }
  | { kind: "sys"; text: string };

const CLOCK = ["7:02 PM", "7:03 PM", "7:05 PM", "7:06 PM", "7:08 PM", "7:09 PM", "7:11 PM"];
const clockAt = (i: number) => CLOCK[Math.min(Math.max(i, 0), CLOCK.length - 1)] ?? "7:11 PM";
const getTurn = (id: string): ChatTurn | null => chatFlow[id] ?? null;
const openingLines = (): Line[] =>
  (getTurn("start")?.agent ?? []).map((t) => ({ kind: "agent" as const, text: t, at: clockAt(0) }));

function Chat() {
  const [turnId, setTurnId] = useState<string>("start");
  const [lines, setLines] = useState<Line[]>(openingLines);
  const [flags, setFlags] = useState<Record<string, "cleared" | "fired">>({});
  const [outcome, setOutcome] = useState<keyof typeof dispositions | null>(null);
  const [booked, setBooked] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const turn: ChatTurn | null = outcome ? null : getTurn(turnId);
  const cleared = useMemo(
    () => Object.values(flags).filter((f) => f === "cleared").length,
    [flags],
  );

  function choose(o: ChatTurn["options"][number], step: number) {
    const at = clockAt(step + 1);
    const next: Line[] = [...lines, { kind: "you", text: o.label, at }];
    if (o.system) next.push({ kind: "sys", text: o.system });

    const nf = { ...flags };
    o.clear?.forEach((r) => (nf[r] = "cleared"));
    o.fire?.forEach((r) => (nf[r] = "fired"));
    setFlags(nf);

    if (o.next in dispositions) {
      const key = o.next as keyof typeof dispositions;
      next.push({ kind: "agent", text: dispositions[key].body, at });
      setOutcome(key);
    } else {
      getTurn(o.next)?.agent.forEach((t) => next.push({ kind: "agent", text: t, at }));
      setTurnId(o.next);
    }
    setLines(next);
  }

  function restart() {
    setTurnId("start");
    setLines(openingLines());
    setFlags({});
    setOutcome(null);
    setBooked(false);
  }

  const d = outcome ? dispositions[outcome] : null;
  const tone =
    d?.level === "emergent" ? "bg-emergent" : d?.level === "urgent" ? "bg-urgent" : "bg-routine";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Tuesday · 7:02 PM · symptom-triggered contact</div>
          <h1 className="mt-1.5 text-[28px] font-semibold">Ask Thyma</h1>
          <p className="mt-1 max-w-[70ch] text-[15.5px] text-muted-foreground">
            Tell Thyma what's happening. It screens for red flags first, then books what you
            actually need — home care, an urgent specialist visit, or the ED with a warm handoff.
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-1.5 rounded-md border border-hairline bg-card px-3 py-2 text-[14px] font-medium hover:border-plum hover:bg-blush-wash"
        >
          <RotateCcw size={13} strokeWidth={2.25} /> Restart conversation
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_268px] lg:items-start">
        {/* transcript */}
        <section className="panel flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-hairline bg-cream px-4 py-2.5">
            <span className="flex items-center gap-2.5">
              <Portrait who="osei" size="sm" />
              <span className="text-[15px] font-semibold leading-tight">
                Secure thread
                <span className="block text-[12px] font-normal text-muted-foreground">
                  Dr. Osei has access
                </span>
              </span>
            </span>
            {!outcome ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-emergent">
                <span className="pulse-dot size-1.5 rounded-full bg-emergent" /> Live
              </span>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-routine">
                Resolved
              </span>
            )}
          </div>

          <div ref={threadRef} className="flex max-h-[460px] flex-col gap-3 overflow-y-auto p-4">
            {lines.map((l, i) =>
              l.kind === "sys" ? (
                <div
                  key={i}
                  className="rise mx-auto rounded-md border border-dashed border-hairline px-3 py-2 text-center font-mono text-[12.5px] text-muted-foreground"
                >
                  {l.text}
                </div>
              ) : (
                <div
                  key={i}
                  className={`rise flex max-w-[84%] items-end gap-2.5 ${
                    l.kind === "you" ? "flex-row-reverse self-end" : "self-start"
                  }`}
                >
                  {l.kind === "you" ? (
                    <Portrait who={patient.photo} size="sm" />
                  ) : (
                    /* The agent is software, not a person — deliberately not a face. */
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-cream font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-plum">
                      AI
                    </span>
                  )}
                  <div className={`flex flex-col gap-1 ${l.kind === "you" ? "items-end" : ""}`}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      {l.kind === "you" ? patient.first : "Thyma agent"} · {l.at}
                    </span>
                    <span
                      className={`rounded-[10px] px-3.5 py-2.5 text-[14.5px] leading-relaxed ${
                        l.kind === "you"
                          ? "rounded-br-[3px] bg-plum text-primary-foreground"
                          : "rounded-bl-[3px] border border-hairline bg-cream/70"
                      }`}
                    >
                      {l.text}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-hairline bg-paper p-4">
            {turn ? (
              <>
                <div className="eyebrow mb-2.5">Choose your reply</div>
                <div className="flex flex-col gap-2">
                  {turn.options.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => choose(o, lines.length)}
                      className="rounded-md border border-hairline bg-card px-3.5 py-2.5 text-left text-[14.5px] transition-colors hover:border-plum hover:bg-cream/50"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[14px] text-muted-foreground">
                Session resolved. A human coordinator reads this thread within 15 minutes, always.
              </p>
            )}
          </div>
        </section>

        {/* red flag screen */}
        <aside className="panel overflow-hidden">
          <PanelHeader
            icon={ShieldAlert}
            tone="emergent"
            title="Red-flag screen"
            aside={
              <span className="font-mono">
                {cleared}/{redFlags.length} cleared
              </span>
            }
          />
          <ul className="p-3.5">
            {redFlags.map((r) => {
              const s = flags[r.id];
              return (
                <li
                  key={r.id}
                  className={`flex gap-2.5 border-b border-hairline py-2.5 text-[13.5px] leading-snug last:border-0 ${s === "fired" ? "font-semibold text-emergent" : ""}`}
                >
                  <span
                    className={`mt-0.5 flex size-[15px] shrink-0 items-center justify-center rounded-[3px] border text-[11px] font-bold text-white ${
                      s === "cleared"
                        ? "border-routine bg-routine"
                        : s === "fired"
                          ? "border-emergent bg-emergent"
                          : "border-hairline"
                    }`}
                  >
                    {s === "cleared" ? "✓" : s === "fired" ? "!" : ""}
                  </span>
                  <span>
                    <span className="mr-1.5 font-mono text-[11.5px] text-muted-foreground">
                      {r.id}
                    </span>
                    {r.t}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {/* disposition */}
      {d ? (
        <section className="panel overflow-hidden">
          <div className={`flex flex-wrap items-center gap-3 px-4 py-3 text-white ${tone}`}>
            <span className="font-display text-[15px] font-bold uppercase tracking-[0.1em]">
              {d.label}
            </span>
            <span className="ml-auto rounded-sm bg-white/20 px-2 py-0.5 font-mono text-[11.5px] tracking-[0.06em]">
              Screen resolved · {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="p-5">
            <h2 className="text-[18px] font-semibold">{d.head}</h2>
            <ul className="mt-3.5 flex flex-col gap-2">
              {d.acts.map((a) => (
                <li key={a} className="flex gap-2.5 text-[14.5px]">
                  <span className="font-semibold text-plum">→</span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {d.level === "emergent" ? (
                <span className="inline-flex items-center gap-2.5 rounded-md bg-emergent px-4 py-2 text-[14px] font-semibold text-white">
                  <Portrait who="brant" size="sm" className="ring-white/40" />
                  Tasha is staying on the line
                </span>
              ) : (
                <button
                  onClick={() => setBooked(true)}
                  disabled={booked}
                  className="rounded-md bg-action px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-action-deep disabled:opacity-40"
                >
                  {booked ? "Confirmed ✓" : "Confirm this plan"}
                </button>
              )}
              <Link
                to="/app/care"
                className="text-[14px] font-semibold text-plum underline underline-offset-4 hover:text-ink"
              >
                See it land on the care team →
              </Link>
            </div>
            {booked && (
              <p className="rise mt-3 flex items-center gap-2.5 text-[13.5px] text-routine">
                <PortraitStack who={["brant", "kaur"]} size="xs" />
                Added to your queue. Tasha has been paged and Dr. Kaur received the trend chart.
              </p>
            )}
          </div>
        </section>
      ) : (
        <div className="rounded-md border border-dashed border-hairline px-4 py-8 text-center text-[14px] text-muted-foreground">
          A disposition appears once the red-flag screen resolves.
        </div>
      )}
    </div>
  );
}
