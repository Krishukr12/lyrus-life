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
import {
  fetchCurrentSession,
  loginWithPassword,
  logout as logoutApi,
  requestPasswordReset,
  resetPasswordWithOtp,
  type AuthOrganization,
  type AuthUser,
} from "@/lib/auth-api";
import { homePathForRole, isExternalRedirect } from "@/lib/role-routes";
import { setApiAuthHandlers } from "@/lib/auth-handlers";
import { setCurrentUser } from "@/lib/current-user";
import { clearAccessToken } from "@/lib/token-store";

interface AuthContextValue {
  user: AuthUser | null;
  organization: AuthOrganization | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectPath?: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ resetToken: string; email: string }>;
  resetPassword: (
    resetToken: string,
    code: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  onApiForbidden: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<AuthOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadSession = useCallback(async () => {
    try {
      const session = await fetchCurrentSession();
      if (session) {
        setUser(session.user);
        setOrganization(session.organization);
      } else {
        setUser(null);
        setOrganization(null);
      }
    } catch {
      setUser(null);
      setOrganization(null);
      clearAccessToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!isLoading && user?.role === "SUPER_ADMIN") {
      window.location.href = import.meta.env.VITE_ADMIN_APP_URL ?? "http://localhost:8081";
    }
  }, [isLoading, user]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const onApiForbidden = useCallback(() => {
    toast.error("You're not authorized to do so");
  }, []);

  useEffect(() => {
    setApiAuthHandlers({
      onUnauthorized: () => {
        clearAccessToken();
        setUser(null);
        setOrganization(null);
        navigate("/login", { replace: true });
      },
      onForbidden: onApiForbidden,
      onOrganizationBlocked: (message) => {
        clearAccessToken();
        setUser(null);
        setOrganization(null);
        navigate("/account-suspended", { replace: true, state: { message } });
      },
    });
  }, [navigate, onApiForbidden]);

  const login = useCallback(
    async (email: string, password: string, redirectPath?: string) => {
      const session = await loginWithPassword(email, password);
      if (session.user.role === "SUPER_ADMIN") {
        clearAccessToken();
        await logoutApi();
        window.location.href = import.meta.env.VITE_ADMIN_APP_URL ?? "http://localhost:8081/login";
        throw new Error("SUPER_ADMIN_REDIRECT");
      }
      setUser(session.user);
      setOrganization(session.organization ?? null);
      const target = redirectPath ?? homePathForRole(session.user.role);
      if (isExternalRedirect(target)) {
        window.location.href = target;
        return;
      }
      navigate(target, { replace: true });
    },
    [navigate],
  );

  const requestPasswordResetStep = useCallback(async (email: string) => {
    const result = await requestPasswordReset(email);
    if (!result.resetToken || !result.email) {
      toast.success(result.message);
      throw new Error("NO_RESET_TOKEN");
    }
    toast.success("Check your email for the reset code.");
    return { resetToken: result.resetToken, email: result.email };
  }, []);

  const resetPassword = useCallback(
    async (
      resetToken: string,
      code: string,
      newPassword: string,
      confirmPassword: string,
    ) => {
      const session = await resetPasswordWithOtp(
        resetToken,
        code,
        newPassword,
        confirmPassword,
      );
      setUser(session.user);
      setOrganization(session.organization ?? null);
      navigate("/", { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    setOrganization(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      organization,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      requestPasswordReset: requestPasswordResetStep,
      resetPassword,
      logout,
      onApiForbidden,
      refreshSession: loadSession,
    }),
    [
      user,
      organization,
      isLoading,
      login,
      requestPasswordResetStep,
      resetPassword,
      logout,
      onApiForbidden,
      loadSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
