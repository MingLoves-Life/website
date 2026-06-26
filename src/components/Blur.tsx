'use client';

import { useSearchParams } from 'next/navigation';

export function useRevealed() {
  const searchParams = useSearchParams();
  return searchParams.get('reveal') === 'true';
}

export function Blur({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const revealed = useRevealed();
  return (
    <div className={`${revealed ? '' : 'blur-[5px] select-none pointer-events-none'} ${className}`}>
      {children}
    </div>
  );
}

export function PaywallOverlay({ children }: { children: React.ReactNode }) {
  const revealed = useRevealed();
  if (revealed) return null;
  return <>{children}</>;
}
