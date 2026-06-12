import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type GlobalSearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  submitSearch: (value?: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  focusSearch: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const query = searchParams.get("search") ?? "";

  const setQuery = useCallback(
    (value: string) => {
      const next = value.trim();
      if (!next) {
        const params = new URLSearchParams(searchParams);
        params.delete("search");
        setSearchParams(params, { replace: true });
        return;
      }
      const params = new URLSearchParams(searchParams);
      params.set("search", next);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const submitSearch = useCallback(
    (value?: string) => {
      const next = (value ?? query).trim();
      if (!next) return;
      navigate(`/organizations?search=${encodeURIComponent(next)}`);
    },
    [navigate, query],
  );

  const focusSearch = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusSearch]);

  const value = useMemo(
    () => ({ query, setQuery, submitSearch, inputRef, focusSearch }),
    [query, setQuery, submitSearch, focusSearch],
  );

  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>;
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) {
    throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  }
  return ctx;
}
