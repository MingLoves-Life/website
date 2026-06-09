'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
            <span>{t('email')}: hello@example.com</span>
            <span>{t('wechat')}: destiny_consult</span>
            <span>{t('whatsapp')}: +1 (555) 000-0000</span>
          </div>
          <div className="flex gap-4 text-sm text-text-secondary">
            <Link href={`/${locale}/privacy`} className="hover:text-text-primary transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-text-primary transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
        <p className="text-sm text-text-secondary text-center md:text-left">
          © {new Date().getFullYear()} Destiny. {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
