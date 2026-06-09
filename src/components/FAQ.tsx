'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

const faqKeys = ['what', 'process', 'deliverable', 'privacy', 'refund'] as const;

export default function FAQ() {
  const t = useTranslations('FAQ');
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light mb-16 md:mb-24 text-center">{t('title')}</h2>
        <div className="space-y-4">
          {faqKeys.map((key, i) => (
            <div key={key} className="border border-white/5 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-text-primary font-medium pr-4">{t(`${key}.q`)}</span>
                <span className="text-text-secondary text-xl shrink-0">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                  {t(`${key}.a`)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
