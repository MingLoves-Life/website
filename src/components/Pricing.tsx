'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '../lib/animations';

const plans = ['basic', 'detailed', 'private'] as const;

export default function Pricing() {
  const t = useTranslations('Pricing');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cardsRef.current) return;

    const cards = cardsRef.current.children;
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    });
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light mb-6 text-center">{t('title')}</h2>
        <p className="text-text-secondary text-center mb-16 md:mb-24 max-w-2xl mx-auto">{t('subtitle')}</p>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan}
              className={`p-8 md:p-10 rounded-lg border transition-colors opacity-0 flex flex-col ${
                plan === 'detailed'
                  ? 'bg-accent/5 border-accent/30'
                  : 'bg-bg-secondary border-white/5 hover:border-accent/20'
              }`}
            >
              {plan === 'detailed' && (
                <span className="text-xs text-accent font-medium uppercase tracking-wider mb-4">{t('popular')}</span>
              )}
              <h3 className="text-xl font-medium text-text-primary mb-2">{t(`${plan}.name`)}</h3>
              <p className="text-3xl font-light text-text-primary mb-4">{t(`${plan}.price`)}</p>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">{t(`${plan}.description`)}</p>
              <ul className="text-sm text-text-secondary space-y-2 mb-8">
                {(t.raw(`${plan}.features`) as string[]).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan === 'private' ? `/${locale}/links` : `/${locale}/book`}
                className={`block text-center py-3 px-6 rounded text-sm font-medium transition-colors ${
                  plan === 'detailed'
                    ? 'bg-accent text-bg-primary hover:bg-accent-hover'
                    : 'border border-accent/30 text-accent hover:bg-accent/10'
                }`}
              >
                {plan === 'private' ? t('ctaPrivate') : t('cta')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
