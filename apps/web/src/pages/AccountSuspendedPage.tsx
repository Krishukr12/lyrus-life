import { Link, useLocation } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountSuspendedPage() {
  const location = useLocation();
  const message =
    (location.state as { message?: string } | null)?.message ??
    "Your organization's access has been suspended. Please contact your administrator.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldOff className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Account suspended</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
        <Button className="mt-6 w-full" asChild>
          <Link to="/login">Return to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
