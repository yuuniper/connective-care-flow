import { useState } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Portrait } from "@/components/thyma/portrait";
import { communityPosts, communityRooms, patient } from "@/data/thyma";

export const Route = createFileRoute("/app/community")({
  head: () => ({
    meta: [
      { title: "Community — people with the same disease | Thyma" },
      {
        name: "description",
        content:
          "Moderated rooms for lupus and rheumatoid arthritis by condition and life stage, with Thyma care coordinators in the threads.",
      },
      { property: "og:title", content: "Community — people with the same disease | Thyma" },
      {
        property: "og:description",
        content:
          "Nephritis, working through flares, mycophenolate, newly diagnosed. Peer knowledge that feeds the care plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

function Community() {
  const [room, setRoom] = useState<string>("all");
  const [draft, setDraft] = useState("");
  const [posted, setPosted] = usePersistentState<string[]>("community.posted", []);
  const [liked, setLiked] = usePersistentState<string[]>("community.liked", []);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setPosted((p) => [text, ...p]);
    setDraft("");
  };

  const active = communityRooms.find((r) => r.id === room);
  const shown = active ? communityPosts.filter((p) => p.room === active.name) : communityPosts;

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">A care coordinator is in every room</div>
        <h1 className="mt-1.5 text-[32px] font-semibold text-ink">Community</h1>
        <p className="mt-2 max-w-[66ch] text-[17px]">
          What people say they miss most is not information. It is other people who already know
          what a 40 mg taper feels like. What comes up here gets read by your care team.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={room === "all"}
          onClick={() => setRoom("all")}
          className={`rounded-full border px-4 py-1.5 text-[14.5px] transition-colors ${room === "all" ? "border-action bg-action text-cream" : "border-hairline bg-card text-slate hover:border-plum hover:bg-blush-wash"}`}
        >
          All rooms
        </button>
        {communityRooms.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={room === r.id}
            onClick={() => setRoom(r.id)}
            className={`rounded-full border px-4 py-1.5 text-[14.5px] transition-colors ${room === r.id ? "border-action bg-action text-cream" : "border-hairline bg-card text-slate hover:border-plum hover:bg-blush-wash"}`}
          >
            {r.name}
            <span className="ml-2 text-[13px] opacity-70">{r.members.toLocaleString()}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="panel flex flex-wrap items-center gap-4 px-5 py-4">
          <div>
            <div className="text-[17px] font-semibold text-ink">{active.name}</div>
            <div className="text-[14.5px] text-muted-foreground">{active.blurb}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-2 text-[14px] font-medium text-routine">
            <span className="pulse-dot size-2 rounded-full bg-routine" />
            {active.active}
          </span>
        </div>
      )}

      {/* Composer */}
      <section className="panel p-5">
        <div className="flex items-center gap-2.5">
          <Portrait who={patient.photo} size="sm" />
          <label htmlFor="post" className="text-[14.5px] font-medium text-slate">
            Post as Maria D.
          </label>
        </div>
        <textarea
          id="post"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          aria-describedby="post-hint"
          rows={3}
          placeholder="Ask something, or tell people what worked…"
          className="mt-3 w-full resize-none rounded-xl border border-hairline bg-paper px-4 py-3 text-[15.5px] text-slate outline-none focus:border-plum"
        />
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!draft.trim()}
            onClick={submit}
            className="rounded-full bg-action px-5 py-2 text-[14.5px] font-medium text-cream transition-colors hover:bg-action-deep disabled:opacity-40"
          >
            Post
          </button>
          <span id="post-hint" className="text-[14px] text-muted-foreground">
            Ctrl/⌘ + Enter to post. A moderator reads it within minutes. Nothing clinical is left to
            peers alone.
          </span>
        </div>
      </section>

      <div className="space-y-4">
        {posted.map((p, i) => (
          <article key={`mine-${i}`} className="panel rise border-l-2 border-l-action p-5">
            <div className="flex items-center gap-2.5">
              <Portrait who={patient.photo} size="sm" />
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium text-slate">Maria D.</span>
                <span className="text-[14px] text-muted-foreground">
                  34 · lupus and nephritis · just now
                </span>
              </div>
            </div>
            <p className="mt-3 text-[16px] text-slate">{p}</p>
            <p className="mt-3 text-[14px] text-routine">
              With a moderator now · going to {active?.name ?? "All rooms"}
            </p>
          </article>
        ))}

        {shown.map((p) => {
          const key = p.author + p.when;
          const on = liked.includes(key);
          return (
            <article
              key={key}
              className={`panel p-5 ${p.mine ? "border-l-2 border-l-action" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <Portrait who={p.photo} size="sm" />
                <div className="flex flex-1 flex-wrap items-baseline gap-2">
                  <span className="font-medium text-slate">{p.author}</span>
                  {p.staff && (
                    <span className="rounded-full bg-blush-soft px-2.5 py-0.5 text-[12.5px] font-medium text-rose-deep">
                      Thyma team
                    </span>
                  )}
                  <span className="text-[14px] text-muted-foreground">
                    {p.meta} · {p.when}
                  </span>
                  {!active && <span className="ml-auto text-[14px] text-plum">{p.room}</span>}
                </div>
              </div>
              <p className="mt-3 text-[16px] leading-relaxed text-slate">{p.body}</p>
              <div className="mt-4 flex items-center gap-5 border-t border-hairline pt-3 text-[14px]">
                <button
                  onClick={() => setLiked((l) => (on ? l.filter((x) => x !== key) : [...l, key]))}
                  aria-pressed={on}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${on ? "text-rose-deep" : "text-muted-foreground hover:text-rose-deep"}`}
                >
                  <Heart size={14} strokeWidth={2.25} fill={on ? "currentColor" : "none"} />
                  {p.liked + (on ? 1 : 0)}
                </button>
                <span className="text-muted-foreground">{p.replies} replies</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
