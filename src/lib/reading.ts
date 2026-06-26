import type { astro } from 'iztro';
import {
  STEM_ELEMENTS, BRANCH_ELEMENTS, HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEMS_EN, BRANCHES_EN, ZODIAC_EN, ZODIAC_ZH,
  NAYIN_ZH, NAYIN_EN, NAYIN_ELEMENT_ZH, NAYIN_ELEMENT_EN,
  TRAITS_EN, TRAITS_ZH, MISSING_EN, MISSING_ZH, ELEMENT_LABELS_ZH,
  getStemBranch, type BaziResult, type Pillar, type ElementBalance,
} from './bazi';

export interface ReadingInput {
  year: number;
  month: number;
  day: number;
  timeIndex: number;        // 0–11, iztro 时辰 index (子=0 … 亥=11)
  gender: 'male' | 'female';
  locale: 'en' | 'zh';
}

export interface ReadingResult extends BaziResult {
  hourPillar: Pillar;       // new — now that we collect birth time
}

interface PillarIdx {
  s: number;
  b: number;
}

// iztro's four pillars live at astrolabe.rawDates.chineseDate.{yearly|monthly|daily|hourly}.
// Each is a tuple of Chinese-character strings: [heavenlyStem, earthlyBranch].
// Map the stem/branch strings back to numeric indices via the bazi.ts tables.
function pillarIndices(astrolabe: ReturnType<typeof astro.bySolar>) {
  const cd = (astrolabe as unknown as {
    rawDates: {
      chineseDate: {
        yearly: [string, string];
        monthly: [string, string];
        daily: [string, string];
        hourly: [string, string];
      };
    };
  }).rawDates.chineseDate;

  const toIdx = ([stem, branch]: [string, string]): PillarIdx => ({
    s: (HEAVENLY_STEMS as readonly string[]).indexOf(stem),
    b: (EARTHLY_BRANCHES as readonly string[]).indexOf(branch),
  });

  return {
    year: toIdx(cd.yearly),
    month: toIdx(cd.monthly),
    day: toIdx(cd.daily),
    hour: toIdx(cd.hourly),
  };
}

function toPillar(s: number, b: number, locale: 'en' | 'zh'): Pillar {
  return {
    stem: locale === 'zh' ? HEAVENLY_STEMS[s] : STEMS_EN[s],
    branch: locale === 'zh' ? EARTHLY_BRANCHES[b] : BRANCHES_EN[b],
    full: getStemBranch(s, b, locale),
  };
}

// Sexagenary (0..59) index from a stem (mod 10) + branch (mod 12) pair.
function sexagenaryIndex(stemIdx: number, branchIdx: number): number {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIdx && i % 12 === branchIdx) return i;
  }
  return 0;
}

export async function getReading(input: ReadingInput): Promise<ReadingResult> {
  const { year, month, day, timeIndex, gender, locale } = input;
  const solar = `${year}-${month}-${day}`;
  const genderZh = gender === 'male' ? '男' : '女';
  // Lazily load iztro so it stays out of the route's first-load bundle.
  const { astro } = await import('iztro');
  // Always request 'zh-CN' so stem/branch strings match the bazi.ts tables.
  const astrolabe = astro.bySolar(solar, timeIndex, genderZh, true, 'zh-CN');
  const p = pillarIndices(astrolabe);

  const yearPillar = toPillar(p.year.s, p.year.b, locale);
  const monthPillar = toPillar(p.month.s, p.month.b, locale);
  const dayPillar = toPillar(p.day.s, p.day.b, locale);
  const hourPillar = toPillar(p.hour.s, p.hour.b, locale);

  const dayJiazi = sexagenaryIndex(p.day.s, p.day.b);

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
