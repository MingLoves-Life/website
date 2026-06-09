'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('services'), href: '#services' },
    { label: t('about'), href: '#about' },
    { label: t('testimonials'), href: '#testimonials' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-primary/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-lg font-medium text-text-primary">
          Destiny
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href={`/${locale}/book`} className="px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded hover:bg-accent-hover transition-colors">
            {t('book')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
