'use client';

import { useSearchParams } from 'next/navigation';

export type RevealLevel = 'none' | 'basic' | 'full';

export function useRevealLevel(): RevealLevel {
  const searchParams = useSearchParams();
  const val = searchParams.get('reveal');
  if (val === 'full') return 'full';
  if (val === 'true' || val === 'basic') return 'basic';
  return 'none';
}

export function useRevealed() {
  return useRevealLevel() !== 'none';
}

export function Blur({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const level = useRevealLevel();
  const blurred = level === 'none';
  return (
    <div className={`${blurred ? 'blur-[5px] select-none pointer-events-none' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function DeepBlur({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const level = useRevealLevel();
  const blurred = level !== 'full';
  return (
    <div className={`${blurred ? 'blur-[5px] select-none pointer-events-none' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function PaywallOverlay({ children }: { children: React.ReactNode }) {
  const level = useRevealLevel();
  if (level === 'full') return null;
  return <>{children}</>;
}
