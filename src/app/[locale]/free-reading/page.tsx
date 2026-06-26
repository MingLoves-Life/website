'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { getReading, type ReadingResult } from '../../../lib/reading';
import { track } from '../../../lib/analytics';
import { Blur, PaywallOverlay } from '../../../components/Blur';

export default function FreeReadingPage() {
  const t = useTranslations('FreeReading');
  const locale = useLocale() as 'en' | 'zh';
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [timeIndex, setTimeIndex] = useState('6'); // default 午时 (midday) for "unknown"
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!year || !month || !day) return;
    if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) {
      setError(t('dateError'));
      return;
    }
    try {
      const r = await getReading({
        year: Number(year), month: Number(month), day: Number(day),
        timeIndex: Number(timeIndex), gender, locale,
      });
      setResult(r);
      track('reading_completed', { gender, timeIndex: Number(timeIndex) });
    } catch {
      setError(t('dateError'));
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="max-w-lg w-full">
        {!result ? (
          <>
            <h1 className="text-3xl md:text-5xl font-light mb-4 text-center">{t('title')}</h1>
            <p className="text-text-secondary text-center mb-12">{t('subtitle')}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2">{t('label')}</label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder={locale === 'zh' ? '年' : 'Year'}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="1900"
                    max="2026"
                    required
                    className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent/50 text-center"
                  />
                  <input
                    type="number"
                    placeholder={locale === 'zh' ? '月' : 'Month'}
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    min="1"
                    max="12"
                    required
                    className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent/50 text-center"
                  />
                  <input
                    type="number"
                    placeholder={locale === 'zh' ? '日' : 'Day'}
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    min="1"
                    max="31"
                    required
                    className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent/50 text-center"
                  />
                </div>
              </div>
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
                  <option value="6">{t('hourUnknownDay')}</option>
                  <option value="0">{t('hourUnknownNight')}</option>
                  {(t.raw('hours') as string[]).map((h, i) => (
                    <option key={i} value={i}>{h}</option>
                  ))}
                </select>
              </div>
              {error && (
                <p className="text-sm text-accent-red text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                {t('submit')}
              </button>
            </form>
          </>
        ) : (
          <div>
            <h2 className="text-2xl md:text-4xl font-light mb-8 text-center">{t('resultTitle')}</h2>

            {/* Four Pillars */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              <div className="text-center p-3 bg-bg-secondary rounded-lg border border-white/5">
                <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '年柱' : 'Year'}</p>
                <p className="text-lg text-accent font-medium">{result.yearPillar.full}</p>
              </div>
              <div className="text-center p-3 bg-bg-secondary rounded-lg border border-white/5">
                <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '月柱' : 'Month'}</p>
                <p className="text-lg text-accent font-medium">{result.monthPillar.full}</p>
              </div>
              <div className="text-center p-3 bg-bg-secondary rounded-lg border border-white/5">
                <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '日柱' : 'Day'}</p>
                <p className="text-lg text-accent font-medium">{result.dayPillar.full}</p>
              </div>
              <div className="text-center p-3 bg-bg-secondary rounded-lg border border-white/5">
                <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '时柱' : 'Hour'}</p>
                <p className="text-lg text-accent font-medium">{result.hourPillar.full}</p>
              </div>
            </div>

            {/* Zodiac & Nayin */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-4 bg-bg-secondary rounded-lg border border-white/5 text-center">
                <p className="text-xs text-text-secondary mb-1">{locale === 'zh' ? '生肖' : 'Zodiac'}</p>
                <p className="text-text-primary font-medium">{result.zodiac}</p>
              </div>
              <div className="p-4 bg-bg-secondary rounded-lg border border-white/5 text-center">
                <p className="text-xs text-text-secondary mb-1">{locale === 'zh' ? '纳音' : 'Nayin'}</p>
                <p className="text-text-primary font-medium">{result.nayin}</p>
              </div>
            </div>

            {/* Element Balance */}
            <div className="mb-8 p-5 bg-bg-secondary rounded-lg border border-white/5">
              <p className="text-xs text-text-secondary mb-3">{locale === 'zh' ? '五行分布' : 'Element Balance'}</p>
              <div className="flex justify-between gap-2">
                {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map((el) => {
                  const label = locale === 'zh'
                    ? { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }[el]
                    : el.charAt(0).toUpperCase() + el.slice(1);
                  const count = result.balance[el];
                  return (
                    <div key={el} className="flex-1 text-center">
                      <div className="text-sm text-text-primary mb-1">{label}</div>
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-4 rounded-sm ${i < count ? 'bg-accent' : 'bg-white/10'}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing elements */}
            {result.missing.length > 0 && (
              <div className="mb-8 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg">
                <p className="text-sm text-text-secondary">
                  {locale === 'zh' ? '五行缺：' : 'Missing elements: '}
                  <span className="text-text-primary">{result.missing.join(locale === 'zh' ? '、' : ', ')}</span>
                </p>
              </div>
            )}

            {/* Personalized hook */}
            <p className="text-text-secondary leading-relaxed mb-10 text-center">
              {result.missing.length > 0
                ? t('hook', { element: result.strongest, missing: result.missing.map(m => m.split(/ \(|（/)[0].trim()).join(locale === 'zh' ? '、' : ' & ') })
                : t('hookComplete')}
            </p>

            {/* Blurred paywall preview */}
            <div className="relative mb-8 overflow-hidden rounded-lg">
              <div className="space-y-6 p-5 bg-bg-secondary border border-white/5">

                {/* 1. 命格总评 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '命格总评' : 'Destiny Overview'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '基于日主强弱与格局，解读你的先天命格特征' : 'Interpretation of your innate destiny based on Day Master strength & chart structure'}</p>
                  <Blur>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {locale === 'zh'
                        ? '日主丙火生于酉月，火势受金克制，喜木来生扶。命局偏财格，性格果断但需防冲动决策。整体格局中上，中年后运势渐入佳境，宜把握贵人相助之机。'
                        : 'Day Master Bing Fire born in the Month of You. Fire is restrained by Metal, Wood support is favorable. Partial Wealth structure indicates decisiveness but beware impulsive choices. Overall destiny ranks above average with improving fortune after mid-life.'}
                    </p>
                  </Blur>
                </div>

                {/* 2. 十年大运 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '十年大运' : 'Decade Forecast'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '每十年一步大运，揭示人生各阶段的运势起伏' : 'Each decade brings a major luck shift — see the arc of your life phases'}</p>
                  <div className="space-y-2">
                    {(locale === 'zh'
                      ? [['第一步运', '蛰伏蓄力期', 45], ['第二步运', '贵人助力期', 78], ['第三步运', '事业巅峰期', 92], ['第四步运', '收获稳定期', 70]]
                      : [['Phase 1', 'Building foundation', 45], ['Phase 2', 'Mentor support period', 78], ['Phase 3', 'Career peak', 92], ['Phase 4', 'Harvest & stability', 70]]
                    ).map(([label, desc, pct]) => (
                      <div key={label as string} className="flex items-center gap-3">
                        <span className="text-xs text-text-primary w-16 shrink-0">{label}</span>
                        <Blur className="flex-1">
                          <div className="flex justify-between text-xs text-text-secondary mb-0.5">
                            <span>{desc}</span>
                          </div>
                          <div className="h-2 bg-accent/20 rounded-full">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </Blur>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. 流年运势 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '流年运势' : 'Annual Fortune'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '今年上下半年运势走向与关键转折月份' : 'This year\'s fortune trajectory and pivotal months'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary mb-1">{locale === 'zh' ? '上半年' : 'First Half'}</p>
                        <p className="text-sm text-text-primary">{locale === 'zh' ? '运势上扬，三月有突破机遇' : 'Rising momentum, breakthrough in March'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary mb-1">{locale === 'zh' ? '下半年' : 'Second Half'}</p>
                        <p className="text-sm text-text-primary">{locale === 'zh' ? '稳中有进，九月贵人显现' : 'Steady growth, mentor appears in September'}</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white/5 rounded text-center">
                      <p className="text-xs text-text-secondary">{locale === 'zh' ? '关键月份' : 'Key Months'}</p>
                      <p className="text-sm text-accent">{locale === 'zh' ? '三月 · 六月 · 九月' : 'March · June · September'}</p>
                    </div>
                  </Blur>
                </div>

                {/* 4. 事业与财运 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '事业与财运' : 'Career & Wealth'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '事业方向、最佳行动月份、财运评级与旺财方位' : 'Career direction, best action months, wealth rating & prosperous directions'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '事业评分' : 'Career'}</p>
                        <p className="text-sm text-text-primary">★★★★☆</p>
                        <p className="text-xs text-text-secondary mt-1">{locale === 'zh' ? '适合求变，不宜守旧' : 'Embrace change, avoid stagnation'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '财运评分' : 'Wealth'}</p>
                        <p className="text-sm text-text-primary">★★★★★</p>
                        <p className="text-xs text-text-secondary mt-1">{locale === 'zh' ? '偏财旺，投资运佳' : 'Windfall luck strong, invest wisely'}</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white/5 rounded text-center">
                      <p className="text-xs text-text-secondary">{locale === 'zh' ? '最佳方位 · 旺财月份' : 'Best Direction · Wealth Months'}</p>
                      <p className="text-xs text-text-primary">{locale === 'zh' ? '东南 · 三月、八月' : 'Southeast · Mar, Aug'}</p>
                    </div>
                  </Blur>
                </div>

                {/* 5. 姻缘与桃花 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '姻缘与桃花' : 'Love & Romance'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '桃花旺月、正缘特征、感情方位与最佳表白时机' : 'Romance peaks, soulmate traits, love direction & best timing to confess'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '桃花指数' : 'Romance Index'}</p>
                        <p className="text-sm text-text-primary">★★★★☆</p>
                        <p className="text-xs text-text-secondary mt-1">{locale === 'zh' ? '桃花月' : 'Romance months'}</p>
                        <p className="text-xs text-text-primary">{locale === 'zh' ? '四月、七月' : 'Apr, Jul'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '正缘特征' : 'Soulmate Traits'}</p>
                        <p className="text-sm text-text-primary">{locale === 'zh' ? '年长 · 属兔' : 'Older · Rabbit sign'}</p>
                        <p className="text-xs text-text-secondary mt-1">{locale === 'zh' ? '方位' : 'Direction'}</p>
                        <p className="text-xs text-text-primary">{locale === 'zh' ? '正北方' : 'North'}</p>
                      </div>
                    </div>
                  </Blur>
                </div>

                {/* 6. 健康注意 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '健康注意' : 'Health Alerts'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '根据五行偏缺提示易发问题与调理方向' : 'Health vulnerabilities based on elemental imbalance & seasonal advice'}</p>
                  <Blur>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '注意部位' : 'Watch'}</p>
                        <p className="text-xs text-text-primary mt-1">{locale === 'zh' ? '心血管' : 'Heart'}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '易犯月份' : 'Months'}</p>
                        <p className="text-xs text-text-primary mt-1">{locale === 'zh' ? '五月、十一月' : 'May, Nov'}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '调理方向' : 'Remedy'}</p>
                        <p className="text-xs text-text-primary mt-1">{locale === 'zh' ? '养脾胃' : 'Digestion'}</p>
                      </div>
                    </div>
                  </Blur>
                </div>

                {/* 7. 贵人与小人 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '贵人与小人' : 'Allies & Rivals'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '命中相助与相克的生肖，助你识人避险' : 'Zodiac signs that help or hinder you — know who to trust'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '贵人生肖' : 'Ally Signs'}</p>
                        <p className="text-sm text-text-primary">{locale === 'zh' ? '属牛 · 属蛇' : 'Ox · Snake'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '小人生肖' : 'Rival Signs'}</p>
                        <p className="text-sm text-text-primary">{locale === 'zh' ? '属鼠 · 属马' : 'Rat · Horse'}</p>
                      </div>
                    </div>
                  </Blur>
                </div>

                {/* 8. 重大决策时机 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '重大决策时机' : 'Decision Timing'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '跳槽、签约、搬家、表白——每件大事的最佳月份' : 'Job change, signing deals, moving, confessing — the best month for each'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-2">
                      {(locale === 'zh'
                        ? [['跳槽', '三月'], ['签约', '六月'], ['搬家', '八月'], ['表白', '四月']]
                        : [['Job change', 'March'], ['Signing deals', 'June'], ['Moving', 'August'], ['Confessing love', 'April']]
                      ).map(([action, month]) => (
                        <div key={action} className="p-2 bg-white/5 rounded flex justify-between text-xs">
                          <span className="text-text-secondary">{action}</span>
                          <span className="text-accent">{month}</span>
                        </div>
                      ))}
                    </div>
                  </Blur>
                </div>

              </div>
              {/* Gradient fade & lock CTA — hidden when revealed */}
              <PaywallOverlay>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-12">
                  <Link
                    href={`/${locale}/book`}
                    onClick={() => track('reading_cta_click')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {t('cta')}
                  </Link>
                </div>
              </PaywallOverlay>
            </div>
            <div className="text-center">
              <button
                onClick={() => { setResult(null); setYear(''); setMonth(''); setDay(''); }}
                className="block mx-auto mt-4 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {t('tryAgain')}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
