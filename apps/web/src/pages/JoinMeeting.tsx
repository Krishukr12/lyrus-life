import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getJoinMeetingAccess } from "@/lib/live-api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ShieldAlert, Video } from "lucide-react";

export default function JoinMeeting() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const loginRedirect = slug
    ? `/login?redirect=${encodeURIComponent(`/join/${slug}${searchParams.toString() ? `?${searchParams}` : ""}`)}`
    : "/login";

  useEffect(() => {
    if (authLoading || !slug) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | undefined;

    async function checkAccess() {
      try {
        const access = await getJoinMeetingAccess(slug!);
        if (cancelled) return;
        setTitle(access.title);
        setIsLive(access.isLive);
        setMeetingId(access.meetingId);
        setError(null);

        if (access.isLive) {
          navigate(access.joinPath, { replace: true });
          return;
        }

        pollTimer = setInterval(() => {
          void getJoinMeetingAccess(slug!)
            .then((next) => {
              if (cancelled) return;
              setIsLive(next.isLive);
              if (next.isLive) {
                navigate(next.joinPath, { replace: true });
              }
            })
            .catch(() => {
              /* ignore transient poll errors */
            });
        }, 5000);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "You cannot join this meeting");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void checkAccess();
    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [authLoading, isAuthenticated, slug, navigate]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div className="min-h-screen meeting-room-root flex flex-col items-center justify-center gap-3">
        <div className="meeting-room-ambient pointer-events-none" aria-hidden />
        <Loader2 className="h-10 w-10 animate-spin text-secondary relative z-10" />
        <p className="text-sm text-white/70 relative z-10">Checking your invite…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginRedirect} replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen meeting-room-root flex items-center justify-center p-6">
        <div className="meeting-room-ambient pointer-events-none" aria-hidden />
        <Card className="relative z-10 max-w-md w-full p-8 text-center space-y-4 border-white/10 bg-white/5 backdrop-blur">
          <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-lg font-semibold text-white">Cannot join this meeting</h1>
          <p className="text-sm text-white/60">{error}</p>
          <p className="text-xs text-white/40">
            Only invited people with your organization email can join. Ask the host to add you as a
            participant.
          </p>
          <Button variant="outline" className="border-white/20 text-white" onClick={() => navigate("/meetings")}>
            Back to meetings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen meeting-room-root flex items-center justify-center p-6">
      <div className="meeting-room-ambient pointer-events-none" aria-hidden />
      <Card className="relative z-10 max-w-md w-full p-8 text-center space-y-4 border-white/10 bg-white/5 backdrop-blur">
        <Video className="h-10 w-10 text-secondary mx-auto" />
        <h1 className="text-lg font-heading font-semibold text-white">{title || "Meeting"}</h1>
        <p className="text-sm text-white/60">
          {isLive
            ? "Connecting you to the room…"
            : "Join the waiting room to talk with others before the host starts, or stay here — you will switch to the official live session automatically when they go live."}
        </p>
        {meetingId && (
          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/meetings/${meetingId}/live`)}
            >
              Join waiting room
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/15 text-white hover:bg-white/10"
              onClick={() => navigate(`/meetings/${meetingId}`)}
            >
              View meeting details
            </Button>
          </div>
        )}
        <Loader2 className="h-6 w-6 animate-spin text-secondary mx-auto" />
      </Card>
    </div>
  );
}
