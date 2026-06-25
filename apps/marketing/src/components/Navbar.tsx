import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { appLink, cn } from "@/lib/utils";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-[hsl(var(--navy-deep))]/90 backdrop-blur-xl border-b border-white/5 shadow-lg" : "bg-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between" aria-label="Main navigation">
        <a href="#" className="flex items-center gap-2.5 font-heading font-bold text-white text-lg tracking-tight">
          <img src="/favicon.svg" alt="" width={32} height={32} className="rounded-lg" aria-hidden />
          <span>Meeting Desk <span className="text-teal">AI</span></span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-white/75">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={appLink("/login")}
            className="text-sm text-white/80 hover:text-white transition-colors px-3 py-2"
          >
            Log in
          </a>
          <a
            href={appLink("/login")}
            className="text-sm font-medium bg-brand text-[hsl(var(--navy-deep))] hover:bg-teal-300 transition-colors px-4 py-2 rounded-full shadow-glow"
          >
            Start free trial
          </a>
        </div>

        <button
          type="button"
          className="md:hidden text-white p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[hsl(var(--navy-deep))] px-4 py-4 space-y-3">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-white/80 py-2"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={appLink("/login")} className="block w-full text-center bg-teal text-[hsl(var(--navy-deep))] font-medium py-2.5 rounded-full">
            Start free trial
          </a>
        </div>
      )}
    </header>
  );
}
