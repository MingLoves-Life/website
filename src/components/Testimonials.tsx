'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';

export default function Testimonials() {
  const t = useTranslations('Testimonials');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const items = t.raw('items') as Array<{ name: string; rating: number; text: string }>;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cardsRef.current) return;

    const cards = cardsRef.current.children;
    gsap.fromTo(cards, { opacity: 0, x: -30 }, {
      opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    });
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light mb-16 md:mb-24 text-center">{t('title')}</h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="p-8 bg-bg-secondary rounded-lg border border-white/5 opacity-0">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <span key={j} className="text-accent">★</span>
                ))}
              </div>
              <p className="text-text-secondary leading-relaxed mb-6">&ldquo;{item.text}&rdquo;</p>
              <p className="text-sm text-text-primary font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
