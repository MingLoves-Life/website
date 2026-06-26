import type { ReadingResult } from './reading';

export interface ReadingData {
  overview: { keywords: string[]; body: string };
  decades: { label: string; theme: string; score: number }[];
  annual: { firstHalf: string; secondHalf: string; keyMonths: string[]; rating: number };
  career: { rating: number; advice: string; direction: string; bestMonths: string[] };
  wealth: { rating: number; mode: string; advice: string; bestMonths: string[] };
  love: { rating: number; romanceMonths: string[]; soulmate: string; direction: string; advice: string };
  health: { areas: string[]; vulnerableMonths: string[]; remedy: string };
  allies: { helpful: string[]; harmful: string[] };
  timing: Record<string, string>;
}

const ZODIAC_LIST_ZH = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const ZODIAC_LIST_EN = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

const MONTHS_ZH = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DIRECTIONS_ZH = ['正北', '东北', '正东', '东南', '正南', '西南', '正西', '西北'];
const DIRECTIONS_EN = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];

const HEALTH_MAP_ZH: Record<string, string[]> = {
  Wood: ['肝胆', '筋骨'],
  Fire: ['心脏', '血液循环'],
  Earth: ['脾胃', '消化系统'],
  Metal: ['肺', '呼吸道'],
  Water: ['肾', '泌尿系统'],
};
const HEALTH_MAP_EN: Record<string, string[]> = {
  Wood: ['Liver', 'Joints'],
  Fire: ['Heart', 'Circulation'],
  Earth: ['Stomach', 'Digestion'],
  Metal: ['Lungs', 'Respiratory'],
  Water: ['Kidneys', 'Urinary'],
};

const REMEDY_ZH: Record<string, string> = {
  Wood: '养肝护胆，适当舒展筋骨',
  Fire: '养心安神，注意心血管保养',
  Earth: '健脾养胃，饮食规律',
  Metal: '润肺养肺，注意呼吸道保暖',
  Water: '补肾固本，注意水液代谢',
};
const REMEDY_EN: Record<string, string> = {
  Wood: 'Support liver health, stretch regularly',
  Fire: 'Nurture heart health, manage stress',
  Earth: 'Strengthen digestion, eat regularly',
  Metal: 'Protect lungs, keep warm in cold seasons',
  Water: 'Support kidney function, stay hydrated',
};

const KEYWORDS_ZH: Record<string, string[]> = {
  Wood: ['仁厚', '进取', '有韧性'],
  Fire: ['热情', '果断', '有感染力'],
  Earth: ['稳重', '包容', '务实'],
  Metal: ['果敢', '有原则', '执行力强'],
  Water: ['聪慧', '灵活', '善变通'],
};
const KEYWORDS_EN: Record<string, string[]> = {
  Wood: ['Compassionate', 'Driven', 'Resilient'],
  Fire: ['Passionate', 'Decisive', 'Charismatic'],
  Earth: ['Grounded', 'Nurturing', 'Practical'],
  Metal: ['Determined', 'Principled', 'Efficient'],
  Water: ['Intelligent', 'Adaptable', 'Resourceful'],
};

const OVERVIEW_ZH: Record<string, string> = {
  Wood: '日主属木，如春树向阳，天生有成长和向上的动力。格局偏向仁厚进取，善于把握机遇，但需注意不要过度扩张。',
  Fire: '日主属火，如烈焰腾空，天生热情且有领导力。格局偏向果断明快，行动力强，但需注意不要过于冲动。',
  Earth: '日主属土，如大地承载万物，天生稳重且有包容力。格局偏向厚积薄发，适合长期积累，但需注意不要过于保守。',
  Metal: '日主属金，如利刃出鞘，天生果敢且有魄力。格局偏向高效执行，适合需要决断力的领域，但需注意柔和处事。',
  Water: '日主属水，如流水变通，天生聪慧且善于应变。格局偏向灵活多变，善于发现机会，但需注意聚焦方向。',
};
const OVERVIEW_EN: Record<string, string> = {
  Wood: 'Your Day Master is Wood — like a tree reaching toward the sun, you have a natural drive to grow and advance. Your chart favors compassion and ambition, but watch for overextension.',
  Fire: 'Your Day Master is Fire — like a blazing flame, you radiate charisma and leadership. Your chart favors bold action and decisiveness, but watch for impulsiveness.',
  Earth: 'Your Day Master is Earth — like the ground that supports all things, you are naturally grounded and nurturing. Your chart favors steady accumulation, but watch for over-caution.',
  Metal: 'Your Day Master is Metal — like a sharpened blade, you are naturally decisive and principled. Your chart favors efficient execution, but remember to soften your approach.',
  Water: 'Your Day Master is Water — like a flowing river, you are naturally intelligent and adaptable. Your chart favors flexibility and opportunity-finding, but watch for lack of focus.',
};

const DECADE_THEMES_ZH = ['蛰伏蓄力期', '贵人助力期', '事业上升期', '巅峰收获期', '稳定守成期', '转型探索期'];
const DECADE_THEMES_EN = ['Building foundation', 'Mentor support period', 'Career ascent', 'Peak harvest', 'Stability & maintenance', 'Transformation phase'];

const CAREER_ADVICE_ZH: Record<string, string> = {
  Wood: '适合创业或教育类工作，发挥领导力',
  Fire: '适合公众型工作，发挥感染力与行动力',
  Earth: '适合管理或投资类，发挥稳健判断力',
  Metal: '适合技术或金融类，发挥精准执行力',
  Water: '适合策划或咨询类，发挥灵活应变力',
};
const CAREER_ADVICE_EN: Record<string, string> = {
  Wood: 'Suited for entrepreneurship or education — leverage your leadership',
  Fire: 'Suited for public-facing roles — leverage your charisma and drive',
  Earth: 'Suited for management or investment — leverage your steady judgment',
  Metal: 'Suited for tech or finance — leverage your precision and efficiency',
  Water: 'Suited for consulting or strategy — leverage your adaptability',
};

const LOVE_ADVICE_ZH: Record<string, string> = {
  Wood: '感情中主动且有担当，适合找互补型伴侣',
  Fire: '感情浓烈但需耐心经营，避免三分钟热度',
  Earth: '感情稳重专一，适合找有活力的伴侣互补',
  Metal: '感情中有原则但需学会表达柔软面',
  Water: '感情中善解人意，但需注意不要太犹豫',
};
const LOVE_ADVICE_EN: Record<string, string> = {
  Wood: 'Proactive in love — seek a complementary partner',
  Fire: 'Intense in love but needs patience — avoid burnout',
  Earth: 'Loyal and steady — seek a lively partner for balance',
  Metal: 'Principled in love — learn to show your soft side',
  Water: 'Empathetic in love — be careful not to overthink',
};

const SOULMATE_ZH = ['温柔内敛型', '热情开朗型', '稳重可靠型', '聪明机敏型', '果断独立型'];
const SOULMATE_EN = ['Gentle & reserved', 'Warm & outgoing', 'Steady & reliable', 'Smart & quick-witted', 'Decisive & independent'];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickMonths(birthMonth: number, count: number, locale: 'en' | 'zh'): string[] {
  const months = locale === 'zh' ? MONTHS_ZH : MONTHS_EN;
  const offsets = [2, 5, 8, 3, 7, 10];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(months[((birthMonth - 1) + offsets[i]) % 12]);
  }
  return result;
}

export function deriveFakeReading(result: ReadingResult, locale: 'en' | 'zh', birthMonth: number): ReadingData {
  const el = result.dayElement.replace(/[^\w]/g, '') || result.strongest;
  const strongest = result.strongest;
  const seed = hashCode(result.yearPillar.full + result.dayPillar.full);

  const zodiacList = locale === 'zh' ? ZODIAC_LIST_ZH : ZODIAC_LIST_EN;
  const zodiacIdx = ZODIAC_LIST_ZH.indexOf(result.zodiac) >= 0
    ? ZODIAC_LIST_ZH.indexOf(result.zodiac)
    : ZODIAC_LIST_EN.indexOf(result.zodiac);
  const allyIdx1 = (zodiacIdx + 4) % 12;
  const allyIdx2 = (zodiacIdx + 8) % 12;
  const rivalIdx1 = (zodiacIdx + 6) % 12;
  const rivalIdx2 = (zodiacIdx + 3) % 12;

  const balanceValues = Object.values(result.balance);
  const maxBal = Math.max(...balanceValues);
  const variance = balanceValues.reduce((sum, v) => sum + Math.abs(v - 1.6), 0);
  const baseRating = variance < 3 ? 4 : variance < 5 ? 3 : 2;

  const dirIdx = seed % 8;
  const directions = locale === 'zh' ? DIRECTIONS_ZH : DIRECTIONS_EN;

  const decadeThemes = locale === 'zh' ? DECADE_THEMES_ZH : DECADE_THEMES_EN;
  const decades = [0, 1, 2, 3].map((i) => ({
    label: locale === 'zh' ? `第${['一', '二', '三', '四'][i]}步运` : `Phase ${i + 1}`,
    theme: decadeThemes[(seed + i) % decadeThemes.length],
    score: 40 + ((seed * (i + 1)) % 50),
  }));

  const keyMonths = pickMonths(birthMonth, 3, locale);
  const careerMonths = pickMonths(birthMonth, 2, locale);
  const wealthMonths = [keyMonths[0], keyMonths[2]];
  const romanceMonths = pickMonths(birthMonth + 1, 2, locale);
  const healthMonths = pickMonths(birthMonth + 3, 2, locale);

  const missingEl = result.missing.length > 0
    ? result.missing[0].split(/[( （]/)[0].trim()
    : '';
  const healthKey = missingEl
    ? (['Wood', 'Fire', 'Earth', 'Metal', 'Water'].find(e =>
        missingEl.includes(e) || missingEl.includes({ Wood: '木', Fire: '火', Earth: '土', Metal: '金', Water: '水' }[e]!)
      ) || strongest)
    : strongest;

  const soulmateIdx = seed % SOULMATE_ZH.length;

  return {
    overview: {
      keywords: (locale === 'zh' ? KEYWORDS_ZH : KEYWORDS_EN)[strongest] || (locale === 'zh' ? KEYWORDS_ZH : KEYWORDS_EN).Earth,
      body: (locale === 'zh' ? OVERVIEW_ZH : OVERVIEW_EN)[strongest] || (locale === 'zh' ? OVERVIEW_ZH : OVERVIEW_EN).Earth,
    },
    decades,
    annual: {
      firstHalf: locale === 'zh'
        ? `运势${baseRating >= 4 ? '上扬' : '平稳'}，${keyMonths[0]}有${baseRating >= 4 ? '突破' : '调整'}机遇`
        : `Momentum ${baseRating >= 4 ? 'rising' : 'steady'}, ${keyMonths[0]} brings ${baseRating >= 4 ? 'breakthrough' : 'adjustment'}`,
      secondHalf: locale === 'zh'
        ? `${baseRating >= 3 ? '稳中有进' : '需耐心蛰伏'}，${keyMonths[2]}${baseRating >= 3 ? '贵人显现' : '注意守成'}`
        : `${baseRating >= 3 ? 'Steady progress' : 'Patience needed'}, ${keyMonths[2]} ${baseRating >= 3 ? 'mentor appears' : 'focus on stability'}`,
      keyMonths,
      rating: Math.min(5, baseRating + (maxBal >= 3 ? 1 : 0)),
    },
    career: {
      rating: Math.min(5, baseRating + (strongest === 'Fire' || strongest === 'Metal' ? 1 : 0)),
      advice: (locale === 'zh' ? CAREER_ADVICE_ZH : CAREER_ADVICE_EN)[strongest] || '',
      direction: directions[dirIdx],
      bestMonths: careerMonths,
    },
    wealth: {
      rating: Math.min(5, baseRating + (strongest === 'Earth' || strongest === 'Metal' ? 1 : 0)),
      mode: locale === 'zh'
        ? (strongest === 'Metal' || strongest === 'Earth' ? '正财稳健' : '偏财活跃')
        : (strongest === 'Metal' || strongest === 'Earth' ? 'Steady income' : 'Windfall potential'),
      advice: locale === 'zh'
        ? (strongest === 'Metal' || strongest === 'Earth' ? '适合稳健投资，长期积累' : '可适当冒险，把握偏财机遇')
        : (strongest === 'Metal' || strongest === 'Earth' ? 'Favor steady investments, long-term growth' : 'Take calculated risks, seize windfall chances'),
      bestMonths: wealthMonths,
    },
    love: {
      rating: Math.min(5, baseRating + (strongest === 'Fire' || strongest === 'Water' ? 1 : 0)),
      romanceMonths,
      soulmate: locale === 'zh' ? SOULMATE_ZH[soulmateIdx] : SOULMATE_EN[soulmateIdx],
      direction: directions[(dirIdx + 4) % 8],
      advice: (locale === 'zh' ? LOVE_ADVICE_ZH : LOVE_ADVICE_EN)[strongest] || '',
    },
    health: {
      areas: (locale === 'zh' ? HEALTH_MAP_ZH : HEALTH_MAP_EN)[healthKey] || (locale === 'zh' ? ['脾胃'] : ['Digestion']),
      vulnerableMonths: healthMonths,
      remedy: (locale === 'zh' ? REMEDY_ZH : REMEDY_EN)[healthKey] || '',
    },
    allies: {
      helpful: [zodiacList[allyIdx1], zodiacList[allyIdx2]],
      harmful: [zodiacList[rivalIdx1], zodiacList[rivalIdx2]],
    },
    timing: locale === 'zh'
      ? { '跳槽': keyMonths[0], '签约': keyMonths[1], '搬家': keyMonths[2], '表白': romanceMonths[0] }
      : { 'Job change': keyMonths[0], 'Signing deals': keyMonths[1], 'Moving': keyMonths[2], 'Confessing love': romanceMonths[0] },
  };
}
