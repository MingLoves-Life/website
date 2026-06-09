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

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded text-text-primary focus:border-accent focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('name')}</label>
        <input name="name" required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('email')}</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">{t('birthdate')}</label>
          <input name="birthdate" type="date" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-2">{t('birthtime')}</label>
          <input name="birthtime" type="time" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('service')}</label>
        <select name="service" required className={inputClass}>
          <option value="bazi">{t('serviceOptions.bazi')}</option>
          <option value="ziwei">{t('serviceOptions.ziwei')}</option>
          <option value="fengshui">{t('serviceOptions.fengshui')}</option>
          <option value="dateselection">{t('serviceOptions.dateselection')}</option>
          <option value="other">{t('serviceOptions.other')}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-text-secondary mb-2">{t('message')}</label>
        <textarea name="message" rows={4} className={`${inputClass} resize-none`} />
      </div>
      {status === 'error' && <p className="text-accent-red text-sm">{t('error')}</p>}
      <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-accent text-bg-primary font-medium text-lg rounded hover:bg-accent-hover transition-colors disabled:opacity-50">
        {status === 'loading' ? '...' : t('submit')}
      </button>
    </form>
  );
}
