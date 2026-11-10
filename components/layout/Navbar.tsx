"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, Sparkles, X as CloseIcon } from "lucide-react";
import { BookmarksDrawer } from "@/components/layout/BookmarksDrawer";
import { useBookmarks } from "@/lib/bookmarks";

const GITHUB_URL = "https://github.com/AritraC1/PalettePix";
const X_URL = "https://x.com/Aritra_C1";

const NAV_ITEMS = [
  { kind: "link", href: "/", label: "Picker", icon: Sparkles },
  { kind: "button", action: "bookmarks", label: "Bookmarks", icon: Bookmark, showCount: true },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { palettes, renamePalette, removePalette } = useBookmarks();

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const navLinks = (mobile: boolean) =>
    NAV_ITEMS.map((item) => {
      const { label, icon: Icon } = item;
      const active = item.kind === "link" && pathname === item.href;
      const className = [
        "inline-flex items-center gap-2.5 rounded-xl text-[15px] font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
        mobile ? "w-full px-4 py-3" : "px-4 py-2.5",
        active
          ? "bg-[#e3f4e8] text-[#5f9c82]"
          : "text-neutral-500 hover:bg-[#e3f4e8] hover:text-[#5f9c82]",
      ].join(" ");

      const inner = (
        <>
          <Icon className="size-5" aria-hidden="true" />
          {label}
          {item.kind === "button" && item.showCount && palettes.length > 0 && (
            <span
              className="rounded-md bg-brand-100 px-1.5 py-0.5 text-xs font-semibold leading-none text-brand-600"
              aria-label={`${palettes.length} saved`}
            >
              {palettes.length}
            </span>
          )}
        </>
      );

      return item.kind === "link" ? (
        <Link
          key={label}
          href={item.href}
          aria-current={active ? "page" : undefined}
          onClick={() => setOpen(false)}
          className={className}
        >
          {inner}
        </Link>
      ) : (
        <button
          key={label}
          type="button"
          onClick={() => {
            setOpen(false);
            setDrawerOpen(true);
          }}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          className={className}
        >
          {inner}
        </button>
      );
    });

  const socialLinks = (
    <>
      <SocialLink href={GITHUB_URL} label="PalettePix on GitHub">
        <GithubIcon className="size-5" />
      </SocialLink>
      <SocialLink href={X_URL} label="PalettePix on X">
        <XLogoIcon className="size-5" />
      </SocialLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] md:h-18">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 justify-self-start rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          onClick={() => setOpen(false)}
        >
          <LogoMark className="size-9 sm:size-10" />
          <span className="text-[22px] font-bold tracking-tight text-black sm:text-[26px]">
            PalettePix<span className="text-brand-600">.</span>
          </span>
        </Link>

        {/* Desktop nav (centered) */}
        <nav aria-label="Main" className="hidden items-center gap-2 md:flex">
          {navLinks(false)}
        </nav>

        {/* Desktop socials */}
        <div className="hidden items-center gap-1 justify-self-end md:flex">
          {socialLinks}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-xl text-neutral-600 transition-colors hover:bg-[#e3f4e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 md:hidden"
        >
          {open ? (
            <CloseIcon className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-neutral-200/70 bg-white md:hidden"
        >
          <nav
            aria-label="Main"
            className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6"
          >
            {navLinks(true)}
          </nav>
          <div className="mx-auto flex max-w-6xl items-center gap-1 border-t border-neutral-100 px-4 py-3 sm:px-6">
            {socialLinks}
          </div>
        </div>
      )}

      {/* Saved palettes drawer */}
      <BookmarksDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        palettes={palettes}
        onSelect={() => setDrawerOpen(false)}
        onRename={renamePalette}
        onRemove={removePalette}
      />
    </header>
  );
}

/* ---------- small pieces ---------- */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-xl text-neutral-500 transition-colors hover:bg-[#e3f4e8] hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      {children}
    </a>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect
        x="2"
        y="7"
        width="15"
        height="15"
        rx="4"
        fill="#2f7a56"
        transform="rotate(-8 9.5 14.5)"
      />
      <rect
        x="20"
        y="2"
        width="15"
        height="15"
        rx="4"
        fill="#8fc5a0"
        transform="rotate(6 27.5 9.5)"
      />
      <rect
        x="4"
        y="25"
        width="14"
        height="14"
        rx="4"
        fill="#ecd391"
        transform="rotate(-6 11 32)"
      />
      <rect
        x="21"
        y="21"
        width="15"
        height="15"
        rx="4"
        fill="#d98b6f"
        transform="rotate(8 28.5 28.5)"
      />
    </svg>
  );
}

// Brand icons are inline SVGs so you don't depend on lucide's brand icon set.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
