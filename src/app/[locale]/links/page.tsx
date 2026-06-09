'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function LinksPage() {
  const t = useTranslations('Links');
  const locale = useLocale();

  const links = [
    { label: t('freeReading'), href: `/${locale}/free-reading`, primary: true },
    { label: t('book'), href: `/${locale}/book`, primary: false },
    { label: t('home'), href: `/${locale}`, primary: false },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✦</span>
        </div>
        <h1 className="text-2xl font-medium mb-2">{t('title')}</h1>
        <p className="text-text-secondary text-sm mb-10">{t('subtitle')}</p>
        <div className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block w-full py-3 px-6 rounded-lg text-sm font-medium transition-colors ${
                link.primary
                  ? 'bg-accent text-bg-primary hover:bg-accent-hover'
                  : 'border border-white/10 text-text-primary hover:border-accent/30'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
