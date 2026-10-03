import { cn } from "@/lib/utils";

/** ALOX monogram: architectural "A" crossed by a gold "X". */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-7 w-7", className)} aria-hidden="true">
      <path d="M20 3 L35 37 H29.5 L20 15 L10.5 37 H5 Z" fill="currentColor" />
      <path d="M13 17 L27 31 M27 17 L13 31" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Monogram />
      <span className="font-sans text-lg font-normal tracking-[0.42em]">ALOX</span>
    </span>
  );
}
