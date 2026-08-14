import { useEffect, useMemo, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  MessageCircleQuestion,
  RotateCcw,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { PanelHeader } from "@/components/thyma/panel";
import { Portrait, PortraitStack } from "@/components/thyma/portrait";
import { chatFlow, dispositions, patient, redFlags, type ChatTurn } from "@/data/thyma";

export const Route = createFileRoute("/app/chat")({
  head: () => ({
    meta: [
      { title: "Ask Thyma — someone to talk to when a flare starts" },
      {
        name: "description",
        content:
          "Tell Thyma what's happening in your own words. It knows your diagnosis, medications and labs, checks the dangerous things first, and books what tonight actually needs.",
      },
      { property: "og:title", content: "Ask Thyma — someone to talk to when a flare starts" },
      {
        property: "og:description",
        content:
          "Interactive walkthrough: answer as Maria and watch the safety checks resolve into a plan for the night.",
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

/**
 * How each outcome is dressed. Only the emergency case gets a solid fill — a
 * saturated banner is the right amount of loud for "go now" and the wrong
 * amount for the two outcomes that mean you can stay home.
 */
const OUTCOME_STYLE = {
  emergent: { band: "bg-emergent text-cream", disc: "bg-cream/20 text-cream", icon: Siren },
  urgent: {
    band: "bg-urgent/12 text-urgent",
    disc: "bg-urgent/15 text-urgent",
    icon: AlertTriangle,
  },
  routine: {
    band: "bg-routine/12 text-routine",
    disc: "bg-routine/15 text-routine",
    icon: ShieldCheck,
  },
} as const;

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
  const style = d ? OUTCOME_STYLE[d.level] : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Tuesday, 7:02 PM</div>
          <h1 className="mt-1.5 text-[32px] font-semibold text-ink">Ask Thyma</h1>
          <p className="mt-2 max-w-[66ch] text-[17px]">
            Tell us what's happening in your own words. We check the dangerous things first, then
            book what tonight actually needs — rest at home, a specialist in the morning, or the
            emergency room with the team already expecting you.
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 rounded-full border border-hairline bg-card px-4 py-2 text-[14.5px] font-medium text-slate transition-colors hover:bg-blush-wash hover:text-ink"
        >
          <RotateCcw size={14} strokeWidth={2.25} /> Start over
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        {/* transcript */}
        <section className="panel flex min-w-0 flex-col overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-4">
            <span className="flex items-center gap-2.5">
              <Portrait who="osei" size="sm" />
              <span className="text-[15.5px] font-medium leading-tight text-slate">
                Dr. Osei can see this thread
                <span className="block text-[13.5px] font-normal text-muted-foreground">
                  Everything here goes in your chart
                </span>
              </span>
            </span>
            {!outcome ? (
              <span className="inline-flex items-center gap-2 text-[14px] font-medium text-routine">
                <span className="pulse-dot size-2 rounded-full bg-routine" /> Someone is here
              </span>
            ) : (
              <span className="text-[14px] font-medium text-routine">Wrapped up</span>
            )}
          </div>

          <div
            ref={threadRef}
            className="flex max-h-[480px] flex-col gap-4 overflow-y-auto border-t border-hairline p-5"
          >
            {lines.map((l, i) =>
              l.kind === "sys" ? (
                <div
                  key={i}
                  className="rise mx-auto max-w-[92%] rounded-full bg-blush-wash px-4 py-1.5 text-center text-[13.5px] text-muted-foreground"
                >
                  {l.text}
                </div>
              ) : (
                <div
                  key={i}
                  className={`rise flex max-w-[86%] items-end gap-2.5 ${
                    l.kind === "you" ? "flex-row-reverse self-end" : "self-start"
                  }`}
                >
                  {l.kind === "you" ? (
                    <Portrait who={patient.photo} size="sm" />
                  ) : (
                    /* The agent is software, not a person — deliberately not a
                       face. Same icon the rail uses for Ask Thyma. */
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blush-soft text-plum">
                      <MessageCircleQuestion size={17} strokeWidth={2} />
                    </span>
                  )}
                  <div className={`flex flex-col gap-1 ${l.kind === "you" ? "items-end" : ""}`}>
                    <span className="text-[13px] text-muted-foreground">
                      {l.kind === "you" ? patient.first : "Thyma"} · {l.at}
                    </span>
                    <span
                      className={`rounded-2xl px-4 py-2.5 text-[15.5px] leading-relaxed ${
                        l.kind === "you"
                          ? "rounded-br-md bg-action text-cream"
                          : "rounded-bl-md bg-blush-wash text-slate"
                      }`}
                    >
                      {l.text}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-hairline p-5">
            {turn ? (
              <>
                <div className="mb-3 text-[14px] text-muted-foreground">Your reply</div>
                <div className="flex flex-col gap-2.5">
                  {turn.options.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => choose(o, lines.length)}
                      className="rounded-xl border border-hairline bg-card px-4 py-3 text-left text-[15.5px] text-slate transition-colors hover:border-plum hover:bg-blush-wash"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[14.5px] text-muted-foreground">
                A care coordinator reads this thread within 15 minutes — always, including now.
              </p>
            )}
          </div>
        </section>

        {/* safety checks */}
        <aside className="panel min-w-0 overflow-hidden">
          {/* The count lives in the sentence rather than in PanelHeader's aside:
              in a 280px column the aside wraps under the title and strands. */}
          <PanelHeader icon={ShieldCheck} title="Safety checks" />
          <p className="px-5 pb-1 text-[13.5px] text-muted-foreground">
            <span className="font-medium text-routine">
              {cleared} of {redFlags.length} clear
            </span>{" "}
            — these are the things we rule out first, chosen for your diagnosis and medications.
          </p>
          <ul className="px-5 pb-4 pt-3">
            {redFlags.map((r) => {
              const s = flags[r.id];
              return (
                <li
                  key={r.id}
                  className={`flex gap-3 py-2.5 text-[14.5px] leading-snug ${
                    s === "fired" ? "font-medium text-emergent" : "text-slate"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                      s === "cleared"
                        ? "bg-routine text-cream"
                        : s === "fired"
                          ? "bg-emergent text-cream"
                          : /* Stronger than --hairline on purpose: an empty ring is
                               the only marker for "not checked yet", so it has to
                               clear 3:1 rather than whisper like ordinary chrome. */
                            "border border-muted-foreground/75"
                    }`}
                  >
                    {s === "cleared" ? (
                      <Check size={12} strokeWidth={3} />
                    ) : s === "fired" ? (
                      <AlertTriangle size={11} strokeWidth={2.75} />
                    ) : null}
                  </span>
                  <span>{r.t}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {/* the plan */}
      {d && style ? (
        <section className="panel overflow-hidden">
          <div className={`flex flex-wrap items-center gap-3 px-5 py-4 ${style.band}`}>
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${style.disc}`}
            >
              <style.icon size={17} strokeWidth={2.25} />
            </span>
            <span className="font-display text-[19px] font-semibold">{d.label}</span>
          </div>
          <div className="border-t border-hairline p-5">
            <h2 className="text-[20px] font-semibold text-ink">{d.head}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {d.acts.map((a) => (
                <li key={a} className="flex gap-3 text-[15.5px] text-slate">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {d.level === "emergent" ? (
                <span className="inline-flex items-center gap-2.5 rounded-full bg-emergent px-4 py-2 text-[14.5px] font-medium text-cream">
                  <Portrait who="brant" size="sm" className="ring-cream/40" />
                  Tasha is staying on the line
                </span>
              ) : (
                <button
                  onClick={() => setBooked(true)}
                  disabled={booked}
                  className="rounded-full bg-action px-5 py-2.5 text-[14.5px] font-medium text-cream transition-colors hover:bg-action-deep disabled:opacity-40"
                >
                  {booked ? "Confirmed" : "That works — confirm it"}
                </button>
              )}
              <Link
                to="/app/care"
                className="text-[14.5px] font-medium text-plum underline decoration-blush decoration-2 underline-offset-4 hover:text-ink"
              >
                See it land on the care team →
              </Link>
            </div>
            {booked && (
              <p className="rise mt-4 flex items-center gap-2.5 text-[14.5px] text-routine">
                <PortraitStack who={["brant", "kaur"]} size="xs" />
                Added to your queue. Tasha has been paged, and Dr. Kaur has your trend chart.
              </p>
            )}
          </div>
        </section>
      ) : (
        <div className="rounded-2xl bg-blush-wash px-5 py-10 text-center text-[15px] text-muted-foreground">
          Once the safety checks are done, your plan for tonight appears here.
        </div>
      )}
    </div>
  );
}
