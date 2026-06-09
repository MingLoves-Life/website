# Destiny Site MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (EN/ZH) feng shui consultation landing site with a scrolling homepage and a booking form page, deployed on Vercel.

**Architecture:** Next.js 16 App Router with `[locale]` dynamic segment for i18n via next-intl. GSAP ScrollTrigger for scroll-driven animations. Resend for transactional email on form submit via API Route.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, next-intl, GSAP + ScrollTrigger, Resend

**Key docs:**
- next-intl App Router setup: https://next-intl.dev/docs/getting-started/app-router
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Resend Node SDK: https://resend.com/docs/send-with-nodejs
- AGENTS.md warns Next.js 16 may have breaking changes vs training data — check actual API behavior if something doesn't work as expected.

**Note on `gpt-taste` skill:** The project has a `.agents/skills/gpt-taste` skill installed that enforces Awwwards-level design (GSAP animations, wide typography, large spacing, bento grids). The implementing agent SHOULD load this skill when building UI components to ensure high visual quality.

---

## File Structure

```
destiny-site/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # Locale layout (next-intl provider, fonts, Header)
│   │   │   ├── page.tsx            # Homepage (assembles all sections)
│   │   │   └── book/
│   │   │       └── page.tsx        # Booking page
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts        # Form submission → Resend email
│   │   ├── layout.tsx              # Root layout (html, body)
│   │   └── globals.css             # Tailwind + CSS variables
│   ├── components/
│   │   ├── Header.tsx              # Fixed nav with blur backdrop
│   │   ├── Footer.tsx              # Footer + contact info
│   │   ├── Hero.tsx                # Hero section
│   │   ├── Services.tsx            # Services bento grid
│   │   ├── About.tsx               # About section
│   │   ├── Testimonials.tsx        # Testimonials cards
│   │   ├── FooterCTA.tsx           # Final CTA section
│   │   ├── BookingForm.tsx         # Form component
│   │   ├── ContactInfo.tsx         # Sidebar contact details
│   │   └── LanguageSwitcher.tsx    # EN/ZH toggle
│   ├── lib/
│   │   ├── animations.ts           # GSAP animation utilities
│   │   └── resend.ts               # Resend client setup
│   └── messages/
│       ├── en.json                  # English translations
│       └── zh.json                  # Chinese translations
├── i18n/
│   ├── routing.ts                   # next-intl routing config
│   └── request.ts                   # next-intl request config
├── middleware.ts                     # next-intl locale detection middleware
├── next.config.ts                    # next-intl plugin
└── public/
    └── images/                       # Placeholder images
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install production dependencies**

```bash
cd /Users/tal/Desktop/studyspace/ff/destiny-site
npm install next-intl gsap @gsap/react resend
```

- [ ] **Step 2: Install dev dependencies (Google Fonts helper)**

```bash
npm install -D @next/font
```

Note: `next/font/google` is built-in to Next.js, no extra install needed. Skip this step if Next.js 16 already includes it (it does).

Actually, just run step 1. `next/font/google` is built into Next.js.

- [ ] **Step 3: Install all deps (first time)**

```bash
npm install
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000 without errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-intl, gsap, resend dependencies"
```

---

## Task 2: Configure next-intl Internationalization

**Files:**
- Create: `src/messages/en.json`
- Create: `src/messages/zh.json`
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create English messages file**

Create `src/messages/en.json`:

```json
{
  "Header": {
    "services": "Services",
    "about": "About",
    "testimonials": "Testimonials",
    "book": "Book Now"
  },
  "Hero": {
    "title": "Unlock Your Destiny",
    "subtitle": "Traditional Chinese metaphysics meets modern life guidance. Bazi, Zi Wei Dou Shu, Feng Shui, and Date Selection.",
    "cta": "Book a Free Consultation"
  },
  "Services": {
    "title": "Services",
    "bazi": {
      "name": "Bazi Analysis",
      "description": "Decode your birth chart to understand personality, career, relationships, and life cycles."
    },
    "ziwei": {
      "name": "Zi Wei Dou Shu",
      "description": "Purple Star Astrology for detailed life trajectory mapping and decision timing."
    },
    "fengshui": {
      "name": "Feng Shui Consultation",
      "description": "Optimize your living and working spaces for harmony, health, and prosperity."
    },
    "dateselection": {
      "name": "Date Selection",
      "description": "Choose auspicious dates for weddings, moves, business launches, and major decisions."
    },
    "cta": "Learn More"
  },
  "About": {
    "title": "About",
    "bio": "With over a decade of study in traditional Chinese metaphysics, I blend classical wisdom with practical modern guidance. Trained in the lineage of authentic masters, I offer consultations that are insightful, actionable, and respectful of both Eastern traditions and Western lifestyles."
  },
  "Testimonials": {
    "title": "Client Testimonials",
    "items": [
      {
        "name": "Sarah L.",
        "rating": 5,
        "text": "The Bazi reading was incredibly accurate. It helped me understand my career path and make a major decision with confidence."
      },
      {
        "name": "David W.",
        "rating": 5,
        "text": "The Feng Shui consultation transformed our home. We noticed positive changes within weeks."
      },
      {
        "name": "Lisa C.",
        "rating": 5,
        "text": "Professional, insightful, and practical. The date selection for our wedding gave us peace of mind."
      }
    ]
  },
  "FooterCTA": {
    "title": "Begin Your Journey",
    "cta": "Book a Consultation"
  },
  "Footer": {
    "email": "Email",
    "wechat": "WeChat",
    "whatsapp": "WhatsApp",
    "copyright": "All rights reserved."
  },
  "Book": {
    "title": "Book a Consultation",
    "subtitle": "Fill out the form below and we'll respond within 24 hours.",
    "name": "Full Name",
    "email": "Email",
    "birthdate": "Birth Date",
    "birthtime": "Birth Time (if known)",
    "service": "Consultation Type",
    "serviceOptions": {
      "bazi": "Bazi Analysis",
      "ziwei": "Zi Wei Dou Shu",
      "fengshui": "Feng Shui",
      "dateselection": "Date Selection",
      "other": "Other"
    },
    "message": "Additional Notes (optional)",
    "submit": "Submit",
    "success": "Thank you! We've received your request and will respond within 24 hours.",
    "error": "Something went wrong. Please try again or contact us directly."
  }
}
```

- [ ] **Step 2: Create Chinese messages file**

Create `src/messages/zh.json`:

```json
{
  "Header": {
    "services": "服务项目",
    "about": "关于",
    "testimonials": "客户评价",
    "book": "立即预约"
  },
  "Hero": {
    "title": "解锁你的命运密码",
    "subtitle": "传统命理智慧，指导现代生活。八字、紫微斗数、风水、择日。",
    "cta": "预约免费咨询"
  },
  "Services": {
    "title": "服务项目",
    "bazi": {
      "name": "八字命盘",
      "description": "解读你的出生命盘，洞察性格、事业、感情与人生周期。"
    },
    "ziwei": {
      "name": "紫微斗数",
      "description": "精细的人生轨迹推演，把握决策时机。"
    },
    "fengshui": {
      "name": "风水勘察",
      "description": "优化居住与办公空间，促进和谐、健康与财运。"
    },
    "dateselection": {
      "name": "择日",
      "description": "为婚嫁、搬迁、开业等人生大事选择良辰吉日。"
    },
    "cta": "了解详情"
  },
  "About": {
    "title": "关于我",
    "bio": "十余年传统命理研习，融合古典智慧与现代实用指导。师承正统传承，提供专业、可落地、尊重东西方文化的命理咨询服务。"
  },
  "Testimonials": {
    "title": "客户评价",
    "items": [
      {
        "name": "Sarah L.",
        "rating": 5,
        "text": "八字解读非常准确，帮助我理解了职业方向，让我充满信心地做出了重要决定。"
      },
      {
        "name": "David W.",
        "rating": 5,
        "text": "风水咨询让我们的家焕然一新，几周内就感受到了积极的变化。"
      },
      {
        "name": "Lisa C.",
        "rating": 5,
        "text": "专业、有洞察力、实用。婚礼择日让我们安心许多。"
      }
    ]
  },
  "FooterCTA": {
    "title": "开启你的命理之旅",
    "cta": "预约咨询"
  },
  "Footer": {
    "email": "邮箱",
    "wechat": "微信",
    "whatsapp": "WhatsApp",
    "copyright": "版权所有。"
  },
  "Book": {
    "title": "预约咨询",
    "subtitle": "填写以下表单，我们将在 24 小时内回复。",
    "name": "姓名",
    "email": "邮箱",
    "birthdate": "出生日期",
    "birthtime": "出生时间（如知道请填写）",
    "service": "咨询类型",
    "serviceOptions": {
      "bazi": "八字命盘",
      "ziwei": "紫微斗数",
      "fengshui": "风水",
      "dateselection": "择日",
      "other": "其他"
    },
    "message": "补充说明（可选）",
    "submit": "提交",
    "success": "感谢！我们已收到您的请求，将在 24 小时内回复。",
    "error": "提交失败，请重试或直接联系我们。"
  }
}
```

- [ ] **Step 3: Create i18n routing config**

Create `i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en'
});
```

- [ ] **Step 4: Create i18n request config**

Create `i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default
  };
});
```

- [ ] **Step 5: Create middleware**

Create `middleware.ts` (project root):

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|zh)/:path*']
};
```

- [ ] **Step 6: Update next.config.ts**

Replace `next.config.ts`:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Verify dev server starts with i18n**

```bash
npm run dev
```

Visit http://localhost:3000 — should redirect to `/en`. No errors in terminal.

- [ ] **Step 8: Commit**

```bash
git add i18n/ middleware.ts next.config.ts src/messages/
git commit -m "feat: configure next-intl with en/zh locales"
```

---

## Task 3: Set Up Root Layout, Locale Layout, Globals CSS

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx` (placeholder)
- Modify: `src/app/globals.css`
- Delete: `src/app/page.tsx` (moved to `[locale]`)

- [ ] **Step 1: Update globals.css with design tokens**

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #141414;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a0a0a0;
  --color-accent: #c9a84c;
  --color-accent-hover: #d4b45e;
  --color-accent-red: #8b2020;
  --font-sans: var(--font-geist-sans);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Simplify root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Destiny Consultation | 命理咨询',
  description: 'Traditional Chinese metaphysics consultation - Bazi, Zi Wei Dou Shu, Feng Shui, Date Selection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

Note: In next-intl with App Router, the root layout should NOT render `<html>` — that goes in the locale layout.

- [ ] **Step 3: Create locale layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../../i18n/routing';
import { Geist } from 'next/font/google';

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

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create placeholder homepage**

Create `src/app/[locale]/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1 className="text-4xl text-center pt-20 text-accent">Destiny Site</h1>
    </main>
  );
}
```

- [ ] **Step 5: Delete old page.tsx**

```bash
rm src/app/page.tsx
```

- [ ] **Step 6: Verify**

```bash
npm run dev
```

Visit http://localhost:3000/en — should show "Destiny Site" in gold on dark background. Visit http://localhost:3000/zh — same.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: set up locale layout, design tokens, and i18n provider"
```

---

## Task 4: Header Component

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/LanguageSwitcher.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Create LanguageSwitcher**

Create `src/components/LanguageSwitcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = locale === 'en' ? 'zh' : 'en';
  const label = locale === 'en' ? '中文' : 'EN';

  function handleSwitch() {
    const newPath = pathname.replace(`/${locale}`, `/${switchTo}`);
    router.push(newPath);
  }

  return (
    <button
      onClick={handleSwitch}
      className="px-3 py-1 text-sm border border-text-secondary/30 rounded text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors"
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 2: Create Header**

Create `src/components/Header.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
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
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-lg font-medium text-text-primary">
          Destiny
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href={`/${locale}/book`}
            className="px-4 py-2 bg-accent text-bg-primary text-sm font-medium rounded hover:bg-accent-hover transition-colors"
          >
            {t('book')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Add Header to locale layout**

Modify `src/app/[locale]/layout.tsx` — add import and render Header inside body, before `{children}`:

```tsx
import Header from '../../components/Header';
```

And in the JSX, inside `<body>`:

```tsx
<body className="min-h-screen bg-bg-primary text-text-primary font-sans">
  <NextIntlClientProvider messages={messages}>
    <Header />
    {children}
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 4: Verify**

Visit http://localhost:3000/en — Header should be visible, fixed top, transparent. Scroll to see blur effect. Language switcher toggles between EN and 中文.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/LanguageSwitcher.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat: add fixed header with nav, language switcher, and scroll blur"
```

---

## Task 5: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/lib/animations.ts`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create GSAP animation utilities**

Create `src/lib/animations.ts`:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function fadeInUp(element: Element, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, delay, ease: 'power3.out' }
  );
}

export function staggerFadeInUp(elements: Element[], stagger = 0.1) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, stagger, ease: 'power3.out' }
  );
}

export function parallax(element: Element, scrollTrigger: Element, yPercent = -20) {
  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollTrigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Create Hero component**

Create `src/components/Hero.tsx`:

```tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '../lib/animations';

export default function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline();
    if (titleRef.current) {
      tl.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 opacity-5 border border-accent rounded-full" />
        <div className="absolute bottom-20 left-10 w-48 h-48 opacity-5 border border-accent-red rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-tight opacity-0"
        >
          {t('title')}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-8 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed opacity-0"
        >
          {t('subtitle')}
        </p>
        <div ref={ctaRef} className="mt-12 opacity-0">
          <Link
            href={`/${locale}/book`}
            className="inline-block px-8 py-4 bg-accent text-bg-primary font-medium text-lg rounded hover:bg-accent-hover transition-colors"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update homepage to use Hero**

Replace `src/app/[locale]/page.tsx`:

```tsx
import Hero from '../../components/Hero';

export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Visit http://localhost:3000/en — full-screen Hero with animated title, subtitle, and CTA button. Gold accent colors on dark background.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/lib/animations.ts src/app/\[locale\]/page.tsx
git commit -m "feat: add Hero section with GSAP entrance animations"
```

---

## Task 6: Services Section

**Files:**
- Create: `src/components/Services.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create Services component**

Create `src/components/Services.tsx`:

```tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '../lib/animations';

const serviceKeys = ['bazi', 'ziwei', 'fengshui', 'dateselection'] as const;

export default function Services() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cardsRef.current) return;

    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light mb-16 md:mb-24 text-center">
          {t('title')}
        </h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceKeys.map((key) => (
            <div
              key={key}
              className="p-8 md:p-10 bg-bg-secondary rounded-lg border border-white/5 hover:border-accent/20 transition-colors opacity-0"
            >
              <h3 className="text-xl md:text-2xl font-medium mb-3 text-text-primary">
                {t(`${key}.name`)}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                {t(`${key}.description`)}
              </p>
              <Link
                href={`/${locale}/book`}
                className="text-accent text-sm hover:underline"
              >
                {t('cta')} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage**

Modify `src/app/[locale]/page.tsx`:

```tsx
import Hero from '../../components/Hero';
import Services from '../../components/Services';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
    </main>
  );
}
```

- [ ] **Step 3: Verify**

Scroll down from Hero — services cards should stagger in. 2x2 grid on desktop, stack on mobile.

- [ ] **Step 4: Commit**

```bash
git add src/components/Services.tsx src/app/\[locale\]/page.tsx
git commit -m "feat: add Services section with bento grid and scroll animation"
```

---

## Task 7: About Section

**Files:**
- Create: `src/components/About.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create About component**

Create `src/components/About.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';

export default function About() {
  const t = useTranslations('About');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Image placeholder */}
        <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-bg-secondary">
          <div
            ref={imageRef}
            className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm"
          >
            <div className="w-full h-full bg-gradient-to-br from-bg-secondary to-bg-primary flex items-center justify-center border border-white/5 rounded-lg">
              <span className="text-text-secondary/50">Photo</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="opacity-0">
          <h2 className="text-3xl md:text-5xl font-light mb-8">{t('title')}</h2>
          <p className="text-text-secondary leading-relaxed text-lg">{t('bio')}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage**

```tsx
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import About from '../../components/About';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
    </main>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
git add src/components/About.tsx src/app/\[locale\]/page.tsx
git commit -m "feat: add About section with parallax image and fade-in text"
```

---

## Task 8: Testimonials Section

**Files:**
- Create: `src/components/Testimonials.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create Testimonials component**

Create `src/components/Testimonials.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/animations';

export default function Testimonials() {
  const t = useTranslations('Testimonials');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const items = t.raw('items') as Array<{ name: string; rating: number; text: string }>;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cardsRef.current) return;

    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="py-32 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light mb-16 md:mb-24 text-center">
          {t('title')}
        </h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-8 bg-bg-secondary rounded-lg border border-white/5 opacity-0"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <span key={j} className="text-accent">★</span>
                ))}
              </div>
              <p className="text-text-secondary leading-relaxed mb-6">"{item.text}"</p>
              <p className="text-sm text-text-primary font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage**

```tsx
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import About from '../../components/About';
import Testimonials from '../../components/Testimonials';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Testimonials />
    </main>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
git add src/components/Testimonials.tsx src/app/\[locale\]/page.tsx
git commit -m "feat: add Testimonials section with slide-in animation"
```

---

## Task 9: Footer CTA + Footer

**Files:**
- Create: `src/components/FooterCTA.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create FooterCTA**

Create `src/components/FooterCTA.tsx`:

```tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function FooterCTA() {
  const t = useTranslations('FooterCTA');
  const locale = useLocale();

  return (
    <section className="py-32 md:py-48 px-6 text-center">
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mb-12">
        {t('title')}
      </h2>
      <Link
        href={`/${locale}/book`}
        className="inline-block px-8 py-4 bg-accent text-bg-primary font-medium text-lg rounded hover:bg-accent-hover transition-colors"
      >
        {t('cta')}
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer**

Create `src/components/Footer.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
          <span>{t('email')}: hello@example.com</span>
          <span>{t('wechat')}: destiny_consult</span>
          <span>{t('whatsapp')}: +1 (555) 000-0000</span>
        </div>
        <p className="text-sm text-text-secondary">
          © {new Date().getFullYear()} Destiny. {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add FooterCTA to homepage, Footer to locale layout**

`src/app/[locale]/page.tsx`:

```tsx
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import About from '../../components/About';
import Testimonials from '../../components/Testimonials';
import FooterCTA from '../../components/FooterCTA';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <FooterCTA />
    </main>
  );
}
```

Add Footer to `src/app/[locale]/layout.tsx` after `{children}`:

```tsx
import Footer from '../../components/Footer';
// ...in JSX:
<NextIntlClientProvider messages={messages}>
  <Header />
  {children}
  <Footer />
</NextIntlClientProvider>
```

- [ ] **Step 4: Verify and commit**

```bash
git add src/components/FooterCTA.tsx src/components/Footer.tsx src/app/\[locale\]/page.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat: add FooterCTA section and Footer with contact info"
```

---

## Task 10: Booking Page + Contact Form

**Files:**
- Create: `src/app/[locale]/book/page.tsx`
- Create: `src/components/BookingForm.tsx`
- Create: `src/components/ContactInfo.tsx`

- [ ] **Step 1: Create ContactInfo component**

Create `src/components/ContactInfo.tsx`:

```tsx
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
```

- [ ] **Step 2: Create BookingForm component**

Create `src/components/BookingForm.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useState, FormEvent } from 'react';

export default function BookingForm() {
  const t = useTranslations('Book');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8 bg-bg-secondary rounded-lg border border-accent/20 text-center">
        <p className="text-accent text-lg">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('name')}</label>
        <input
          name="name"
          required
          className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('email')}</label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">{t('birthdate')}</label>
          <input
            name="birthdate"
            type="date"
            required
            className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-2">{t('birthtime')}</label>
          <input
            name="birthtime"
            type="time"
            className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('service')}</label>
        <select
          name="service"
          required
          className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors"
        >
          <option value="bazi">{t('serviceOptions.bazi')}</option>
          <option value="ziwei">{t('serviceOptions.ziwei')}</option>
          <option value="fengshui">{t('serviceOptions.fengshui')}</option>
          <option value="dateselection">{t('serviceOptions.dateselection')}</option>
          <option value="other">{t('serviceOptions.other')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('message')}</label>
        <textarea
          name="message"
          rows={4}
          className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-accent-red text-sm">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 bg-accent text-bg-primary font-medium text-lg rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? '...' : t('submit')}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create booking page**

Create `src/app/[locale]/book/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import BookingForm from '../../../components/BookingForm';
import ContactInfo from '../../../components/ContactInfo';

export default function BookPage() {
  const t = useTranslations('Book');

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
```

- [ ] **Step 4: Verify**

Visit http://localhost:3000/en/book — form should render with all fields. Submit without API route will fail gracefully (shows error message).

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/book/ src/components/BookingForm.tsx src/components/ContactInfo.tsx
git commit -m "feat: add booking page with form and contact info"
```

---

## Task 11: Contact API Route + Resend

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `src/lib/resend.ts`

- [ ] **Step 1: Create Resend client**

Create `src/lib/resend.ts`:

```ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
```

- [ ] **Step 2: Create API route**

Create `src/app/api/contact/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { resend } from '../../../lib/resend';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, birthdate, birthtime, service, message } = body;

  if (!name || !email || !birthdate || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Destiny Site <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL || 'hello@example.com',
      subject: `New Consultation Request: ${service} - ${name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Birth Date:</strong> ${birthdate}</p>
        <p><strong>Birth Time:</strong> ${birthtime || 'Not provided'}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send failed:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create .env.local template**

Create `.env.local.example`:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTIFICATION_EMAIL=your@email.com
```

Add `.env.local` to `.gitignore` if not already there:

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 4: Verify**

With dev server running, submit the booking form. Without a real RESEND_API_KEY, it should return a 500 and the form should show the error message gracefully.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/contact/route.ts src/lib/resend.ts .env.local.example .gitignore
git commit -m "feat: add contact API route with Resend email notifications"
```

---

## Task 12: SEO - Metadata + Sitemap

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/book/page.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Add metadata to homepage**

Add to `src/app/[locale]/page.tsx`:

```tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import About from '../../components/About';
import Testimonials from '../../components/Testimonials';
import FooterCTA from '../../components/FooterCTA';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  return {
    title: isZh ? '命理咨询 | 八字·紫微·风水' : 'Destiny Consultation | Bazi · Zi Wei · Feng Shui',
    description: isZh
      ? '专业命理咨询服务：八字命盘、紫微斗数、风水勘察、择日。融合传统智慧与现代指导。'
      : 'Professional Chinese metaphysics consultation: Bazi, Zi Wei Dou Shu, Feng Shui, Date Selection. Traditional wisdom meets modern guidance.',
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
      <About />
      <Testimonials />
      <FooterCTA />
    </main>
  );
}
```

- [ ] **Step 2: Add metadata to booking page**

Add to `src/app/[locale]/book/page.tsx`:

```tsx
import type { Metadata } from 'next';
import BookingForm from '../../../components/BookingForm';
import ContactInfo from '../../../components/ContactInfo';
import { getTranslations } from 'next-intl/server';

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
```

- [ ] **Step 3: Create sitemap**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.SITE_URL || 'https://example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'zh'];
  const routes = ['', '/book'];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );
}
```

- [ ] **Step 4: Create robots.txt**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.SITE_URL || 'https://example.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/\[locale\]/page.tsx src/app/\[locale\]/book/page.tsx
git commit -m "feat: add SEO metadata, sitemap, and robots.txt"
```

---

## Task 13: Final Polish + Build Verification

**Files:**
- Modify: various (fixes from build)

- [ ] **Step 1: Run build**

```bash
cd /Users/tal/Desktop/studyspace/ff/destiny-site
npm run build
```

Fix any TypeScript or build errors that appear.

- [ ] **Step 2: Test both locales in production mode**

```bash
npm run start
```

Visit:
- http://localhost:3000/en — full homepage scrolling, all sections
- http://localhost:3000/zh — Chinese version
- http://localhost:3000/en/book — booking form
- http://localhost:3000/zh/book — Chinese booking form
- Language switcher works on all pages

- [ ] **Step 3: Test mobile viewport**

In browser DevTools, test at 375px width. Verify:
- Header CTA visible
- Hero text doesn't overflow
- Cards stack vertically
- Form is usable

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: build errors and polish"
```

---

## Summary

| Task | What it builds |
|------|----------------|
| 1 | Dependencies |
| 2 | next-intl i18n with EN/ZH messages |
| 3 | Root + locale layouts, CSS tokens |
| 4 | Header (fixed, blur, nav, lang switcher) |
| 5 | Hero section + GSAP animations |
| 6 | Services bento grid |
| 7 | About section with parallax |
| 8 | Testimonials cards |
| 9 | Footer CTA + Footer |
| 10 | Booking page + form |
| 11 | Contact API + Resend email |
| 12 | SEO metadata + sitemap |
| 13 | Build verification + polish |
