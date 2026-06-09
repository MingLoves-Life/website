'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '../lib/animations';

export default function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline();
    if (titleRef.current) {
      tl.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 opacity-5 border border-accent rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 opacity-5 border border-accent-red rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-tight opacity-0">
          {t('title')}
        </h1>
        <p ref={subtitleRef} className="mt-8 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed opacity-0">
          {t('subtitle')}
        </p>
        <div ref={ctaRef} className="mt-12 opacity-0">
          <Link href={`/${locale}/book`} className="inline-block px-8 py-4 bg-accent text-bg-primary font-medium text-lg rounded hover:bg-accent-hover transition-colors">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
