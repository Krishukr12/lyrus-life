import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchCurrentUser, loginWithPassword, logout as logoutApi, type AuthUser } from "@/lib/auth-api";
import { clearAccessToken } from "@/lib/token-store";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        const current = await fetchCurrentUser();
        if (current?.role === "SUPER_ADMIN") {
          setUser(current);
        } else if (current) {
          setUser(null);
          clearAccessToken();
          toast.error("This portal is for internal super admins only.");
        }
      } catch {
        setUser(null);
        clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await loginWithPassword(email, password);
      if (session.user.role !== "SUPER_ADMIN") {
        clearAccessToken();
        await logoutApi();
        throw new Error("Access denied. Super admin credentials required.");
      }
      setUser(session.user);
      navigate("/", { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
