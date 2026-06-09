import type { Metadata } from 'next';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import Pricing from '../../components/Pricing';
import About from '../../components/About';
import Testimonials from '../../components/Testimonials';
import FAQ from '../../components/FAQ';
import FooterCTA from '../../components/FooterCTA';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  return {
    title: isZh ? '命理咨询 | 八字·紫微·风水' : 'Destiny Consultation | Bazi · Zi Wei · Feng Shui',
    description: isZh
      ? '专业命理咨询服务：八字命盘、紫微斗数、风水勘察、择日。融合传统智慧与现代指导。'
      : 'Professional Chinese metaphysics consultation: Bazi, Zi Wei Dou Shu, Feng Shui, Date Selection.',
    openGraph: {
      title: isZh ? '命理咨询' : 'Destiny Consultation',
      description: isZh ? '传统命理智慧，指导现代生活' : 'Traditional Chinese metaphysics meets modern life guidance',
      type: 'website',
    },
  };
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Pricing />
      <About />
      <Testimonials />
      <FAQ />
      <FooterCTA />
    </main>
  );
}
