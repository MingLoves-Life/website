import './globals.css';
import { Geist } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
