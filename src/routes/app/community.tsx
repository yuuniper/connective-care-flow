import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  const [posted, setPosted] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);

  const active = communityRooms.find((r) => r.id === room);
  const shown = active ? communityPosts.filter((p) => p.room === active.name) : communityPosts;

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Moderated · care coordinators in every room</div>
        <h1 className="mt-1.5 text-[28px] font-semibold">Community</h1>
        <p className="mt-1 max-w-[70ch] text-[15.5px] text-muted-foreground">
          The thing patients say they miss most is not information. It is other people who already
          know what a 40 mg taper feels like. What surfaces here gets read by your care team.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRoom("all")}
          className={`rounded-full border px-3.5 py-1.5 text-[13.5px] ${room === "all" ? "border-action bg-action text-white" : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"}`}
        >
          All rooms
        </button>
        {communityRooms.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoom(r.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[13.5px] ${room === r.id ? "border-action bg-action text-white" : "border-hairline bg-card hover:border-plum hover:bg-blush-wash"}`}
          >
            {r.name}
            <span className="ml-2 font-mono text-[11.5px] opacity-70">
              {r.members.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="panel flex flex-wrap items-center gap-4 px-4 py-3">
          <div>
            <div className="font-semibold">{active.name}</div>
            <div className="text-[13.5px] text-muted-foreground">{active.blurb}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[12px] text-routine">
            <span className="pulse-dot size-1.5 rounded-full bg-routine" />
            {active.active}
          </span>
        </div>
      )}

      {/* Composer */}
      <section className="panel p-4">
        <div className="flex items-center gap-2.5">
          <Portrait who={patient.photo} size="sm" />
          <label htmlFor="post" className="eyebrow">
            Post as Maria D.
          </label>
        </div>
        <textarea
          id="post"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Ask something, or tell people what worked…"
          className="mt-2 w-full resize-none rounded-md border border-hairline bg-paper px-3.5 py-2.5 text-[14.5px] outline-none focus:border-plum"
        />
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <button
            disabled={!draft.trim()}
            onClick={() => {
              setPosted((p) => [draft.trim(), ...p]);
              setDraft("");
            }}
            className="rounded-md bg-action px-4 py-2 text-[14px] font-semibold text-white hover:bg-action-deep disabled:opacity-40"
          >
            Post
          </button>
          <span className="text-[13px] text-muted-foreground">
            Moderated within minutes. Nothing clinical is answered by peers alone.
          </span>
        </div>
      </section>

      <div className="space-y-4">
        {posted.map((p, i) => (
          <article key={`mine-${i}`} className="panel rise border-l-2 border-l-action p-4">
            <div className="flex items-center gap-2.5">
              <Portrait who={patient.photo} size="sm" />
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold">Maria D.</span>
                <span className="text-[13px] text-muted-foreground">
                  34 · SLE + nephritis · just now
                </span>
              </div>
            </div>
            <p className="mt-2 text-[15px]">{p}</p>
            <p className="mt-2 font-mono text-[12.5px] text-routine">
              Awaiting moderation ✓ posted to {active?.name ?? "All rooms"}
            </p>
          </article>
        ))}

        {shown.map((p) => {
          const key = p.author + p.when;
          const on = liked.includes(key);
          return (
            <article
              key={key}
              className={`panel p-4 ${p.mine ? "border-l-2 border-l-action" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <Portrait who={p.photo} size="sm" />
                <div className="flex flex-1 flex-wrap items-baseline gap-2">
                  <span className="font-semibold">{p.author}</span>
                  {p.staff && (
                    <span className="rounded-sm bg-action px-2 py-0.5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-white">
                      Thyma staff
                    </span>
                  )}
                  <span className="text-[13px] text-muted-foreground">
                    {p.meta} · {p.when}
                  </span>
                  {!active && (
                    <span className="ml-auto font-mono text-[12px] text-plum">{p.room}</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed">{p.body}</p>
              <div className="mt-3 flex items-center gap-4 border-t border-hairline pt-2.5 text-[13.5px]">
                <button
                  onClick={() => setLiked((l) => (on ? l.filter((x) => x !== key) : [...l, key]))}
                  className={`font-medium ${on ? "text-plum" : "text-muted-foreground hover:text-plum"}`}
                >
                  ♥ {p.liked + (on ? 1 : 0)}
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
