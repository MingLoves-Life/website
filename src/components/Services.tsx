'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '../lib/animations';

const serviceKeys = ['bazi', 'ziwei', 'fengshui', 'dateselection'] as const;

export default function Services() {
  const t = useTranslations('Services');
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
    <section ref={sectionRef} id="services" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light mb-16 md:mb-24 text-center">{t('title')}</h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceKeys.map((key) => (
            <div key={key} className="p-8 md:p-10 bg-bg-secondary rounded-lg border border-white/5 hover:border-accent/20 transition-colors opacity-0">
              <h3 className="text-xl md:text-2xl font-medium mb-3 text-text-primary">{t(`${key}.name`)}</h3>
              <p className="text-text-secondary leading-relaxed mb-6">{t(`${key}.description`)}</p>
              <Link href={`/${locale}/book`} className="text-accent text-sm hover:underline">{t('cta')} →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
