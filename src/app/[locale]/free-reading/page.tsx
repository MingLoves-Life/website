'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { getReading, type ReadingResult } from '../../../lib/reading';
import { track } from '../../../lib/analytics';

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
                  <option value="6">{t('hourUnknown')}</option>
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
                ? t('hook', { element: result.strongest, missing: result.missing.map(m => m.split(' (')[0].trim()).join(locale === 'zh' ? '、' : ' & ') })
                : t('hookComplete')}
            </p>

            {/* CTA */}
            <div className="p-6 bg-bg-secondary rounded-lg border border-accent/20 mb-8 text-center">
              <p className="text-text-secondary text-sm">{t('teaser')}</p>
            </div>
            <div className="text-center">
              <Link
                href={`/${locale}/book`}
                onClick={() => track('reading_cta_click')}
                className="inline-block px-8 py-3 bg-accent text-bg-primary font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                {t('cta')}
              </Link>
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
