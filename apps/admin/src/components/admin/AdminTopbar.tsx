import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalSearch } from "@/contexts/GlobalSearchContext";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { cn } from "@/lib/utils";

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const { query, setQuery, submitSearch, inputRef } = useGlobalSearch();
  const [draft, setDraft] = useState(query);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    if (!profileOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [profileOpen]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    setQuery(next);
    submitSearch(next);
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full shrink-0 items-center gap-4 border-b border-slate-200/90 bg-white px-4 lg:px-6">
      <form onSubmit={handleSubmit} className="relative min-w-0 w-full max-w-md sm:max-w-lg">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft("");
              setQuery("");
              inputRef.current?.blur();
            }
          }}
          placeholder="Search organizations…"
          aria-label="Search organizations"
          className={cn(
            "h-9 w-full rounded-lg border border-slate-200 bg-slate-50/90 text-sm text-slate-800",
            "pl-9 pr-3 placeholder:text-slate-400",
            "transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/5",
            !draft.trim() && "md:pr-[4.25rem]",
          )}
        />
        {!draft.trim() ? (
          <span
            className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 md:inline-flex"
            aria-hidden
          >
            <kbd className="admin-kbd">⌘</kbd>
            <kbd className="admin-kbd ml-0.5">K</kbd>
          </span>
        ) : null}
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-[17px] w-[17px]" strokeWidth={1.75} />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className={cn(
              "flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 transition-colors",
              profileOpen ? "bg-slate-100" : "hover:bg-slate-50",
            )}
          >
            <UserAvatar name={user?.name} email={user?.email} size="sm" />
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block max-w-[9rem] truncate text-sm font-medium leading-tight text-slate-900">
                {user?.name ?? "Admin"}
              </span>
              <span className="block max-w-[9rem] truncate text-[11px] leading-tight text-slate-500">
                {user?.email}
              </span>
            </span>
          </button>

          {profileOpen ? (
            <div
              className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95"
              role="menu"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                <UserAvatar name={user?.name} email={user?.email} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => {
                    setProfileOpen(false);
                    void logout();
                  }}
                >
                  <LogOut className="h-4 w-4 text-slate-400" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
