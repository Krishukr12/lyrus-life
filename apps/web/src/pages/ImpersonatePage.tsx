import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { fetchCurrentSession } from "@/lib/auth-api";
import { setAccessToken } from "@/lib/token-store";

export default function ImpersonatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;

    async function run() {
      setAccessToken(token);
      try {
        const session = await fetchCurrentSession();
        if (cancelled) return;
        if (!session?.user) {
          setError("Impersonation session could not be established.");
          return;
        }
        navigate("/organization", { replace: true });
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Impersonation failed");
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm font-medium text-slate-900">Unable to sign in</p>
        <p className="max-w-md text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-slate-600">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <p className="text-sm">Opening tenant portal…</p>
    </div>
  );
}
