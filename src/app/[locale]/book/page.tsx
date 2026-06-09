import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import BookingForm from '../../../components/BookingForm';
import ContactInfo from '../../../components/ContactInfo';

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
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-4">{t('title')}</h1>
          <p className="text-text-secondary text-lg">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <BookingForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </main>
  );
}
