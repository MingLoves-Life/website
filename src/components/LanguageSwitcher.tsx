'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchTo = locale === 'en' ? 'zh' : 'en';
  const label = locale === 'en' ? '中文' : 'EN';

  const newPath = pathname.replace(`/${locale}`, `/${switchTo}`);

  return (
    <Link
      href={newPath}
      className="px-3 py-1 text-sm border border-text-secondary/30 rounded text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors"
    >
      {label}
    </Link>
  );
}
