'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function FooterCTA() {
  const t = useTranslations('FooterCTA');
  const locale = useLocale();

  return (
    <section className="py-32 md:py-48 px-6 text-center">
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-12">{t('title')}</h2>
      <Link href={`/${locale}/book`} className="inline-block px-8 py-4 bg-accent text-bg-primary font-medium text-lg rounded hover:bg-accent-hover transition-colors">
        {t('cta')}
      </Link>
    </section>
  );
}
