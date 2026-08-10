import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import {
  clearWorkspaceLock,
  isWorkspaceLocked,
  setWorkspaceLock,
} from "@/lib/workspace-access";

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
  onApiForbidden: (message?: string, code?: string) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<AuthOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const organizationRef = useRef<AuthOrganization | null>(null);
  const lockingRef = useRef(false);

  useEffect(() => {
    organizationRef.current = organization;
  }, [organization]);

  const loadSession = useCallback(async () => {
    try {
      const session = await fetchCurrentSession();
      if (session) {
        setUser(session.user);
        setOrganization(session.organization);
        if (
          session.organization?.billingStatus === "ACTIVE" &&
          !isWorkspaceLocked(session.organization)
        ) {
          clearWorkspaceLock();
        }
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

  const goToTrialExpired = useCallback(
    (message: string, code = "trial_expired") => {
      if (lockingRef.current) return;
      lockingRef.current = true;
      setWorkspaceLock(message, code);
      setOrganization((prev) => {
        if (!prev) return prev;
        if (code === "billing_overdue") return { ...prev, billingStatus: "OVERDUE" };
        if (code === "billing_cancelled") return { ...prev, billingStatus: "CANCELLED" };
        return {
          ...prev,
          billingStatus: "TRIAL",
          trialEndsAt: prev.trialEndsAt ?? new Date(0).toISOString(),
        };
      });
      navigate("/trial-expired", { replace: true });
      window.setTimeout(() => {
        lockingRef.current = false;
      }, 300);
    },
    [navigate],
  );

  const onApiForbidden = useCallback(
    (message?: string, code?: string) => {
      const msg = message?.trim() || "You're not authorized to do so";
      // Never toast — always show the trial/lock screen for org 403s.
      goToTrialExpired(
        /not authorized/i.test(msg)
          ? "Your organization's trial or subscription access has ended. Please ask your admin to upgrade."
          : msg,
        code ?? "trial_expired",
      );
    },
    [goToTrialExpired],
  );

  useEffect(() => {
    setApiAuthHandlers({
      onUnauthorized: () => {
        clearAccessToken();
        clearWorkspaceLock();
        setUser(null);
        setOrganization(null);
        navigate("/login", { replace: true });
      },
      onForbidden: onApiForbidden,
      onOrganizationBlocked: (message) => {
        clearAccessToken();
        clearWorkspaceLock();
        setUser(null);
        setOrganization(null);
        navigate("/account-suspended", { replace: true, state: { message } });
      },
      onWorkspaceLocked: (message, code) => {
        goToTrialExpired(message, code ?? "trial_expired");
      },
    });
  }, [goToTrialExpired, navigate, onApiForbidden]);

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
      if (isWorkspaceLocked(session.organization)) {
        setWorkspaceLock(
          "Your organization's free trial has ended. Please ask your admin to upgrade.",
          "trial_expired",
        );
        navigate("/trial-expired", { replace: true });
        return;
      }
      clearWorkspaceLock();
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
      if (isWorkspaceLocked(session.organization)) {
        setWorkspaceLock(
          "Your organization's free trial has ended. Please ask your admin to upgrade.",
          "trial_expired",
        );
        navigate("/trial-expired", { replace: true });
        return;
      }
      clearWorkspaceLock();
      navigate(homePathForRole(session.user.role), { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    await logoutApi();
    clearWorkspaceLock();
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
