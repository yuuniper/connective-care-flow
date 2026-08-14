import type { PersonKey } from "./people";

/**
 * Panel fixtures for the clinical console.
 *
 * Simulated throughout — no MRN, lab value, encounter or note here belongs to a
 * real person, and the photographs depict models. This lives beside `thyma.ts`
 * rather than inside the route so the console component stays readable; the lab
 * shape deliberately matches `recentLabs` there (value / unit / ref / flag), so
 * the two can be read side by side.
 *
 * Timestamps are stored ISO-ish and formatted by `fmtDateTime` below. They are
 * never derived from the clock: the app server-renders, so a relative time or a
 * `new Date()` in render would hydrate to a different string than it shipped.
 */

/** Standard H/L convention, doubled for critical. */
export type LabFlag = "H" | "L" | "HH" | "LL" | null;

export type Lab = {
  name: string;
  value: string;
  unit: string;
  /** Reference range, shown beside the value rather than encoded in a color. */
  ref: string;
  flag: LabFlag;
  drawn: string;
};

export type Med = {
  name: string;
  dose: string;
  sig: string;
  started: string;
  /** Set where the medication itself is the actionable finding. */
  alert: string | null;
};

export type Encounter = {
  when: string;
  type: string;
  where: string;
  clinician: string;
  disposition: string;
  /** ED and inpatient encounters flag; office visits do not. */
  acute: boolean;
};

export type Note = {
  when: string;
  kind: string;
  author: string;
  excerpt: string;
};

export type PanelPatient = {
  id: string;
  name: string;
  first: string;
  /** Charts sort and display by family name. */
  last: string;
  photo: PersonKey;
  mrn: string;
  dob: string;
  age: number;
  sex: "F" | "M";
  dx: string;
  meta: string;
  allergies: string[];
  /** Standing chart flags — the things a banner exists to keep in view. */
  flags: string[];
  risk: number;
  ed: number;
  /** Open contact, or null for routine outreach. */
  openedAt: string | null;
  drivers: string[];
  live: boolean;
  labs: Lab[];
  meds: Med[];
  encounters: Encounter[];
  notes: Note[];
};

/**
 * "2026-08-14T19:02" → "08/14/2026 19:02"; date-only input drops the time.
 *
 * String surgery rather than `Date`, on purpose: no timezone is applied, so the
 * server and the browser produce byte-identical output.
 */
export function fmtDateTime(iso: string): string {
  const [date = "", time] = iso.split("T");
  const [y = "", m = "", d = ""] = date.split("-");
  const stamp = `${m}/${d}/${y}`;
  return time ? `${stamp} ${time.slice(0, 5)}` : stamp;
}

export const panel: PanelPatient[] = [
  {
    id: "brooks-a",
    name: "Alicia Brooks",
    first: "Alicia",
    last: "Brooks",
    photo: "alicia",
    mrn: "4417092",
    dob: "1985-06-02",
    age: 41,
    sex: "F",
    dx: "SLE, prednisone 40 mg taper",
    meta: "41 · F · SLE, prednisone 40 mg taper",
    allergies: ["Penicillin (anaphylaxis)", "Latex"],
    flags: ["Immunosuppressed", "Fall risk"],
    risk: 91,
    ed: 3,
    openedAt: "2026-08-14T02:14",
    drivers: ["3 ED visits", "Steroid 40 mg", "Immunosuppressed"],
    live: true,
    labs: [
      {
        name: "WBC",
        value: "2.9",
        unit: "K/µL",
        ref: "4.0–11.0",
        flag: "LL",
        drawn: "2026-08-13T22:40",
      },
      {
        name: "Absolute neutrophils",
        value: "1.1",
        unit: "K/µL",
        ref: "1.8–7.7",
        flag: "L",
        drawn: "2026-08-13T22:40",
      },
      {
        name: "Creatinine, serum",
        value: "1.4",
        unit: "mg/dL",
        ref: "0.6–1.1",
        flag: "H",
        drawn: "2026-08-13T22:40",
      },
      {
        name: "C3 complement",
        value: "62",
        unit: "mg/dL",
        ref: "90–180",
        flag: "L",
        drawn: "2026-08-13T22:40",
      },
      {
        name: "Hemoglobin",
        value: "11.8",
        unit: "g/dL",
        ref: "11.5–15.5",
        flag: null,
        drawn: "2026-08-13T22:40",
      },
    ],
    meds: [
      {
        name: "Prednisone",
        dose: "40 mg",
        sig: "PO daily, taper",
        started: "2026-07-21",
        alert: "High-dose steroid",
      },
      {
        name: "Hydroxychloroquine",
        dose: "400 mg",
        sig: "PO daily",
        started: "2023-02-09",
        alert: null,
      },
      {
        name: "Mycophenolate",
        dose: "1 g",
        sig: "PO BID",
        started: "2025-11-03",
        alert: "Neutropenia — hold pending count",
      },
    ],
    encounters: [
      {
        when: "2026-08-14T02:14",
        type: "Triage contact",
        where: "Thyma 24/7 line",
        clinician: "T. Brant, RN",
        disposition: "Open — awaiting callback",
        acute: true,
      },
      {
        when: "2026-07-30T18:05",
        type: "ED visit",
        where: "St. Vincent ED",
        clinician: "—",
        disposition: "Discharged, 6 h",
        acute: true,
      },
      {
        when: "2026-07-21T09:30",
        type: "Office visit",
        where: "Rheumatology",
        clinician: "A. Osei, MD",
        disposition: "Steroid burst started",
        acute: false,
      },
    ],
    notes: [
      {
        when: "2026-08-14T02:31",
        kind: "Triage note",
        author: "T. Brant, RN",
        excerpt:
          "Called re: fever 38.3 °C and new productive cough on day 24 of prednisone 40 mg. Neutropenic on last count. Advised same-day evaluation; rheumatology paged.",
      },
      {
        when: "2026-07-21T09:52",
        kind: "Progress note",
        author: "A. Osei, MD",
        excerpt:
          "Arthritis flare involving wrists and MCPs bilaterally. Starting prednisone 40 mg with planned taper over six weeks. Counseled on infection precautions.",
      },
    ],
  },
  {
    id: "delgado-m",
    name: "Maria Delgado",
    first: "Maria",
    last: "Delgado",
    photo: "maria",
    mrn: "3820147",
    dob: "1992-03-14",
    age: 34,
    sex: "F",
    dx: "SLE with class III lupus nephritis",
    meta: "34 · F · SLE + class III nephritis",
    allergies: ["Sulfamethoxazole (rash)"],
    flags: ["Nephritis", "PA lapse"],
    risk: 87,
    ed: 2,
    openedAt: "2026-08-14T19:02",
    drivers: ["2 ED visits", "3 steroid bursts", "Nephritis", "PA lapse 6wk"],
    live: true,
    labs: [
      {
        name: "Urine protein/creatinine",
        value: "0.8",
        unit: "g/g",
        ref: "< 0.5",
        flag: "H",
        drawn: "2026-07-28T08:15",
      },
      {
        name: "Creatinine, serum",
        value: "0.9",
        unit: "mg/dL",
        ref: "0.6–1.1",
        flag: null,
        drawn: "2026-07-28T08:15",
      },
      {
        name: "C3 complement",
        value: "98",
        unit: "mg/dL",
        ref: "90–180",
        flag: null,
        drawn: "2026-07-28T08:15",
      },
      {
        name: "C4 complement",
        value: "21",
        unit: "mg/dL",
        ref: "10–40",
        flag: null,
        drawn: "2026-07-28T08:15",
      },
      {
        name: "Anti-dsDNA",
        value: "88",
        unit: "IU/mL",
        ref: "< 30",
        flag: "H",
        drawn: "2026-07-28T08:15",
      },
    ],
    meds: [
      {
        name: "Hydroxychloroquine",
        dose: "300 mg",
        sig: "PO daily",
        started: "2021-09-14",
        alert: null,
      },
      {
        name: "Mycophenolate",
        dose: "1 g",
        sig: "PO BID",
        started: "2024-04-02",
        alert: "Prior auth lapsed 6 wk",
      },
      { name: "Lisinopril", dose: "10 mg", sig: "PO daily", started: "2024-04-02", alert: null },
    ],
    encounters: [
      {
        when: "2026-08-14T19:02",
        type: "Triage contact",
        where: "Thyma 24/7 line",
        clinician: "T. Brant, RN",
        disposition: "Open — in session",
        acute: true,
      },
      {
        when: "2026-07-28T08:15",
        type: "Lab draw",
        where: "Vine Street",
        clinician: "—",
        disposition: "UPCR resulted",
        acute: false,
      },
      {
        when: "2026-06-11T14:20",
        type: "Office visit",
        where: "Nephrology",
        clinician: "R. Kaur, MD",
        disposition: "Continue current regimen",
        acute: false,
      },
    ],
    notes: [
      {
        when: "2026-07-28T09:04",
        kind: "Result note",
        author: "R. Kaur, MD",
        excerpt:
          "UPCR 0.8 g/g, down from 1.9 in March but still above goal. Continue mycophenolate; recheck in six weeks. Prior authorization lapse escalated to the plan.",
      },
      {
        when: "2026-06-11T14:48",
        kind: "Progress note",
        author: "R. Kaur, MD",
        excerpt:
          "Class III lupus nephritis, improving on current therapy. No edema on exam today. Reinforced home check-ins for foamy urine and ankle swelling.",
      },
    ],
  },
  {
    id: "raman-p",
    name: "Priya Raman",
    first: "Priya",
    last: "Raman",
    photo: "priya",
    mrn: "5104663",
    dob: "1997-01-27",
    age: 29,
    sex: "F",
    dx: "SLE",
    meta: "29 · F · SLE",
    allergies: [],
    flags: ["Infusion overdue"],
    risk: 64,
    ed: 1,
    openedAt: null,
    drivers: ["Missed infusion"],
    live: false,
    labs: [
      {
        name: "C3 complement",
        value: "84",
        unit: "mg/dL",
        ref: "90–180",
        flag: "L",
        drawn: "2026-08-04T10:05",
      },
      {
        name: "Creatinine, serum",
        value: "0.8",
        unit: "mg/dL",
        ref: "0.6–1.1",
        flag: null,
        drawn: "2026-08-04T10:05",
      },
      {
        name: "Hemoglobin",
        value: "12.4",
        unit: "g/dL",
        ref: "11.5–15.5",
        flag: null,
        drawn: "2026-08-04T10:05",
      },
    ],
    meds: [
      {
        name: "Belimumab",
        dose: "10 mg/kg",
        sig: "IV q4 weeks",
        started: "2025-08-19",
        alert: "Infusion missed 07/24",
      },
      {
        name: "Hydroxychloroquine",
        dose: "200 mg",
        sig: "PO daily",
        started: "2024-05-30",
        alert: null,
      },
    ],
    encounters: [
      {
        when: "2026-08-04T10:05",
        type: "Lab draw",
        where: "Vine Street",
        clinician: "—",
        disposition: "Resulted",
        acute: false,
      },
      {
        when: "2026-06-26T11:00",
        type: "Infusion",
        where: "Infusion center",
        clinician: "J. Linde, MD",
        disposition: "Completed",
        acute: false,
      },
    ],
    notes: [
      {
        when: "2026-08-05T08:12",
        kind: "Care coordination",
        author: "T. Brant, RN",
        excerpt:
          "Missed 07/24 infusion — transport fell through. Rescheduled for 08/21 with ride share arranged. C3 trending down; flagged to rheumatology.",
      },
    ],
  },
  {
    id: "ochoa-d",
    name: "Dennis Ochoa",
    first: "Dennis",
    last: "Ochoa",
    photo: "dennis",
    mrn: "2298510",
    dob: "1960-11-08",
    age: 66,
    sex: "M",
    dx: "Rheumatoid arthritis, erosive",
    meta: "66 · M · RA, erosive",
    allergies: ["Codeine (nausea)"],
    flags: ["Biologic gap"],
    risk: 58,
    ed: 1,
    openedAt: null,
    drivers: ["Biologic gap 74d"],
    live: false,
    labs: [
      {
        name: "CRP",
        value: "18",
        unit: "mg/L",
        ref: "< 5",
        flag: "H",
        drawn: "2026-07-19T09:22",
      },
      {
        name: "ESR",
        value: "42",
        unit: "mm/h",
        ref: "0–20",
        flag: "H",
        drawn: "2026-07-19T09:22",
      },
      {
        name: "ALT",
        value: "28",
        unit: "U/L",
        ref: "7–56",
        flag: null,
        drawn: "2026-07-19T09:22",
      },
    ],
    meds: [
      {
        name: "Adalimumab",
        dose: "40 mg",
        sig: "SC q2 weeks",
        started: "2024-01-15",
        alert: "Gap 74 days — refill not filled",
      },
      { name: "Methotrexate", dose: "20 mg", sig: "PO weekly", started: "2022-03-11", alert: null },
      { name: "Folic acid", dose: "1 mg", sig: "PO daily", started: "2022-03-11", alert: null },
    ],
    encounters: [
      {
        when: "2026-07-19T09:22",
        type: "Lab draw",
        where: "Vine Street",
        clinician: "—",
        disposition: "Resulted",
        acute: false,
      },
      {
        when: "2026-05-02T13:40",
        type: "Office visit",
        where: "Rheumatology",
        clinician: "A. Osei, MD",
        disposition: "Continue adalimumab",
        acute: false,
      },
    ],
    notes: [
      {
        when: "2026-07-20T10:30",
        kind: "Care coordination",
        author: "T. Brant, RN",
        excerpt:
          "Adalimumab not filled since 05/07 — specialty pharmacy shows a copay barrier. Inflammatory markers rising. Foundation assistance application started.",
      },
    ],
  },
  {
    id: "liu-k",
    name: "Karen Liu",
    first: "Karen",
    last: "Liu",
    photo: "karen",
    mrn: "6733029",
    dob: "1979-09-21",
    age: 47,
    sex: "F",
    dx: "SLE",
    meta: "47 · F · SLE",
    allergies: [],
    flags: [],
    risk: 41,
    ed: 0,
    openedAt: null,
    drivers: [],
    live: false,
    labs: [
      {
        name: "C3 complement",
        value: "112",
        unit: "mg/dL",
        ref: "90–180",
        flag: null,
        drawn: "2026-07-02T08:50",
      },
      {
        name: "Creatinine, serum",
        value: "0.7",
        unit: "mg/dL",
        ref: "0.6–1.1",
        flag: null,
        drawn: "2026-07-02T08:50",
      },
      {
        name: "Urine protein/creatinine",
        value: "0.2",
        unit: "g/g",
        ref: "< 0.5",
        flag: null,
        drawn: "2026-07-02T08:50",
      },
    ],
    meds: [
      {
        name: "Hydroxychloroquine",
        dose: "300 mg",
        sig: "PO daily",
        started: "2020-10-05",
        alert: null,
      },
    ],
    encounters: [
      {
        when: "2026-07-02T08:50",
        type: "Lab draw",
        where: "Vine Street",
        clinician: "—",
        disposition: "Resulted, stable",
        acute: false,
      },
      {
        when: "2026-04-16T15:10",
        type: "Office visit",
        where: "Rheumatology",
        clinician: "A. Osei, MD",
        disposition: "Stable, 6-month follow-up",
        acute: false,
      },
    ],
    notes: [
      {
        when: "2026-07-02T11:15",
        kind: "Result note",
        author: "A. Osei, MD",
        excerpt:
          "Serologies stable, no proteinuria. Quiescent disease on hydroxychloroquine monotherapy. Routine outreach cadence appropriate.",
      },
    ],
  },
];

/** Panel-level counters shown in the sidebar. Static in the prototype. */
export const panelStats = {
  enrolled: "8,412",
  highRisk: "1,190",
  openContacts: panel.filter((p) => p.openedAt).length,
  medianToSpecialist: "4 days",
};
