import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getJoinMeetingAccess,
  getJoinMeetingPreview,
  joinMeetingAsGuest,
  type GuestJoinSession,
} from "@/lib/live-api";
import { GuestMeetingRoom } from "@/components/live/GuestMeetingRoom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, ShieldAlert, UserRound, Video } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

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

  // Guest flow state (no platform account required)
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState(searchParams.get("email") ?? "");
  const [guestError, setGuestError] = useState<string | null>(null);
  const [guestJoining, setGuestJoining] = useState(false);
  const [guestSession, setGuestSession] = useState<GuestJoinSession | null>(null);
  const [guestLeft, setGuestLeft] = useState(false);

  const loginRedirect = slug
    ? `/login?redirect=${encodeURIComponent(`/join/${slug}${searchParams.toString() ? `?${searchParams}` : ""}`)}`
    : "/login";

  // Authenticated flow — check invite access and wait for the meeting to go live.
  useEffect(() => {
    if (authLoading || !slug) return;
    if (!isAuthenticated) return;

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

  // Guest flow — load the public meeting preview so guests see what they're joining.
  useEffect(() => {
    if (authLoading || !slug || isAuthenticated) return;
    let cancelled = false;

    void getJoinMeetingPreview(slug)
      .then((preview) => {
        if (cancelled) return;
        setTitle(preview.title);
        setIsLive(preview.isLive);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Meeting not found");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, slug]);

  const handleGuestJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || guestJoining) return;
    const name = guestName.trim();
    const email = guestEmail.trim();
    if (!name || !email) {
      setGuestError("Enter your name and the email address that received the invite.");
      return;
    }

    setGuestJoining(true);
    setGuestError(null);
    try {
      const session = await joinMeetingAsGuest(slug, name, email);
      setGuestLeft(false);
      setGuestSession(session);
    } catch (err) {
      setGuestError(err instanceof Error ? err.message : "Could not join as guest");
    } finally {
      setGuestJoining(false);
    }
  };

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  // Active guest call
  if (guestSession && !guestLeft) {
    return (
      <GuestMeetingRoom
        slug={slug}
        session={guestSession}
        guestName={guestName.trim()}
        guestEmail={guestEmail.trim()}
        onLeave={() => {
          setGuestSession(null);
          setGuestLeft(true);
        }}
      />
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen meeting-room-root flex flex-col items-center justify-center gap-3">
        <div className="meeting-room-ambient pointer-events-none" aria-hidden />
        <BrandMark variant="dark" iconSize={36} className="relative z-10 justify-center opacity-90" showTagline={false} />
        <Loader2 className="h-10 w-10 animate-spin text-secondary relative z-10" />
        <p className="text-sm text-white/70 relative z-10">Checking your invite…</p>
      </div>
    );
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
            Only invited people can join. Ask the host to add your email as a participant.
          </p>
          <Button
            variant="outline"
            className="border-white/20 text-white"
            onClick={() => navigate(isAuthenticated ? "/meetings" : "/login")}
          >
            {isAuthenticated ? "Back to meetings" : "Go to sign in"}
          </Button>
        </Card>
      </div>
    );
  }

  // Guest entry screen (not signed in)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen meeting-room-root flex items-center justify-center p-6">
        <div className="meeting-room-ambient pointer-events-none" aria-hidden />
        <Card className="relative z-10 max-w-md w-full p-8 space-y-5 border-white/10 bg-white/5 backdrop-blur">
          <BrandMark variant="dark" iconSize={36} className="justify-center opacity-90" showTagline={false} />
          <div className="text-center space-y-2">
            <h1 className="text-lg font-heading font-semibold text-white">{title || "Meeting"}</h1>
            <p className="text-sm text-white/60">
              {guestLeft
                ? "You left the meeting. You can rejoin below."
                : isLive
                  ? "This meeting is live. Join as a guest with your invited email."
                  : "Join as a guest with your invited email — you'll wait in the room until the host starts."}
            </p>
          </div>

          <form onSubmit={handleGuestJoin} className="space-y-3 text-left">
            <div className="space-y-1.5">
              <Label className="text-white/70">Your name</Label>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full name"
                className="bg-white/10 border-white/15 text-white placeholder:text-white/35"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70">Invited email</Label>
              <Input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/10 border-white/15 text-white placeholder:text-white/35"
              />
            </div>
            {guestError && <p className="text-sm text-destructive">{guestError}</p>}
            <Button type="submit" variant="secondary" className="w-full gap-2 shine" disabled={guestJoining}>
              {guestJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
              {guestLeft ? "Rejoin as guest" : "Join as guest"}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-wide text-white/35">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 border-white/15 text-white hover:bg-white/10"
            onClick={() => navigate(loginRedirect)}
          >
            <LogIn className="h-4 w-4" />
            Sign in to your account
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen meeting-room-root flex items-center justify-center p-6">
      <div className="meeting-room-ambient pointer-events-none" aria-hidden />
      <Card className="relative z-10 max-w-md w-full p-8 text-center space-y-4 border-white/10 bg-white/5 backdrop-blur">
        <BrandMark variant="dark" iconSize={36} className="justify-center opacity-90" showTagline={false} />
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
