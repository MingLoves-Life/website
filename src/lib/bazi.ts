export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export const STEMS_EN = ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'] as const;
export const BRANCHES_EN = ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'] as const;

export const STEM_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'] as const;
export const BRANCH_ELEMENTS = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'] as const;

export const ZODIAC_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'] as const;
export const ZODIAC_ZH = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const;

export const NAYIN_ZH = [
  '海中金', '海中金', '炉中火', '炉中火', '大林木', '大林木',
  '路旁土', '路旁土', '剑锋金', '剑锋金', '山头火', '山头火',
  '涧下水', '涧下水', '城头土', '城头土', '白蜡金', '白蜡金',
  '杨柳木', '杨柳木', '泉中水', '泉中水', '屋上土', '屋上土',
  '霹雳火', '霹雳火', '松柏木', '松柏木', '长流水', '长流水',
  '砂石金', '砂石金', '山下火', '山下火', '平地木', '平地木',
  '壁上土', '壁上土', '金箔金', '金箔金', '覆灯火', '覆灯火',
  '天河水', '天河水', '大驿土', '大驿土', '钗钏金', '钗钏金',
  '桑柘木', '桑柘木', '大溪水', '大溪水', '沙中土', '沙中土',
  '天上火', '天上火', '石榴木', '石榴木', '大海水', '大海水',
] as const;

export const NAYIN_EN = [
  'Gold in the Sea', 'Gold in the Sea', 'Fire in the Furnace', 'Fire in the Furnace', 'Wood of the Forest', 'Wood of the Forest',
  'Earth by the Road', 'Earth by the Road', 'Metal of the Sword', 'Metal of the Sword', 'Fire on the Mountain', 'Fire on the Mountain',
  'Water in the Stream', 'Water in the Stream', 'Earth of the City Wall', 'Earth of the City Wall', 'White Wax Metal', 'White Wax Metal',
  'Willow Wood', 'Willow Wood', 'Water of the Spring', 'Water of the Spring', 'Earth on the Roof', 'Earth on the Roof',
  'Thunderbolt Fire', 'Thunderbolt Fire', 'Pine & Cypress Wood', 'Pine & Cypress Wood', 'Water of the Long River', 'Water of the Long River',
  'Metal in the Sand', 'Metal in the Sand', 'Fire at the Foot of the Mountain', 'Fire at the Foot of the Mountain', 'Wood of the Plains', 'Wood of the Plains',
  'Earth on the Wall', 'Earth on the Wall', 'Gold Foil Metal', 'Gold Foil Metal', 'Lamp Fire', 'Lamp Fire',
  'Water of the Milky Way', 'Water of the Milky Way', 'Earth of the Great Road', 'Earth of the Great Road', 'Hairpin Metal', 'Hairpin Metal',
  'Mulberry Wood', 'Mulberry Wood', 'Water of the Great Stream', 'Water of the Great Stream', 'Earth in the Sand', 'Earth in the Sand',
  'Fire in the Sky', 'Fire in the Sky', 'Pomegranate Wood', 'Pomegranate Wood', 'Water of the Great Sea', 'Water of the Great Sea',
] as const;

export const NAYIN_ELEMENT_ZH = ['金', '金', '火', '火', '木', '木', '土', '土', '金', '金', '火', '火', '水', '水', '土', '土', '金', '金', '木', '木', '水', '水', '土', '土', '火', '火', '木', '木', '水', '水', '金', '金', '火', '火', '木', '木', '土', '土', '金', '金', '火', '火', '水', '水', '土', '土', '金', '金', '木', '木', '水', '水', '土', '土', '火', '火', '木', '木', '水', '水'] as const;
export const NAYIN_ELEMENT_EN = ['Metal', 'Metal', 'Fire', 'Fire', 'Wood', 'Wood', 'Earth', 'Earth', 'Metal', 'Metal', 'Fire', 'Fire', 'Water', 'Water', 'Earth', 'Earth', 'Metal', 'Metal', 'Wood', 'Wood', 'Water', 'Water', 'Earth', 'Earth', 'Fire', 'Fire', 'Wood', 'Wood', 'Water', 'Water', 'Metal', 'Metal', 'Fire', 'Fire', 'Wood', 'Wood', 'Earth', 'Earth', 'Metal', 'Metal', 'Fire', 'Fire', 'Water', 'Water', 'Earth', 'Earth', 'Metal', 'Metal', 'Wood', 'Wood', 'Water', 'Water', 'Earth', 'Earth', 'Fire', 'Fire', 'Wood', 'Wood', 'Water', 'Water'] as const;

// 月柱天干推算：根据年干确定正月天干起点
const MONTH_STEM_START = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0] as const; // 甲己年起丙寅，乙庚年起戊寅...

export function getStemBranch(stemIdx: number, branchIdx: number, locale: 'en' | 'zh') {
  if (locale === 'zh') return `${HEAVENLY_STEMS[stemIdx]}${EARTHLY_BRANCHES[branchIdx]}`;
  return `${STEMS_EN[stemIdx]} ${BRANCHES_EN[branchIdx]}`;
}

function getDiffDays(year: number, month: number, day: number): number {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  return Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
}

function getYearPillar(year: number) {
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;
  return { stemIdx, branchIdx, jiazi: ((year - 4) % 60 + 60) % 60 };
}

function getMonthPillar(yearStemIdx: number, month: number) {
  const startStem = MONTH_STEM_START[yearStemIdx];
  const stemIdx = (startStem + month - 1) % 10;
  const branchIdx = (month + 1) % 12; // 正月=寅(index 2)
  return { stemIdx, branchIdx };
}

function getDayPillar(year: number, month: number, day: number) {
  const diffDays = getDiffDays(year, month, day);
  // 1900-01-01 is 甲子日 (index 0 for both)
  const stemIdx = ((diffDays % 10) + 10) % 10;
  const branchIdx = ((diffDays % 12) + 12) % 12;
  const jiazi = ((diffDays % 60) + 60) % 60;
  return { stemIdx, branchIdx, jiazi };
}

export interface Pillar {
  stem: string;
  branch: string;
  full: string;
}

export interface ElementBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaziResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  zodiac: string;
  nayin: string;
  nayinElement: string;
  dayElement: string;
  balance: ElementBalance;
  missing: string[];
  strongest: string;
  trait: string;
}

const ELEMENT_LABELS_EN: Record<string, string> = { Wood: 'Wood', Fire: 'Fire', Earth: 'Earth', Metal: 'Metal', Water: 'Water' };
export const ELEMENT_LABELS_ZH: Record<string, string> = { Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' };

export const TRAITS_EN: Record<string, string> = {
  Wood: 'Your dominant element is Wood — you are creative, growth-oriented, and compassionate. You thrive on expansion and new beginnings, with a natural ability to inspire others.',
  Fire: 'Your dominant element is Fire — you are passionate, charismatic, and full of energy. You light up any room and have a natural gift for leadership and expression.',
  Earth: 'Your dominant element is Earth — you are grounded, reliable, and nurturing. People gravitate to your stability and practical wisdom in times of uncertainty.',
  Metal: 'Your dominant element is Metal — you are determined, disciplined, and precise. You have strong principles and an unwavering sense of purpose.',
  Water: 'Your dominant element is Water — you are intuitive, adaptive, and deeply wise. You navigate complexity with ease and see what others miss.',
};

export const TRAITS_ZH: Record<string, string> = {
  Wood: '你的主导五行为木——富有创造力，追求成长，心怀慈悲。你善于开拓新局面，天生具有感召他人的力量。',
  Fire: '你的主导五行为火——热情洋溢，魅力四射，精力充沛。你在任何场合都能成为焦点，天生具备领导力和表达天赋。',
  Earth: '你的主导五行为土——脚踏实地，值得信赖，善于关怀。在不确定的时刻，人们自然而然地向你寻求稳定与智慧。',
  Metal: '你的主导五行为金——意志坚定，纪律严明，追求精准。你有坚定的原则和不可动摇的目标感。',
  Water: '你的主导五行为水——直觉敏锐，适应力强，智慧深邃。你能轻松驾驭复杂局面，看到他人看不到的东西。',
};

export const MISSING_EN: Record<string, string> = {
  Wood: 'Wood (creativity, growth)',
  Fire: 'Fire (passion, action)',
  Earth: 'Earth (stability, trust)',
  Metal: 'Metal (discipline, clarity)',
  Water: 'Water (wisdom, adaptability)',
};

export const MISSING_ZH: Record<string, string> = {
  Wood: '木（创造力、成长）',
  Fire: '火（热情、行动力）',
  Earth: '土（稳定、信任）',
  Metal: '金（纪律、清晰）',
  Water: '水（智慧、适应力）',
};

export function getBasicReading(year: number, month: number, day: number, locale: 'en' | 'zh'): BaziResult {
  const yp = getYearPillar(year);
  const mp = getMonthPillar(yp.stemIdx, month);
  const dp = getDayPillar(year, month, day);

  const yearPillar: Pillar = {
    stem: locale === 'zh' ? HEAVENLY_STEMS[yp.stemIdx] : STEMS_EN[yp.stemIdx],
    branch: locale === 'zh' ? EARTHLY_BRANCHES[yp.branchIdx] : BRANCHES_EN[yp.branchIdx],
    full: getStemBranch(yp.stemIdx, yp.branchIdx, locale),
  };
  const monthPillar: Pillar = {
    stem: locale === 'zh' ? HEAVENLY_STEMS[mp.stemIdx] : STEMS_EN[mp.stemIdx],
    branch: locale === 'zh' ? EARTHLY_BRANCHES[mp.branchIdx] : BRANCHES_EN[mp.branchIdx],
    full: getStemBranch(mp.stemIdx, mp.branchIdx, locale),
  };
  const dayPillar: Pillar = {
    stem: locale === 'zh' ? HEAVENLY_STEMS[dp.stemIdx] : STEMS_EN[dp.stemIdx],
    branch: locale === 'zh' ? EARTHLY_BRANCHES[dp.branchIdx] : BRANCHES_EN[dp.branchIdx],
    full: getStemBranch(dp.stemIdx, dp.branchIdx, locale),
  };

  const zodiac = locale === 'zh' ? ZODIAC_ZH[yp.branchIdx] : ZODIAC_EN[yp.branchIdx];
  const nayin = locale === 'zh' ? NAYIN_ZH[dp.jiazi] : NAYIN_EN[dp.jiazi];
  const nayinElement = locale === 'zh' ? NAYIN_ELEMENT_ZH[dp.jiazi] : NAYIN_ELEMENT_EN[dp.jiazi];
  const dayElement = STEM_ELEMENTS[dp.stemIdx];

  // Calculate element balance from all 6 stem/branch positions
  const allElements = [
    STEM_ELEMENTS[yp.stemIdx], BRANCH_ELEMENTS[yp.branchIdx],
    STEM_ELEMENTS[mp.stemIdx], BRANCH_ELEMENTS[mp.branchIdx],
    STEM_ELEMENTS[dp.stemIdx], BRANCH_ELEMENTS[dp.branchIdx],
  ];

  const balance: ElementBalance = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const el of allElements) {
    balance[el.toLowerCase() as keyof ElementBalance]++;
  }

  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;
  const missing = elements.filter(e => balance[e.toLowerCase() as keyof ElementBalance] === 0);
  const strongest = elements.reduce((a, b) =>
    balance[a.toLowerCase() as keyof ElementBalance] >= balance[b.toLowerCase() as keyof ElementBalance] ? a : b
  );

  const labels = locale === 'zh' ? MISSING_ZH : MISSING_EN;
  const missingLabels = missing.map(e => labels[e]);

  const trait = locale === 'zh' ? TRAITS_ZH[strongest] : TRAITS_EN[strongest];

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    zodiac,
    nayin,
    nayinElement,
    dayElement: locale === 'zh' ? ELEMENT_LABELS_ZH[dayElement] : dayElement,
    balance,
    missing: missingLabels,
    strongest: locale === 'zh' ? ELEMENT_LABELS_ZH[strongest] : strongest,
    trait,
  };
}
