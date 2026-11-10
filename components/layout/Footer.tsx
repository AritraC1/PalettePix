import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
        {/* Privacy note */}
        <p className="flex items-center justify-center gap-2.5 text-center text-sm text-neutral-600 sm:text-sm">
          <ShieldCheck className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
          <span>Just your browser. Your images never leave your device.</span>
        </p>

        <hr className="mt-10 border-neutral-200 sm:mt-14" />

        {/* Tagline row */}
        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-neutral-500 sm:mt-10 sm:flex-row sm:justify-between sm:gap-4 sm:text-sm">
          <p>A little color goes a long way.</p>
          <p className="inline-flex items-center gap-2.5">
            Made for curious eyes
            <AsteriskIcon className="size-3 text-brand-600" />
          </p>
        </div>
      </div>
    </footer>
  );
}

function AsteriskIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
    </svg>
  );
}