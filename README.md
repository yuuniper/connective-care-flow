# Thyma

Coordinated care for people living with lupus and lupus nephritis: one record, one care team and one number that answers at 2 AM.

This repo is the Thyma web prototype, built with [Lovable](https://lovable.dev). Commits pushed to `main` sync back to the Lovable editor.

## What's in it

| Route | What it shows |
| --- | --- |
| `/` | Marketing site: the before/after story and member voices |
| `/providers`, `/payers` | Pitches for specialists and health plans |
| `/console` | Care coordinator console |
| `/app` | Maria's member portal: today's plan, labs and open items |
| `/app/chat` | Ask Thyma: guided flare triage that ends in a disposition |
| `/app/tracking` | Nightly check-in and symptom/lab trends |
| `/app/care` | Care team and referral booking |
| `/app/community` | Moderated peer rooms |

Demo data lives in `src/data/thyma.ts` and `src/data/people.ts`. The member portal saves check-in answers, community posts and likes to `localStorage` (keys prefixed `thyma:`), so a demo survives a reload.

## Development

```sh
bun install
bun run dev
```

`bun run lint` and `bun run build` should both pass before you push.

## Built with

TanStack Start, React 19, TypeScript, Tailwind CSS 4, Radix UI and Recharts.
