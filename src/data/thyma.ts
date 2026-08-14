import type { PersonKey } from "./people";

export const patient = {
  name: "Maria Delgado",
  first: "Maria",
  age: 34,
  sex: "F",
  dob: "03/14/1992",
  memberId: "THY-4417-92",
  dx: "SLE with class III lupus nephritis",
  dxShort: "Lupus + nephritis",
  since: "Diagnosed 2021 · enrolled with Thyma March 2026",
  plan: "Meridian Health Plan · Thyma managed care",
  allergies: ["Sulfamethoxazole (rash)"],
  regimen: ["Hydroxychloroquine 300 mg", "Mycophenolate 1 g BID", "Lisinopril 10 mg"],
  photo: "maria" as PersonKey,
  photoAlt: "Maria Delgado",
};

/** Latest lab panel — Jul 28, Vine Street. Flags follow standard H/L convention. */
export const recentLabs = [
  { name: "Urine protein/creatinine", value: "0.8", unit: "g/g", ref: "< 0.5", flag: "H" as const },
  { name: "Creatinine, serum", value: "0.9", unit: "mg/dL", ref: "0.6–1.1", flag: null },
  { name: "C3 complement", value: "98", unit: "mg/dL", ref: "90–180", flag: null },
  { name: "C4 complement", value: "21", unit: "mg/dL", ref: "10–40", flag: null },
];

/** The fragmentation narrative: what the year before Thyma looked like. */
export const beforeAfter = {
  before: [
    {
      when: "Feb 2025",
      what: "Joint pain and rash. Primary care visit; referred to rheumatology.",
      cost: "Wait: 94 days",
    },
    {
      when: "Apr 2025",
      what: "Flare at 11 PM. No one to call. Emergency department.",
      cost: "$2,140 · 7 hours",
    },
    {
      when: "May 2025",
      what: "Rheumatology intake finally happens. Labs reordered from scratch.",
      cost: "Repeat panel",
    },
    {
      when: "Aug 2025",
      what: "Foamy urine mentioned to derm, who does not read renal labs. No handoff.",
      cost: "Signal lost",
    },
    {
      when: "Nov 2025",
      what: "Nephrology referral. Biopsy shows class III nephritis already established.",
      cost: "$18,400 admission",
    },
  ],
  after: [
    {
      when: "Mar 2026",
      what: "Enrolled. One record, one care team, one number that answers at 2 AM.",
      cost: "Day 1",
    },
    {
      when: "Apr 2026",
      what: "Nephrology added to the same chart. Rheum and neph share the plan.",
      cost: "4 days to visit",
    },
    {
      when: "Jun 2026",
      what: "Weekly check-ins catch a proteinuria trend before symptoms.",
      cost: "Labs, not ED",
    },
    {
      when: "Jul 2026",
      what: "Night flare. AI triage, next-morning rheumatology, prednisone bridge.",
      cost: "ED avoided",
    },
  ],
};

/**
 * Homepage voices. Members first, then the coordinator — the point of the last
 * one is that the work it describes used to fall on the patient.
 */
export const voices: { photo: PersonKey; name: string; meta: string; quote: string }[] = [
  {
    photo: "denise",
    name: "Denise A.",
    meta: "45 · lupus, 7 years",
    quote:
      "I stopped dreading 8 p.m. Someone actually asked me what the nausea was like, and then changed something about it.",
  },
  {
    photo: "rosalind",
    name: "Rosalind K.",
    meta: "38 · class IV nephritis",
    quote:
      "For two years nobody told me what to watch for. Now I keep a log, and my kidney doctor actually reads it.",
  },
  {
    photo: "brant",
    name: "Tasha Brant, RN",
    meta: "Care coordinator at Thyma",
    quote:
      "My job is the part that used to fall on the patient — the referrals, the denials, the callbacks. If I've done it right, Maria never hears about any of it.",
  },
];

export type CareTeamMember = {
  id: string;
  /** Indexes into `people` in ./people.ts. */
  photo: PersonKey;
  name: string;
  role: string;
  site: string;
  lead?: boolean;
  next: string;
  note: string;
};

export const careTeam: CareTeamMember[] = [
  {
    id: "osei",
    photo: "osei",
    name: "Dr. Amara Osei",
    role: "Rheumatology",
    site: "Riverside Specialty",
    lead: true,
    next: "Tue 8:40 AM",
    note: "Owns the disease plan. Sees every message you send the AI agent.",
  },
  {
    id: "kaur",
    photo: "kaur",
    name: "Dr. Ravi Kaur",
    role: "Nephrology",
    site: "Riverside Renal",
    next: "Thu 2:15 PM",
    note: "Added within 4 days of your first proteinuria flag. Shares Dr. Osei's chart.",
  },
  {
    id: "linde",
    photo: "linde",
    name: "Dr. Joan Linde",
    role: "Dermatology",
    site: "Northgate",
    next: "On referral",
    note: "Malar rash and photosensitivity. Reads your renal labs before she prescribes.",
  },
  {
    id: "brant",
    photo: "brant",
    name: "Tasha Brant, RN",
    role: "Care coordinator",
    site: "Thyma",
    next: "Always on",
    note: "Your human. Books the slots, appeals the denials, calls you back.",
  },
];

export const referralSlots: {
  id: string;
  who: string;
  photo: PersonKey;
  spec: string;
  when: string;
  mode: string;
  tag: string;
}[] = [
  {
    id: "s1",
    who: "Dr. Amara Osei",
    photo: "osei",
    spec: "Rheumatology",
    when: "Tomorrow, 8:40 AM",
    mode: "In person · Riverside",
    tag: "Next-day contracted slot",
  },
  {
    id: "s2",
    who: "Dr. Ravi Kaur",
    photo: "kaur",
    spec: "Nephrology",
    when: "Thursday, 2:15 PM",
    mode: "Video visit",
    tag: "3 days",
  },
  {
    id: "s3",
    who: "Dr. Joan Linde",
    photo: "linde",
    spec: "Dermatology",
    when: "Monday, 11:00 AM",
    mode: "In person · Northgate",
    tag: "4 days",
  },
];

export const vitalsTrend = [
  { label: "Mar", upcr: 1.9, pain: 6, energy: 3 },
  { label: "Apr", upcr: 1.6, pain: 5, energy: 4 },
  { label: "May", upcr: 1.4, pain: 5, energy: 4 },
  { label: "Jun", upcr: 1.1, pain: 3, energy: 6 },
  { label: "Jul", upcr: 0.9, pain: 4, energy: 6 },
  { label: "Aug", upcr: 0.8, pain: 2, energy: 7 },
];

export const checkins = [
  {
    day: "Today",
    items: ["Morning stiffness: 25 min", "Ankle swelling: none", "Mycophenolate taken"],
    flag: null,
  },
  {
    day: "Yesterday",
    items: ["Morning stiffness: 40 min", "Rash: mild, cheeks", "Energy 6/10"],
    flag: null,
  },
  {
    day: "Fri",
    items: ["Ankle puffiness noted", "Urine appeared foamy"],
    flag: "Sent to Dr. Kaur · UPCR ordered same day",
  },
  { day: "Thu", items: ["Slept 5 h", "Pain 4/10"], flag: null },
];

/**
 * The safety screen, written for the person answering it rather than for a
 * chart. Thresholds are kept — they are what she can actually measure at home —
 * but the clinical shorthand is not. The `id`s stay as internal state keys and
 * are never shown: "R3" means nothing to Maria.
 */
export const redFlags = [
  { id: "R1", t: "Chest pain, pain when you breathe in, or new shortness of breath" },
  { id: "R2", t: "A fever of 38 °C / 100.4 °F or higher" },
  { id: "R3", t: "Blood pressure under 90, or a pulse over 120" },
  { id: "R4", t: "Anything new and neurological — confusion, weakness, a seizure" },
  { id: "R5", t: "One joint hot and swollen, much worse than the rest, with a fever" },
  { id: "R6", t: "Passing less urine, new puffiness, or foamy urine" },
  { id: "R7", t: "The home flare plan not working after 48 hours" },
];

export type ChatTurn = {
  id: string;
  agent: string[];
  /** Reply options the patient can tap. */
  options: {
    label: string;
    clear?: string[];
    fire?: string[];
    next: string;
    system?: string;
  }[];
};

/** Branching night-flare conversation. Two endings: urgent specialty, or ED. */
export const chatFlow: Record<string, ChatTurn> = {
  start: {
    id: "start",
    agent: [
      "Hi Maria. I can see you're on hydroxychloroquine and mycophenolate, and that Dr. Osei is your rheumatologist. Tell me what's happening tonight.",
    ],
    options: [
      { label: "My hands and knees ache badly and the rash on my face is back.", next: "breath" },
      { label: "I'm shaking, burning up, and feel out of it.", next: "fever", fire: ["R2"] },
    ],
  },
  breath: {
    id: "breath",
    agent: [
      "That sounds like a flare pattern, and I want to rule out the dangerous look-alikes before we do anything else.",
      "Any chest pain, pain when you breathe in, or new shortness of breath?",
    ],
    options: [
      { label: "No — breathing is fine, no chest pain.", clear: ["R1"], next: "temp" },
      { label: "Yes, it hurts when I take a deep breath.", fire: ["R1"], next: "ed" },
    ],
  },
  temp: {
    id: "temp",
    agent: [
      "Good. Now your temperature, and anything neurological — confusion, weakness, a headache that feels different.",
    ],
    options: [
      {
        label: "37.4. No headache. Just exhausted and sore.",
        clear: ["R2", "R4"],
        next: "joint",
        system: "Home cuff paired · BP 118/74 · pulse 88 — blood pressure and pulse are fine",
      },
      { label: "38.9 and I can't stop shivering.", fire: ["R2"], next: "fever" },
    ],
  },
  joint: {
    id: "joint",
    agent: ["Is any single joint hot, red, and dramatically worse than the others?"],
    options: [
      {
        label: "No — both hands and both knees, the way it usually goes.",
        clear: ["R3", "R5"],
        next: "renal",
      },
      { label: "My right knee is hot and I can't bend it.", fire: ["R5"], next: "ed" },
    ],
  },
  renal: {
    id: "renal",
    agent: [
      "Last one, and it's the one that matters most with your nephritis history. Any change in your urine, or puffiness in your ankles?",
    ],
    options: [
      {
        label: "My ankles have been puffy three days, and my urine looked foamy this morning.",
        fire: ["R6"],
        clear: ["R7"],
        next: "urgent",
        system:
          "A kidney warning sign, on a history of class III nephritis — routing you to urgent rheumatology and nephrology, not the emergency room",
      },
      {
        label: "No swelling, urine looks normal.",
        clear: ["R6", "R7"],
        next: "routine",
        system: "Every safety check is clear — home flare plan",
      },
    ],
  },
  fever: {
    id: "fever",
    agent: ["Stop — I need a blood pressure reading right now. Can you put the cuff on?"],
    options: [
      {
        label: "88 over 54. Heart rate 118.",
        fire: ["R3"],
        next: "ed",
        system:
          "Fever with a low blood pressure while immunosuppressed — infection pathway, screen stops here",
      },
    ],
  },
};

export const dispositions = {
  urgent: {
    level: "urgent" as const,
    label: "Urgent — you'll be seen within 24 hours",
    head: "Rheumatology in the morning, your kidney doctor looped in, labs tonight",
    body: "Nothing here needs an emergency room. But foamy urine and three days of ankle swelling, on your kidney history, need proper labs and a specialist tomorrow — not in three weeks, and not from an emergency room that will send you home with ibuprofen.",
    acts: [
      "Rheumatology 8:40 AM tomorrow — Dr. Osei, Riverside",
      "Urine and kidney bloods tonight, at the 24-hour lab on Vine Street",
      "Dr. Kaur, your kidney doctor, notified with your trend chart attached",
      "Prednisone 20 mg tonight, per the plan you already have",
      "Tasha calls you at 9 AM whether or not you make the visit",
    ],
  },
  ed: {
    level: "emergent" as const,
    label: "Go now — this one needs the emergency room",
    head: "Mercy General — and they already know you are coming",
    body: "This is the one time the answer is the emergency room. Our job is to get you there faster, and better documented, than you would arrive alone. When you get there, tell them: I am immunosuppressed on mycophenolate, I have a fever, and my blood pressure is low.",
    acts: [
      "Mercy General already has your medication list and your last labs",
      "Dr. Osei paged — on-call response in 6 minutes",
      "Nurse stays on this line until you confirm arrival",
      "Someone checks in on you the day after you get home",
    ],
  },
  routine: {
    level: "routine" as const,
    label: "We can manage this at home",
    head: "We manage it at home, with a 48-hour safety net",
    body: "This looks like your usual flare pattern, with nothing dangerous behind it. We treat it at home and I check back — if it has not turned by Wednesday, that becomes an urgent visit on its own, without you having to ask.",
    acts: [
      "Your home flare plan: rest, anti-inflammatories on schedule, heat, and log what you drink",
      "Daily check-in prompt at 8 PM for 3 days",
      "An urgent rheumatology visit books itself if nothing improves in 48 hours",
      "Dr. Osei reads this thread at her Monday review",
    ],
  },
};

export const communityRooms = [
  {
    id: "neph",
    name: "Nephritis & kidneys",
    members: 412,
    active: "9 online",
    blurb: "For the subset who got the biopsy.",
  },
  {
    id: "work",
    name: "Working through flares",
    members: 1_884,
    active: "31 online",
    blurb: "Disclosure, FMLA, bad managers, good ones.",
  },
  {
    id: "meds",
    name: "Mycophenolate club",
    members: 663,
    active: "14 online",
    blurb: "Nausea hacks, timing, pregnancy planning.",
  },
  {
    id: "new",
    name: "Newly diagnosed",
    members: 1_207,
    active: "22 online",
    blurb: "Moderated by care coordinators, weekly AMA.",
  },
];

export const communityPosts: {
  room: string;
  author: string;
  photo: PersonKey;
  meta: string;
  when: string;
  body: string;
  replies: number;
  liked: number;
  mine?: boolean;
  staff?: boolean;
}[] = [
  {
    room: "Nephritis & kidneys",
    author: "Rosalind K.",
    photo: "rosalind",
    meta: "38 · class IV · 3 y",
    when: "2 h",
    body: "The foamy urine thing. Nobody told me to look for it for two years. I now photograph it and log it, which sounds insane, but my nephrologist actually uses the log.",
    replies: 14,
    liked: 62,
  },
  {
    room: "Working through flares",
    author: "Maria D.",
    photo: "maria",
    meta: "34 · SLE + nephritis",
    when: "yesterday",
    body: "Went four months once between the rheum saying 'see nephrology' and actually seeing nephrology. If you are in that gap right now: ask your coordinator to send the referral as urgent with the labs attached. It moved mine from 11 weeks to 4 days.",
    replies: 31,
    liked: 148,
    mine: true,
  },
  {
    room: "Mycophenolate club",
    author: "Denise A.",
    photo: "denise",
    meta: "45 · SLE · 7 y",
    when: "yesterday",
    body: "Splitting the dose and taking it with a real meal, not a cracker, ended the nausea for me. Six weeks in and I stopped dreading 8 PM.",
    replies: 22,
    liked: 91,
  },
  {
    room: "Newly diagnosed",
    author: "Tasha Brant, RN",
    photo: "brant",
    meta: "Thyma care coordinator",
    when: "2 d",
    body: "Thursday AMA topic: what a rheumatology visit should actually cover, and the three questions worth writing down beforehand. Drop questions below and I'll answer live.",
    replies: 47,
    liked: 210,
    staff: true,
  },
];

export const providerActions = [
  {
    id: "refer",
    title: "Refer to a specialist",
    sla: "Median 4 days to seen",
    body: "Send a patient to rheumatology, nephrology or dermatology from one form. Thyma holds contracted next-day and 72-hour slots; you get a confirmed appointment back, not a fax receipt.",
    steps: [
      "Pick specialty and urgency",
      "Attach the labs that made you worried",
      "Confirmed slot returns to your inbox in under an hour",
    ],
  },
  {
    id: "rx",
    title: "Fill an urgent prescription",
    sla: "Same day",
    body: "Steroid bridges, antiemetics, prophylaxis. Prior authorization is opened, appealed and tracked by Thyma's pharmacy team rather than dying in a portal.",
    steps: [
      "Order against the shared med list",
      "PA opened automatically with chart notes",
      "Patient texted the pickup location",
    ],
  },
  {
    id: "ed",
    title: "Send to the emergency department",
    sla: "Immediate, with handoff",
    body: "When the ED is the right answer, it should be the fast answer. Thyma pre-notifies the receiving team, pushes the medication list and last labs, and pages the rheumatologist on call.",
    steps: [
      "One tap escalation",
      "Receiving ED pre-notified",
      "Rheumatology on-call paged, records pushed",
    ],
  },
];

export const payerStats = [
  { v: "$2,470", k: "Gross savings per engaged high-risk member, per year" },
  { v: "$1,020", k: "Net reduction in medical spend the plan keeps" },
  { v: "~1.7×", k: "Plan ROI on gross savings · target 2–3× as contracts mature" },
];

export const payerMath = [
  { label: "Gross savings generated", calc: "8,000 × $2,470", amt: "$19.76M" },
  { label: "Care management fee", calc: "8,000 × $100 × 12 months", amt: "−$9.60M", neg: true },
  { label: "Shared savings to Thyma", calc: "20% × ($19.76M − $9.60M)", amt: "−$2.03M", neg: true },
  { label: "Plan keeps", calc: "$1,020 per member", amt: "$8.13M", total: true },
  {
    label: "Thyma revenue",
    calc: "$9.60M fees + $2.03M shared savings",
    amt: "$11.63M",
    total: true,
  },
];
