import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoIcon } from "@/components/BrandMark";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-navy-deep/85 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent",
      )}
    >
      <nav
        className="container flex h-[4.25rem] items-center justify-between"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="flex items-center gap-2.5"
        >
          <LogoIcon size={32} className="rounded-xl ring-1 ring-white/15" />
          <span className="leading-tight">
            <span className="block font-heading font-bold text-white text-[1.05rem] tracking-tight">
              Meeting Desk <span className="text-brand">AI</span>
            </span>
            <span className="block text-[10px] text-white/45 tracking-wide">
              by Virtual Edge
            </span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-9 text-[13px] text-white/60">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={appLink("/login")}
            className="text-[13px] text-white/70 hover:text-white transition-colors px-3.5 py-2"
          >
            Log in
          </a>
          <a
            href={appLink("/login")}
            className="text-[13px] font-semibold bg-brand text-navy-deep hover:bg-teal-300 transition-colors px-5 py-2 rounded-full shadow-glow"
          >
            Start free trial
          </a>
        </div>

        <button
          type="button"
          className="md:hidden text-white/90 p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-deep/98 backdrop-blur-xl px-5 py-5 space-y-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-white/75 py-2.5 text-sm"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={appLink("/login")}
            className="mt-3 block w-full text-center bg-brand text-navy-deep font-semibold py-3 rounded-full"
          >
            Start free trial
          </a>
        </div>
      )}
    </header>
  );
}
