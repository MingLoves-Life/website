'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';

export default function About() {
  const t = useTranslations('About');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (textRef.current) {
      gsap.fromTo(textRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-bg-secondary">
          <div ref={imageRef} className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-bg-secondary to-bg-primary flex items-center justify-center border border-white/5 rounded-lg">
              <span className="text-text-secondary/50">Photo</span>
            </div>
          </div>
        </div>
        <div ref={textRef} className="opacity-0">
          <h2 className="text-3xl md:text-5xl font-light mb-8">{t('title')}</h2>
          <p className="text-text-secondary leading-relaxed text-lg">{t('bio')}</p>
        </div>
      </div>
    </section>
  );
}
