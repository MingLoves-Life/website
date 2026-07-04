'use client';

import { useEffect } from 'react';
import { siteConfig } from '../config/site';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-bg-secondary border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-xs text-accent tracking-widest uppercase mb-2">✦ Free Reading</p>
        <h3 className="text-xl sm:text-2xl font-light text-text-primary mb-3">
          I'll Read Your Chart Personally
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          Your BaZi holds answers most people never find out.
        </p>
        <p className="text-sm leading-relaxed mb-6">
          Reach out — within 24 hours, I'll send you a personal breakdown: what your chart reveals, and what it means for you now.
        </p>
        <p className="text-sm text-accent/80 font-light italic mb-6">
          Free. Because everyone deserves to know.
        </p>

        <div className="space-y-3">
          <a
            href={siteConfig.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            💬 Message me on WhatsApp
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 border border-white/10 text-text-primary font-medium rounded-lg hover:border-accent/30 transition-colors"
          >
            ✉️ Send me an Email
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-text-secondary/60">
          ⏱ Personal reply within 24 hours · 🔒 Your details are kept private
        </p>
      </div>
    </div>
  );
}
