import { getTranslations, setRequestLocale } from 'next-intl/server';
import { siteConfig } from '../../../config/site';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Privacy' });

  const sections = ['collect', 'use', 'protect', 'share', 'rights', 'contact'] as const;

  return (
    <main className="pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-4">{t('title')}</h1>
        <p className="text-sm text-text-secondary mb-10">{t('lastUpdated')}</p>
        <div className="space-y-8">
          {sections.map((key) => (
            <section key={key}>
              <h2 className="text-lg font-semibold text-text-primary mb-2">{t(`${key}.title`)}</h2>
              <p className="text-text-secondary leading-relaxed">{t(`${key}.content`, { email: siteConfig.contact.email })}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
