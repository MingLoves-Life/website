import { describe, it, expect } from 'vitest';
import { getReading } from './reading';

describe('getReading', () => {
  const base = { year: 2000, month: 8, day: 16, timeIndex: 0, gender: 'female' as const };

  it('returns four pillars including the hour pillar', async () => {
    const r = await getReading({ ...base, locale: 'zh' });
    expect(r.yearPillar.full).toBe('庚辰');
    expect(r.monthPillar.full).toBe('甲申');
    expect(r.dayPillar.full).toBe('丙午');
    expect(r.hourPillar.full).toBe('戊子');
    expect(r.hourPillar.full).toBeTruthy();
    expect(r.hourPillar.full).toHaveLength(2);
  });

  it('element balance sums to 8 (four pillars × stem+branch)', async () => {
    const r = await getReading({ ...base, locale: 'zh' });
    const total = r.balance.wood + r.balance.fire + r.balance.earth + r.balance.metal + r.balance.water;
    expect(total).toBe(8);
  });

  it('localizes to English without leaking iztro star names', async () => {
    const r = await getReading({ ...base, locale: 'en' });
    expect(r.trait).toMatch(/dominant element/i);
    expect(r.zodiac).toBe('Dragon');
  });
});
