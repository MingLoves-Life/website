import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../../i18n/routing';
import { Geist } from 'next/font/google';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
