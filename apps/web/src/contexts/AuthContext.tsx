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
  fetchCurrentUser,
  loginWithPassword,
  logout as logoutApi,
  requestPasswordReset,
  resetPasswordWithOtp,
  type AuthUser,
} from "@/lib/auth-api";
import { setApiAuthHandlers } from "@/lib/auth-handlers";
import { setCurrentUser } from "@/lib/current-user";
import { clearAccessToken } from "@/lib/token-store";

interface AuthContextValue {
  user: AuthUser | null;
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
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadSession = useCallback(async () => {
    try {
      const current = await fetchCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
      clearAccessToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

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
        navigate("/login", { replace: true });
      },
      onForbidden: onApiForbidden,
    });
  }, [navigate, onApiForbidden]);

  const login = useCallback(
    async (email: string, password: string, redirectPath = "/") => {
      const session = await loginWithPassword(email, password);
      setUser(session.user);
      navigate(redirectPath, { replace: true });
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
      requestPasswordReset: requestPasswordResetStep,
      resetPassword,
      logout,
      onApiForbidden,
    }),
    [user, isLoading, login, requestPasswordResetStep, resetPassword, logout, onApiForbidden],
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
