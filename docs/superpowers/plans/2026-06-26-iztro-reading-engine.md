# iztro Reading Engine + Lead-Gen Copy Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-rolled BaZi math in `src/lib/bazi.ts` with the `iztro` library as the accurate calculation engine, add birth-hour + gender inputs, and rebuild the free-reading result page around a "curiosity-gap → Book" conversion flow with funnel analytics.

**Architecture:** `iztro` is used only as the calculation engine (correct lunar/solar conversion + four pillars + five-elements). A thin adapter (`src/lib/reading.ts`) maps iztro's raw output into the existing `BaziResult` shape (extended with an hour pillar), and ALL user-facing strings continue to come from our own EN/ZH translation tables — iztro's English star names are never shown. The free-reading page collects date + hour + gender, renders a branded teaser, and fires analytics events at each funnel step.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, next-intl, `iztro`.

## Global Constraints

- Next.js 16.2.7 — before writing any Next-specific code, read the relevant guide in `node_modules/next/dist/docs/` (per `AGENTS.md`).
- All user-facing copy must exist in BOTH `src/messages/zh.json` and `src/messages/en.json`; the page reads strings via `useTranslations`.
- Never render iztro's built-in English星名/translations to users. English UI text comes only from our own tables.
- `iztro` must be loaded via dynamic `import()` inside the client handler, not a top-level import, to keep it out of the first-load bundle.
- Existing public interface `BaziResult` from `src/lib/bazi.ts` may be extended but existing field names/types must not change (the result page depends on them).
- Keep the existing dark theme tokens (`bg-secondary`, `accent`, `text-secondary`, etc.) — no new design system.

---

### Task 1: Install iztro and lock its API surface

**Files:**
- Modify: `package.json` (add `iztro` dependency)
- Create: `scratch/iztro-probe.mjs` (throwaway, deleted at end of task)

- [ ] **Step 1: Install the library**

Run: `npm install iztro`
Expected: `iztro` appears under `dependencies` in `package.json`, install exits 0.

- [ ] **Step 2: Read the bundled type definitions to learn the real API**

Read these files (exact paths may vary by version — glob first):
Run: `ls node_modules/iztro/dist/` and `find node_modules/iztro -name "*.d.ts" | head -30`
Read the entry `.d.ts` for the `astro` export and the `FunctionalAstrolabe` type. Confirm the signature of the solar entry point (expected shape: `astro.bySolar(solarDateStr, timeIndex, gender, fixLeap?, language?)`) and what the returned astrolabe exposes for: four pillars / chinese date, five-elements class, soul/body, and palaces.

- [ ] **Step 3: Write a probe script capturing golden output for a fixed input**

```js
// scratch/iztro-probe.mjs
import { astro } from 'iztro';

// Canonical fixed input — female, born 2000-08-16, 子时 (timeIndex 0)
const a = astro.bySolar('2000-8-16', 0, '女', true, 'zh-CN');
console.log(JSON.stringify({
  chineseDate: a.chineseDate,
  rawDates: a.rawDates,
  fiveElementsClass: a.fiveElementsClass,
  soul: a.soul,
  body: a.body,
  earthlyBranchOfSoulPalace: a.earthlyBranchOfSoulPalace,
}, null, 2));
```

- [ ] **Step 4: Run the probe and record the real output**

Run: `node scratch/iztro-probe.mjs`
Expected: JSON prints without throwing. COPY the printed `chineseDate` / `rawDates` structure into a comment at the top of `src/lib/reading.ts` in Task 2 — these become the golden values the adapter test asserts against. If any field above does not exist on the returned object, note the actual field names from the Step 2 `.d.ts` read and use those instead.

- [ ] **Step 5: Delete the probe and commit**

```bash
rm -rf scratch
git add package.json package-lock.json
git commit -m "chore: add iztro dependency"
```

---

### Task 2: Build the reading adapter (`src/lib/reading.ts`)

**Files:**
- Create: `src/lib/reading.ts`
- Test: `src/lib/reading.test.ts`
- Modify: `src/lib/bazi.ts` (export the five-element label/trait tables for reuse — see Interfaces)

**Interfaces:**
- Consumes: golden iztro output captured in Task 1; the constant tables in `src/lib/bazi.ts` (`STEM_ELEMENTS`, `BRANCH_ELEMENTS`, `ZODIAC_EN/ZH`, `NAYIN_*`, `TRAITS_*`, `MISSING_*`, `ELEMENT_LABELS_*`).
- Produces:
  ```ts
  export interface ReadingInput {
    year: number; month: number; day: number;
    timeIndex: number;        // 0–11, iztro 时辰 index (子=0 … 亥=11)
    gender: 'male' | 'female';
    locale: 'en' | 'zh';
  }
  export interface ReadingResult extends BaziResult {
    hourPillar: Pillar;       // new — now that we collect birth time
  }
  export function getReading(input: ReadingInput): ReadingResult;
  ```

- [ ] **Step 1: Make bazi.ts tables reusable**

In `src/lib/bazi.ts`, add `export` to the constant declarations the adapter needs: `STEM_ELEMENTS`, `BRANCH_ELEMENTS`, `HEAVENLY_STEMS`, `EARTHLY_BRANCHES`, `STEMS_EN`, `BRANCHES_EN`, `ZODIAC_EN`, `ZODIAC_ZH`, `NAYIN_ZH`, `NAYIN_EN`, `NAYIN_ELEMENT_ZH`, `NAYIN_ELEMENT_EN`, `TRAITS_EN`, `TRAITS_ZH`, `MISSING_EN`, `MISSING_ZH`, `ELEMENT_LABELS_ZH`, and the `getStemBranch` helper. Do not change their values.

- [ ] **Step 2: Write the failing adapter test**

Use the golden values recorded in Task 1, Step 4 for input `{year:2000,month:8,day:16,timeIndex:0,gender:'female',locale:'zh'}`. Replace the `expect(...)` literals below with the actual pillar strings from the golden output before running.

```ts
// src/lib/reading.test.ts
import { describe, it, expect } from 'vitest';
import { getReading } from './reading';

describe('getReading', () => {
  const base = { year: 2000, month: 8, day: 16, timeIndex: 0, gender: 'female' as const };

  it('returns four pillars including the hour pillar', () => {
    const r = getReading({ ...base, locale: 'zh' });
    // TODO: replace with golden values from Task 1 probe output
    expect(r.yearPillar.full).toBe('庚辰');
    expect(r.hourPillar.full).toBeTruthy();
    expect(r.hourPillar.full).toHaveLength(2);
  });

  it('element balance sums to 8 (four pillars × stem+branch)', () => {
    const r = getReading({ ...base, locale: 'zh' });
    const total = r.balance.wood + r.balance.fire + r.balance.earth + r.balance.metal + r.balance.water;
    expect(total).toBe(8);
  });

  it('localizes to English without leaking iztro star names', () => {
    const r = getReading({ ...base, locale: 'en' });
    expect(r.trait).toMatch(/dominant element/i);
    expect(r.zodiac).toBe('Dragon');
  });
});
```

- [ ] **Step 3: Verify vitest is available, then run the test to confirm it fails**

Run: `npx vitest run src/lib/reading.test.ts`
Expected: FAIL — `getReading` not found (or, if vitest is not installed, install dev dep first: `npm install -D vitest` and add `"test": "vitest"` to `package.json` scripts, then re-run).

- [ ] **Step 4: Implement the adapter**

```ts
// src/lib/reading.ts
import { astro } from 'iztro';
import {
  STEM_ELEMENTS, BRANCH_ELEMENTS, HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEMS_EN, BRANCHES_EN, ZODIAC_EN, ZODIAC_ZH,
  NAYIN_ZH, NAYIN_EN, NAYIN_ELEMENT_ZH, NAYIN_ELEMENT_EN,
  TRAITS_EN, TRAITS_ZH, MISSING_EN, MISSING_ZH, ELEMENT_LABELS_ZH,
  getStemBranch, type BaziResult, type Pillar, type ElementBalance,
} from './bazi';

export interface ReadingInput {
  year: number; month: number; day: number;
  timeIndex: number; gender: 'male' | 'female'; locale: 'en' | 'zh';
}
export interface ReadingResult extends BaziResult { hourPillar: Pillar; }

// Map iztro's four-pillar output (recorded in Task 1) into [stemIdx, branchIdx] pairs.
// iztro.rawDates / chineseDate exposes the heavenly stem + earthly branch per pillar.
// Adjust the extraction below to match the EXACT field names confirmed in Task 1, Step 2.
function pillarIndices(astrolabe: ReturnType<typeof astro.bySolar>) {
  // Expected: astrolabe.rawDates.chineseDate is [yearStem, yearBranch, monthStem, monthBranch,
  //           dayStem, dayBranch, hourStem, hourBranch] as 0-based indices.
  const cd = (astrolabe as any).rawDates.chineseDate;
  return {
    year:  { s: cd[0], b: cd[1] },
    month: { s: cd[2], b: cd[3] },
    day:   { s: cd[4], b: cd[5] },
    hour:  { s: cd[6], b: cd[7] },
  };
}

function toPillar(s: number, b: number, locale: 'en' | 'zh'): Pillar {
  return {
    stem: locale === 'zh' ? HEAVENLY_STEMS[s] : STEMS_EN[s],
    branch: locale === 'zh' ? EARTHLY_BRANCHES[b] : BRANCHES_EN[b],
    full: getStemBranch(s, b, locale),
  };
}

export function getReading(input: ReadingInput): ReadingResult {
  const { year, month, day, timeIndex, gender, locale } = input;
  const solar = `${year}-${month}-${day}`;
  const genderZh = gender === 'male' ? '男' : '女';
  const astrolabe = astro.bySolar(solar, timeIndex, genderZh, true, 'zh-CN');
  const p = pillarIndices(astrolabe);

  const yearPillar = toPillar(p.year.s, p.year.b, locale);
  const monthPillar = toPillar(p.month.s, p.month.b, locale);
  const dayPillar = toPillar(p.day.s, p.day.b, locale);
  const hourPillar = toPillar(p.hour.s, p.hour.b, locale);

  const jiazi = ((p.day.s % 10) + 10) % 10; // recompute nayin index from day stem/branch
  const dayJiazi = (() => {
    // sexagenary index of the day pillar: align stem (10) + branch (12) → 0..59
    for (let i = 0; i < 60; i++) {
      if (i % 10 === p.day.s && i % 12 === p.day.b) return i;
    }
    return 0;
  })();

  const zodiac = locale === 'zh' ? ZODIAC_ZH[p.year.b] : ZODIAC_EN[p.year.b];
  const nayin = locale === 'zh' ? NAYIN_ZH[dayJiazi] : NAYIN_EN[dayJiazi];
  const nayinElement = locale === 'zh' ? NAYIN_ELEMENT_ZH[dayJiazi] : NAYIN_ELEMENT_EN[dayJiazi];
  const dayElement = STEM_ELEMENTS[p.day.s];

  const allElements = [
    STEM_ELEMENTS[p.year.s], BRANCH_ELEMENTS[p.year.b],
    STEM_ELEMENTS[p.month.s], BRANCH_ELEMENTS[p.month.b],
    STEM_ELEMENTS[p.day.s], BRANCH_ELEMENTS[p.day.b],
    STEM_ELEMENTS[p.hour.s], BRANCH_ELEMENTS[p.hour.b],
  ];
  const balance: ElementBalance = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const el of allElements) balance[el.toLowerCase() as keyof ElementBalance]++;

  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
  const missing = elements.filter(e => balance[e.toLowerCase() as keyof ElementBalance] === 0);
  const strongest = elements.reduce((a, b) =>
    balance[a.toLowerCase() as keyof ElementBalance] >= balance[b.toLowerCase() as keyof ElementBalance] ? a : b);

  const missingLabels = missing.map(e => (locale === 'zh' ? MISSING_ZH : MISSING_EN)[e]);
  const trait = locale === 'zh' ? TRAITS_ZH[strongest] : TRAITS_EN[strongest];

  return {
    yearPillar, monthPillar, dayPillar, hourPillar,
    zodiac, nayin, nayinElement,
    dayElement: locale === 'zh' ? ELEMENT_LABELS_ZH[dayElement] : dayElement,
    balance, missing: missingLabels,
    strongest: locale === 'zh' ? ELEMENT_LABELS_ZH[strongest] : strongest,
    trait,
  };
}
```

- [ ] **Step 5: Run the test, fix index extraction against golden output until green**

Run: `npx vitest run src/lib/reading.test.ts`
Expected: PASS. If pillar values mismatch, the `pillarIndices` extraction does not match iztro's real output shape — correct it using the Task 1 golden JSON, not by guessing.

- [ ] **Step 6: Commit**

```bash
git add src/lib/reading.ts src/lib/reading.test.ts src/lib/bazi.ts package.json
git commit -m "feat: add iztro-backed reading adapter with hour pillar"
```

---

### Task 3: Add birth-hour and gender inputs to the form

**Files:**
- Modify: `src/app/[locale]/free-reading/page.tsx`
- Modify: `src/messages/zh.json`, `src/messages/en.json`

**Interfaces:**
- Consumes: `getReading`, `ReadingInput`, `ReadingResult` from Task 2.
- Produces: form state now includes `timeIndex: string` and `gender: 'male' | 'female'`, passed into `getReading`.

- [ ] **Step 1: Add i18n strings for the new fields**

Add to the `FreeReading` object in BOTH message files. zh.json:
```json
"genderLabel": "性别",
"genderMale": "男",
"genderFemale": "女",
"hourLabel": "出生时辰",
"hourUnknown": "不确定 / 大约白天",
"hours": ["子时 (23-1点)","丑时 (1-3点)","寅时 (3-5点)","卯时 (5-7点)","辰时 (7-9点)","巳时 (9-11点)","午时 (11-13点)","未时 (13-15点)","申时 (15-17点)","酉时 (17-19点)","戌时 (19-21点)","亥时 (21-23点)"]
```
en.json:
```json
"genderLabel": "Gender",
"genderMale": "Male",
"genderFemale": "Female",
"hourLabel": "Birth Hour",
"hourUnknown": "Not sure / around midday",
"hours": ["23:00–01:00","01:00–03:00","03:00–05:00","05:00–07:00","07:00–09:00","09:00–11:00","11:00–13:00","13:00–15:00","15:00–17:00","17:00–19:00","19:00–21:00","21:00–23:00"]
```

- [ ] **Step 2: Switch the page to the new adapter and add state**

In `src/app/[locale]/free-reading/page.tsx`, replace the import and add state:
```tsx
import { getReading, type ReadingResult } from '../../../lib/reading';
// ...inside component:
const [timeIndex, setTimeIndex] = useState('6'); // default 午时 (midday) for "unknown"
const [gender, setGender] = useState<'male' | 'female'>('female');
const [result, setResult] = useState<ReadingResult | null>(null);
```

- [ ] **Step 3: Update the submit handler**

```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!year || !month || !day) return;
  setResult(getReading({
    year: Number(year), month: Number(month), day: Number(day),
    timeIndex: Number(timeIndex), gender, locale,
  }));
}
```

- [ ] **Step 4: Add the gender toggle and hour select to the form JSX**

Insert after the existing year/month/day grid, before the submit button. Use `t.raw('hours')` to read the hours array:
```tsx
<div>
  <label className="block text-sm text-text-secondary mb-2">{t('genderLabel')}</label>
  <div className="grid grid-cols-2 gap-3">
    {(['female', 'male'] as const).map((g) => (
      <button key={g} type="button" onClick={() => setGender(g)}
        className={`py-3 rounded-lg border transition-colors ${gender === g ? 'border-accent text-accent' : 'border-white/10 text-text-secondary'}`}>
        {t(g === 'male' ? 'genderMale' : 'genderFemale')}
      </button>
    ))}
  </div>
</div>
<div>
  <label className="block text-sm text-text-secondary mb-2">{t('hourLabel')}</label>
  <select value={timeIndex} onChange={(e) => setTimeIndex(e.target.value)}
    className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent/50">
    {(t.raw('hours') as string[]).map((h, i) => (
      <option key={i} value={i}>{h}</option>
    ))}
  </select>
</div>
```

- [ ] **Step 5: Build to verify it compiles and renders**

Run: `npm run build`
Expected: build succeeds with no type errors. (If `t.raw` typing complains, cast as shown.)

- [ ] **Step 6: Commit**

```bash
git add "src/app/[locale]/free-reading/page.tsx" src/messages/zh.json src/messages/en.json
git commit -m "feat: collect birth hour and gender for reading"
```

---

### Task 4: Rebuild the result page around the curiosity-gap → Book flow

**Files:**
- Modify: `src/app/[locale]/free-reading/page.tsx`
- Modify: `src/messages/zh.json`, `src/messages/en.json`

**Interfaces:**
- Consumes: `ReadingResult` (now includes `hourPillar`).
- Produces: result view shows four pillars + element balance + ONE personalized hook line, then a strong gated CTA. No new computation.

- [ ] **Step 1: Add hook/teaser copy to both message files**

The growth lever: show enough to feel accurate, withhold the actionable part. Replace the existing `teaser` and add a `hook` template in `FreeReading` for BOTH files.
zh.json:
```json
"resultTitle": "你的四柱命盘",
"hook": "你的主导能量是「{element}」，而命盘中{missing}的格局，正是影响你今年事业与感情走向的关键——完整解读会告诉你如何借势化解。",
"hookComplete": "你的五行格局相对均衡，但真正决定运势起伏的，是十年大运的流转节点——完整解读会揭示你当前所处的运势周期。",
"teaser": "免费版仅展示命盘骨架。完整解读包含：四柱全解、十年大运、流年运势、事业与感情方位、以及重大决策的择时建议。"
```
en.json:
```json
"resultTitle": "Your Four Pillars",
"hook": "Your dominant energy is {element}, and the {missing} pattern in your chart is exactly what shapes your career and relationships this year — a full reading shows you how to work with it.",
"hookComplete": "Your elements are relatively balanced — but what really drives your fortune is the timing of your 10-year cycles. A full reading reveals which cycle you are in right now.",
"teaser": "The free version shows only the skeleton of your chart. A full reading includes: all Four Pillars decoded, your 10-year luck cycles, this year's forecast, career & relationship directions, and timing for major decisions."
```

- [ ] **Step 2: Render the hour pillar in the pillars grid**

Change the pillars grid from 3 columns to 4 and add the hour pillar card:
```tsx
<div className="grid grid-cols-4 gap-2 mb-8">
  {/* existing year/month/day cards, change grid-cols-3 → grid-cols-4 */}
  <div className="text-center p-3 bg-bg-secondary rounded-lg border border-white/5">
    <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '时柱' : 'Hour'}</p>
    <p className="text-lg text-accent font-medium">{result.hourPillar.full}</p>
  </div>
</div>
```

- [ ] **Step 3: Replace the static trait line with the personalized hook**

Swap the existing `{result.trait}` paragraph for a hook that uses the strongest/missing fields, so every visitor sees a sentence that feels written about them:
```tsx
<p className="text-text-secondary leading-relaxed mb-10 text-center">
  {result.missing.length > 0
    ? t('hook', { element: result.strongest, missing: result.missing.join(locale === 'zh' ? '、' : ' & ') })
    : t('hookComplete')}
</p>
```

- [ ] **Step 4: Build to verify**

Run: `npm run build`
Expected: build succeeds. Manually load `/en/free-reading` and `/zh/free-reading` via `npm run dev`, submit a date, and confirm the hook sentence interpolates the element + missing values and the four pillars render.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/free-reading/page.tsx" src/messages/zh.json src/messages/en.json
git commit -m "feat: personalize result page around curiosity-gap CTA"
```

---

### Task 5: Add funnel analytics events

**Files:**
- Modify: `src/app/[locale]/free-reading/page.tsx`
- Create: `src/lib/analytics.ts`

**Interfaces:**
- Produces: `track(event: string, props?: Record<string, unknown>): void` — a safe wrapper that no-ops when no analytics provider is present, so it cannot break the page.

- [ ] **Step 1: Write the analytics wrapper**

```ts
// src/lib/analytics.ts
type Props = Record<string, unknown>;
export function track(event: string, props?: Props): void {
  if (typeof window === 'undefined') return;
  // TikTok pixel if present
  const ttq = (window as unknown as { ttq?: { track: (e: string, p?: Props) => void } }).ttq;
  ttq?.track(event, props);
  // Fallback: dataLayer for GTM/GA if present
  const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  dl?.push({ event, ...props });
}
```

- [ ] **Step 2: Fire events at the two funnel steps**

In the page: call `track('reading_completed', { gender, timeIndex })` inside `handleSubmit` right after `setResult(...)`, and add `onClick={() => track('reading_cta_click')}` to the `Link` that points to `/book`.
```tsx
import { track } from '../../../lib/analytics';
// in handleSubmit, after setResult(...):
track('reading_completed', { gender, timeIndex: Number(timeIndex) });
// on the Book CTA Link:
onClick={() => track('reading_cta_click')}
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/analytics.ts "src/app/[locale]/free-reading/page.tsx"
git commit -m "feat: track reading funnel events"
```

---

### Task 6: Retire the dead hand-rolled entry point

**Files:**
- Modify: `src/lib/bazi.ts`

- [ ] **Step 1: Confirm `getBasicReading` has no remaining callers**

Run: `grep -rn "getBasicReading" src`
Expected: zero matches (the page now uses `getReading`).

- [ ] **Step 2: Remove the now-unused `getBasicReading` function**

Delete the `export function getBasicReading(...) { ... }` block from `src/lib/bazi.ts`. Keep all the exported constant tables (still consumed by `reading.ts`) and keep `getYearPillar`/`getMonthPillar`/`getDayPillar`/`getDiffDays` only if nothing else references them — otherwise delete them too. Re-run the grep to confirm no dangling references.

- [ ] **Step 3: Build + test to verify nothing broke**

Run: `npm run build && npx vitest run`
Expected: build succeeds, all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/bazi.ts
git commit -m "refactor: drop superseded hand-rolled reading entry point"
```

---

## Notes for the implementer

- **Why iztro is only an engine:** iztro's English star-name translations read awkwardly to a US audience. We deliberately consume only its numeric/structural output and render through our own EN/ZH tables, which are already polished. Do not surface iztro's `.soul`/`.body`/palace English names in the UI.
- **Why the hook line matters most:** the conversion driver on this page is the personalized "you're missing X, and that's the key to this year" sentence + the gated teaser. The accuracy upgrade is hygiene; the copy is the growth lever. If a tradeoff arises, protect the hook/CTA behavior over chart completeness.
- **紫微 (Zi Wei) is intentionally NOT a free feature here** — per the growth decision, it stays a paid differentiator advertised on `/book`, not computed on the free page.
