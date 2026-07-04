'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getReading, type ReadingResult } from '../../../lib/reading';
import { track } from '../../../lib/analytics';
import { Blur, DeepBlur, PaywallOverlay, useRevealed } from '../../../components/Blur';
import { deriveFakeReading, localizeReading, type ReadingData, type LocalizedReadingData } from '../../../lib/reading-data';
import { ContactModal } from '../../../components/ContactModal';

export default function FreeReadingPage() {
  const t = useTranslations('FreeReading');
  const locale = useLocale() as 'en' | 'zh';
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [year, setYear] = useState(searchParams.get('y') || '');
  const [month, setMonth] = useState(searchParams.get('m') || '');
  const [day, setDay] = useState(searchParams.get('d') || '');
  const [timeIndex, setTimeIndex] = useState(searchParams.get('t') || '6');
  const [gender, setGender] = useState<'male' | 'female'>((searchParams.get('g') as 'male' | 'female') || 'female');
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [realReading, setRealReading] = useState<ReadingData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const revealed = useRevealed();

  useEffect(() => {
    if (!searchParams.get('y')) return;
    const y = searchParams.get('y')!;
    const m = searchParams.get('m')!;
    const d = searchParams.get('d')!;
    const ti = searchParams.get('t') || '6';
    const g = (searchParams.get('g') as 'male' | 'female') || 'female';
    setYear(y); setMonth(m); setDay(d); setTimeIndex(ti); setGender(g);
    getReading({ year: Number(y), month: Number(m), day: Number(d), timeIndex: Number(ti), gender: g, locale })
      .then(r => setResult(r))
      .catch(() => {});
  }, [locale, searchParams]);

  useEffect(() => {
    if (!revealed || !result || !year || !month || !day) return;
    const pad = (n: number) => String(n).padStart(2, '0');
    const key = `${year}-${pad(Number(month))}-${pad(Number(day))}-${gender[0]}-${timeIndex}`;
    fetch(`/readings/${key}.json`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.reading) setRealReading(data.reading); })
      .catch(() => {});
  }, [revealed, result, year, month, day, gender, timeIndex]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!year || !month || !day) return;
    if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) {
      setError(t('dateError'));
      return;
    }
    setLoading(true);
    try {
      const r = await getReading({
        year: Number(year), month: Number(month), day: Number(day),
        timeIndex: Number(timeIndex), gender, locale,
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResult(r);
      const params = new URLSearchParams(searchParams.toString());
      params.set('y', year); params.set('m', month); params.set('d', day);
      params.set('t', timeIndex); params.set('g', gender);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      track('reading_completed', { gender, timeIndex: Number(timeIndex) });
    } catch {
      setError(t('dateError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="max-w-xl w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
            </div>
            <p className="text-text-primary text-lg font-light mb-2">
              {locale === 'zh' ? '正在推算命盘...' : 'Calculating your chart...'}
            </p>
            <p className="text-text-secondary text-sm">
              {locale === 'zh' ? '结合八字与五行，为你生成专属解读' : 'Analyzing your BaZi and Five Elements'}
            </p>
          </div>
        ) : !result ? (
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
              {(() => {
                const readingData = realReading ? localizeReading(realReading, locale) : deriveFakeReading(result, locale, Number(month));
                const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
                return (
              <div className="space-y-6 p-5 bg-bg-secondary border border-white/5">

                {/* 1. 命格总评 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '命格总评' : 'Destiny Overview'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '基于日主强弱与格局，解读你的先天命格特征' : 'Interpretation of your innate destiny based on Day Master strength & chart structure'}</p>
                  <Blur>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {readingData.overview.keywords.map((kw) => (
                        <span key={kw} className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded">{kw}</span>
                      ))}
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed hyphens-auto text-justify">{readingData.overview.body}</p>
                  </Blur>
                  {readingData.overview.detailed && (
                    <DeepBlur>
                      <p className="text-sm text-text-primary leading-relaxed mt-3 pt-3 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.overview.detailed}</p>
                    </DeepBlur>
                  )}
                </div>

                {/* 2. 十年大运 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '十年大运' : 'Decade Forecast'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '每十年一步大运，揭示人生各阶段的运势起伏' : 'Each decade brings a major luck shift — see the arc of your life phases'}</p>
                  <div className="space-y-2">
                    {readingData.decades.map((d) => (
                      <div key={d.label} className="flex items-center gap-3">
                        <span className="text-xs text-text-primary w-16 shrink-0">{d.label}</span>
                        <Blur className="flex-1">
                          <div className="flex justify-between text-xs text-text-secondary mb-0.5">
                            <span>{d.theme}</span>
                          </div>
                          <div className="h-2 bg-accent/20 rounded-full">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${d.score}%` }} />
                          </div>
                          {d.detailed && (
                            <DeepBlur>
                              <p className="text-xs text-text-secondary mt-1 whitespace-pre-line hyphens-auto text-justify">{d.detailed}</p>
                            </DeepBlur>
                          )}
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
                        <p className="text-sm text-text-primary">{readingData.annual.firstHalf}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary mb-1">{locale === 'zh' ? '下半年' : 'Second Half'}</p>
                        <p className="text-sm text-text-primary">{readingData.annual.secondHalf}</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white/5 rounded text-center">
                      <p className="text-xs text-text-secondary">{locale === 'zh' ? '关键月份' : 'Key Months'}</p>
                      <p className="text-sm text-accent">{readingData.annual.keyMonths.join(' · ')}</p>
                    </div>
                    {readingData.annual.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.annual.detailed}</p>
                      </DeepBlur>
                    )}
                  </Blur>
                </div>

                {/* Inline CTA — hidden when revealed */}
                <PaywallOverlay>
                  <div className="my-2 p-4 bg-accent/5 border border-accent/20 rounded-lg text-center">
                    <p className="text-sm text-text-primary mb-1">
                      {locale === 'zh'
                        ? `你的五行${result.missing.length > 0 ? '缺' + result.missing.map(m => m.split(/[( （]/)[0].trim()).join('、') : '偏' + result.strongest}，对事业和感情意味着什么？`
                        : `Your ${result.missing.length > 0 ? 'missing ' + result.missing.map(m => m.split(/[( （]/)[0].trim()).join(' & ') : 'dominant ' + result.strongest} — what does it mean for career & love?`}
                    </p>
                    <p className="text-xs text-text-secondary mb-3">
                      {locale === 'zh' ? '完整解读包含事业方位、桃花月份、健康提醒等8个维度' : 'Full reading covers career direction, romance timing, health alerts & 5 more dimensions'}
                    </p>
                    <button
                      onClick={() => { track('reading_inline_cta_click'); setModalOpen(true); }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {locale === 'zh' ? '免费获取我的命盘解读' : 'Get my free reading'}
                    </button>
                  </div>
                </PaywallOverlay>

                {/* 4. 事业与财运 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '事业与财运' : 'Career & Wealth'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '事业方向、最佳行动月份、财运评级与旺财方位' : 'Career direction, best action months, wealth rating & prosperous directions'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '事业评分' : 'Career'}</p>
                        <p className="text-sm text-text-primary">{stars(readingData.career.rating)}</p>
                        <p className="text-xs text-text-secondary mt-1">{readingData.career.advice}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '财运评分' : 'Wealth'}</p>
                        <p className="text-sm text-text-primary">{stars(readingData.wealth.rating)}</p>
                        <p className="text-xs text-text-secondary mt-1">{readingData.wealth.mode}</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-white/5 rounded text-center">
                      <p className="text-xs text-text-secondary">{locale === 'zh' ? '最佳方位 · 旺财月份' : 'Best Direction · Wealth Months'}</p>
                      <p className="text-xs text-text-primary">{readingData.career.direction} · {readingData.wealth.bestMonths.join(locale === 'zh' ? '、' : ', ')}</p>
                    </div>
                    {readingData.career.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.career.detailed}</p>
                      </DeepBlur>
                    )}
                    {readingData.wealth.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.wealth.detailed}</p>
                      </DeepBlur>
                    )}
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
                        <p className="text-sm text-text-primary">{stars(readingData.love.rating)}</p>
                        <p className="text-xs text-text-secondary mt-1">{locale === 'zh' ? '桃花月' : 'Romance months'}</p>
                        <p className="text-xs text-text-primary">{readingData.love.romanceMonths.join(locale === 'zh' ? '、' : ', ')}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '正缘特征' : 'Soulmate Traits'}</p>
                        <p className="text-sm text-text-primary">{readingData.love.soulmate}</p>
                        <p className="text-xs text-text-secondary mt-1">{locale === 'zh' ? '方位' : 'Direction'}</p>
                        <p className="text-xs text-text-primary">{readingData.love.direction}</p>
                      </div>
                    </div>
                    {readingData.love.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.love.detailed}</p>
                      </DeepBlur>
                    )}
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
                        <p className="text-xs text-text-primary mt-1">{readingData.health.areas.join(locale === 'zh' ? '、' : ', ')}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '易犯月份' : 'Months'}</p>
                        <p className="text-xs text-text-primary mt-1">{readingData.health.vulnerableMonths.join(locale === 'zh' ? '、' : ', ')}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '调理方向' : 'Remedy'}</p>
                        <p className="text-xs text-text-primary mt-1">{readingData.health.remedy}</p>
                      </div>
                    </div>
                    {readingData.health.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.health.detailed}</p>
                      </DeepBlur>
                    )}
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
                        <p className="text-sm text-text-primary">{readingData.allies.helpful.join(' · ')}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded text-center">
                        <p className="text-xs text-text-secondary">{locale === 'zh' ? '小人生肖' : 'Rival Signs'}</p>
                        <p className="text-sm text-text-primary">{readingData.allies.harmful.join(' · ')}</p>
                      </div>
                    </div>
                    {readingData.allies.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.allies.detailed}</p>
                      </DeepBlur>
                    )}
                  </Blur>
                </div>

                {/* 8. 重大决策时机 */}
                <div>
                  <p className="text-sm font-medium text-accent mb-1">{locale === 'zh' ? '重大决策时机' : 'Decision Timing'}</p>
                  <p className="text-xs text-text-secondary mb-2">{locale === 'zh' ? '跳槽、签约、搬家、表白——每件大事的最佳月份' : 'Job change, signing deals, moving, confessing — the best month for each'}</p>
                  <Blur>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(readingData.timing).filter(([k]) => k !== 'detailed').map(([action, m]) => (
                        <div key={action} className="p-2 bg-white/5 rounded flex justify-between text-xs">
                          <span className="text-text-secondary">{action}</span>
                          <span className="text-accent">{m}</span>
                        </div>
                      ))}
                    </div>
                    {readingData.timing.detailed && (
                      <DeepBlur>
                        <p className="text-xs text-text-primary leading-relaxed mt-2 pt-2 border-t border-white/5 whitespace-pre-line hyphens-auto text-justify">{readingData.timing.detailed}</p>
                      </DeepBlur>
                    )}
                  </Blur>
                </div>

              </div>
                );
              })()}
            </div>
            <div className="text-center">
              <button
                onClick={() => { setResult(null); setYear(''); setMonth(''); setDay(''); router.replace(pathname, { scroll: false }); }}
                className="block mx-auto mt-4 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {t('tryAgain')}
              </button>
            </div>
            {/* Contact Modal */}
            <ContactModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
            />

            {/* Sticky bottom CTA — hidden when revealed or modal open */}
            <PaywallOverlay>
              <div className={`fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent transition-opacity duration-200 ${modalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="max-w-xl mx-auto">
                  <button
                    onClick={() => { track('reading_cta_click'); setModalOpen(true); }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {locale === 'zh' ? '免费获取我的命盘解读' : 'Get my free reading'}
                  </button>
                </div>
              </div>
            </PaywallOverlay>
          </div>
        )}
      </div>
    </main>
  );
}
