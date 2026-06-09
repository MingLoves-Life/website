'use client';

import { useTranslations } from 'next-intl';

export default function ContactInfo() {
  const t = useTranslations('Footer');

  return (
    <div className="p-8 bg-bg-secondary rounded-lg border border-white/5">
      <h3 className="text-lg font-medium mb-6 text-text-primary">Contact</h3>
      <div className="space-y-4 text-text-secondary">
        <div>
          <p className="text-sm text-text-secondary/70 mb-1">{t('email')}</p>
          <p>hello@example.com</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary/70 mb-1">{t('wechat')}</p>
          <p>destiny_consult</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary/70 mb-1">{t('whatsapp')}</p>
          <p>+1 (555) 000-0000</p>
        </div>
      </div>
    </div>
  );
}
