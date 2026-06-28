import { getReading } from '../src/lib/reading.ts';
const r = await getReading({ year: 1988, month: 3, day: 12, timeIndex: 6, gender: 'female', locale: 'zh' });
console.log(JSON.stringify(r, null, 2));
