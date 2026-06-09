import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteConfig } from '../../../config/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  return {
    title: isZh ? '预约咨询 | 命理咨询' : 'Book a Consultation | Destiny',
    description: isZh ? '在线预约命理咨询服务' : 'Book your Chinese metaphysics consultation online',
  };
}

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Book' });

  return (
    <main className="pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-4">{t('title')}</h1>
        <p className="text-text-secondary text-lg mb-16">{t('subtitle')}</p>

        <div className="space-y-4">
          <a
            href={siteConfig.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-[#25D366] text-white font-medium text-lg rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            WhatsApp {t('chat')}
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="block w-full py-4 border border-white/10 text-text-primary font-medium text-lg rounded-lg hover:border-accent/30 transition-colors"
          >
            {t('emailMe')}
          </a>
        </div>

        <div className="mt-16 p-8 bg-bg-secondary rounded-lg border border-white/5">
          <p className="text-sm text-text-secondary mb-4">{t('wechatLabel')}</p>
          <p className="text-2xl text-text-primary font-mono">{siteConfig.contact.wechat}</p>
        </div>
      </div>
    </main>
  );
}
