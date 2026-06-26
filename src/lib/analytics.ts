type Props = Record<string, unknown>;

export function track(event: string, props?: Props): void {
  if (typeof window === 'undefined') return;
  // TikTok pixel if present
  const ttq = (window as unknown as { ttq?: { track: (e: string, p?: Props) => void } }).ttq;
  ttq?.track(event, props);
  // Fallback: dataLayer for GTM/GA if present
  const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  dl?.push({ event, ...props });
}
