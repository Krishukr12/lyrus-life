import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LiveKitRoom, useRoomContext } from "@livekit/components-react";
import "@livekit/components-styles";
import { LiveMeetingStage } from "@/components/live/LiveMeetingStage";
import { MeetingConnectionGate } from "@/components/live/MeetingConnectionGate";
import { MeetingLobbyBanner } from "@/components/live/MeetingLobbyOverlay";
import { MeetingRoomLayout } from "@/components/live/MeetingRoomLayout";
import { MeetingLeaveDialog, MeetingEndDialog } from "@/components/live/MeetingConfirmDialogs";
import { MeetingHostProvider } from "@/components/live/MeetingHostContext";
import { meetingLiveKitRoomProps } from "@/components/live/livekit-room-props";
import { completeMeetingWithRecording, getMeeting } from "@/lib/api";
import {
  endLiveSession,
  getLiveMeetingStatus,
  joinLiveMeeting,
  refreshLiveToken,
  startLiveMeeting,
} from "@/lib/live-api";
import { useLiveMeetingSocket } from "@/hooks/use-live-meeting-socket";
import { MeetingRoomRecorder, type MeetingRoomRecorderHandle } from "@/components/live/MeetingRoomRecorder";
import { useAuth } from "@/contexts/AuthContext";
import type { Meeting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, LogOut, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MeetingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [liveNotes, setLiveNotes] = useState("");
  const [ending, setEnding] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);
  const [recordingActive, setRecordingActive] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isOrganizerHost, setIsOrganizerHost] = useState(false);
  const [claimHostOnJoin, setClaimHostOnJoin] = useState(false);
  const [startingMeeting, setStartingMeeting] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [recordingTrackCount, setRecordingTrackCount] = useState(0);
  const notesSyncingRef = useRef(false);
  const recorderRef = useRef<MeetingRoomRecorderHandle | null>(null);
  const goLiveRef = useRef<() => void>(() => {});

  goLiveRef.current = () => {
    setIsLive(true);
    toast.success("Meeting is now live");
  };

  const { publishNotes, hostUserId, hostName, participants, isLocalHost } = useLiveMeetingSocket(
    id ?? null,
    {
      userId: user?.id ?? null,
      userName: user?.name ?? null,
      claimHost: claimHostOnJoin,
      onRemoteNotes: (text) => {
        notesSyncingRef.current = true;
        setLiveNotes(text);
        queueMicrotask(() => {
          notesSyncingRef.current = false;
        });
      },
      onMeetingStarted: () => goLiveRef.current(),
      onMeetingAutoEnded: (message) => {
        toast.info(message);
        navigate(`/meetings/${id}`);
      },
    },
  );

  const handleRecordingChange = useCallback((active: boolean, trackCount: number) => {
    setRecordingActive(active);
    setRecordingTrackCount(trackCount);
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function boot() {
      try {
        const m = await getMeeting(id);
        if (!m) {
          setSessionError("Meeting not found");
          return;
        }
        if (!cancelled) setMeeting(m);

        const session = await joinLiveMeeting(id);
        if (cancelled) return;

        setClaimHostOnJoin(session.isHost);
        setIsOrganizerHost(session.isHost);
        setIsLive(session.isLive);
        setLivekitUrl(session.livekitUrl);
        setToken(session.token);
        setJoinUrl(session.joinUrl);
        setSessionStartedAt(session.sessionStartedAt);

        if (!liveNotes.trim() && m.description.trim()) {
          setLiveNotes(`Host: ${m.description.trim()}`);
        }
      } catch (err) {
        if (!cancelled) {
          setSessionError(err instanceof Error ? err.message : "Could not join the meeting room");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!id || isLive) return;
    const timer = setInterval(() => {
      void getLiveMeetingStatus(id)
        .then((status) => {
          if (status.isLive) goLiveRef.current();
        })
        .catch(() => {
          /* ignore */
        });
    }, 5000);
    return () => clearInterval(timer);
  }, [id, isLive]);

  const handleNotesChange = (value: string) => {
    setLiveNotes(value);
    if (!notesSyncingRef.current) {
      publishNotes(value);
    }
  };

  const handleStartForEveryone = async () => {
    if (!id || startingMeeting) return;
    setStartingMeeting(true);
    try {
      const session = await startLiveMeeting(id);
      setIsLive(true);
      setJoinUrl(session.joinUrl);
      if (session.sessionStartedAt) setSessionStartedAt(session.sessionStartedAt);
      goLiveRef.current();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start meeting");
    } finally {
      setStartingMeeting(false);
    }
  };

  const copyJoinLink = async () => {
    if (!joinUrl) return;
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success("Join link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleEndMeeting = useCallback(async () => {
    if (!id || !meeting || ending) return;
    setEnding(true);
    setProcessing(true);

    try {
      const recording = (await recorderRef.current?.stopRecording()) ?? null;
      const { socketNotes } = await endLiveSession(id).catch(() => ({ socketNotes: "" }));

      const combinedNotes = [meeting.notes?.trim(), liveNotes.trim(), socketNotes.trim()]
        .filter(Boolean)
        .join("\n");

      toast.loading("Uploading recording and generating MOM...", { id: "mom-gen" });
      const result = await completeMeetingWithRecording(id, recording, combinedNotes);
      toast.dismiss("mom-gen");

      if (recording && recording.size > 5000) {
        toast.success("Recording processed from all participants");
      } else if (result.meeting.mom) {
        toast.success("MOM generated from recording");
      } else if (!recording || recording.size <= 5000) {
        toast.error("No usable recording — MOM was not generated from notes");
      }
      if (result.meeting.mom) {
        toast.info("Review and approve the MOM on the meeting page.");
      }

      navigate(`/meetings/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to complete meeting");
      setProcessing(false);
    } finally {
      setEnding(false);
    }
  }, [ending, id, liveNotes, meeting, navigate]);

  if (loading) {
    return <MeetingRoomOverlay message="Joining meeting room…" />;
  }

  if (sessionError || !livekitUrl || !token || !meeting) {
    return (
      <MeetingRoomOverlay message={sessionError ?? "Could not connect to the meeting room"}>
        <Button variant="outline" className="border-white/20 text-white" onClick={() => navigate(`/meetings/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to meeting
        </Button>
      </MeetingRoomOverlay>
    );
  }

  if (processing) {
    return (
      <MeetingRoomOverlay
        message="Uploading recording and generating minutes…"
        detail="This can take a minute for cloud transcription. Please keep this tab open."
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 meeting-room-root">
      <LiveKitRoom
        serverUrl={livekitUrl}
        token={token}
        className="h-full w-full flex flex-col lk-room"
        data-lk-theme="default"
        {...meetingLiveKitRoomProps}
      >
        <MeetingHostProvider hostUserId={hostUserId} hostName={hostName}>
          <MeetingRoomRecorder
            ref={recorderRef}
            enabled={isOrganizerHost}
            onRecordingChange={handleRecordingChange}
          />
          <MeetingRoomShell
            meetingId={id!}
            meetingTitle={meeting.title}
            joinUrl={joinUrl}
            isLive={isLive}
            isOrganizerHost={isOrganizerHost}
            hostUserId={hostUserId}
            hostName={hostName}
            participants={participants}
            isLocalHost={isLocalHost}
            localUserId={user?.id ?? null}
            liveNotes={liveNotes}
            notesOpen={notesOpen}
            onNotesOpenChange={setNotesOpen}
            onNotesChange={handleNotesChange}
            recordingActive={recordingActive}
            recordingTrackCount={recordingTrackCount}
            sessionStartedAt={sessionStartedAt}
            ending={ending}
            startingMeeting={startingMeeting}
            onStartForEveryone={() => void handleStartForEveryone()}
            onCopyJoinLink={() => void copyJoinLink()}
            onLeave={() => navigate(`/meetings/${id}`)}
            onEndMeeting={() => void handleEndMeeting()}
          />
        </MeetingHostProvider>
      </LiveKitRoom>
    </div>
  );
}

function MeetingRoomOverlay({
  message,
  detail,
  children,
}: {
  message: string;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 meeting-room-root flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="meeting-room-ambient pointer-events-none" aria-hidden />
      <Loader2 className="h-11 w-11 animate-spin text-secondary relative z-10" />
      <p className="text-white font-medium relative z-10">{message}</p>
      {detail && <p className="text-sm text-white/50 max-w-md relative z-10">{detail}</p>}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

type MeetingRoomShellProps = {
  meetingId: string;
  meetingTitle: string;
  joinUrl: string | null;
  isLive: boolean;
  isOrganizerHost: boolean;
  hostUserId: string | null;
  hostName: string | null;
  participants: { userId: string; userName: string }[];
  isLocalHost: boolean;
  localUserId: string | null;
  liveNotes: string;
  notesOpen: boolean;
  onNotesOpenChange: (open: boolean) => void;
  onNotesChange: (value: string) => void;
  recordingActive: boolean;
  recordingTrackCount: number;
  sessionStartedAt: string | null;
  ending: boolean;
  startingMeeting: boolean;
  onStartForEveryone: () => void;
  onCopyJoinLink: () => void;
  onLeave: () => void;
  onEndMeeting: () => void;
};

function MeetingRoomShell({
  meetingId,
  meetingTitle,
  joinUrl,
  isLive,
  isOrganizerHost,
  hostUserId,
  hostName,
  participants,
  isLocalHost,
  localUserId,
  liveNotes,
  notesOpen,
  onNotesOpenChange,
  onNotesChange,
  recordingActive,
  recordingTrackCount,
  sessionStartedAt,
  ending,
  startingMeeting,
  onStartForEveryone,
  onCopyJoinLink,
  onLeave,
  onEndMeeting,
}: MeetingRoomShellProps) {
  const room = useRoomContext();
  const [reconnecting, setReconnecting] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const confirmLeave = () => {
    setLeaveOpen(false);
    void room.disconnect();
    onLeave();
  };

  const [endOpen, setEndOpen] = useState(false);

  const confirmEnd = () => {
    setEndOpen(false);
    onEndMeeting();
  };

  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      const session = await refreshLiveToken(meetingId);
      await room.connect(session.livekitUrl, session.token);
      toast.success("Reconnected to the video room");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reconnect");
    } finally {
      setReconnecting(false);
    }
  };

  const canEndForEveryone = isLocalHost;

  return (
    <>
      <MeetingRoomLayout
        title={meetingTitle}
        hostUserId={hostUserId}
        hostName={hostName}
        isLocalHost={isLocalHost}
        localUserId={localUserId}
        participants={participants}
        notesOpen={notesOpen}
        onNotesOpenChange={onNotesOpenChange}
        liveNotes={liveNotes}
        onNotesChange={onNotesChange}
        joinUrl={joinUrl}
        onCopyJoinLink={onCopyJoinLink}
        recordingActive={recordingActive}
        recordingTrackCount={recordingTrackCount}
        sessionStartedAt={sessionStartedAt}
        isLive={isLive}
        video={
          <div className="relative flex flex-1 flex-col min-h-0 min-w-0 h-full">
            <MeetingConnectionGate onReconnect={() => void handleReconnect()} reconnecting={reconnecting}>
              {(mediaReady) => (
                <LiveMeetingStage
                  mediaReady={mediaReady}
                  controlBarExtras={
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn("meeting-action-btn meeting-action-btn--leave")}
                        onClick={() => setLeaveOpen(true)}
                      >
                        <LogOut className="h-4 w-4" />
                        Leave
                      </Button>
                      {canEndForEveryone && (
                        <Button
                          type="button"
                          size="sm"
                          className={cn("meeting-action-btn meeting-action-btn--end")}
                          onClick={() => setEndOpen(true)}
                          disabled={ending}
                        >
                          {ending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <PhoneOff className="h-4 w-4" />
                          )}
                          End meeting
                        </Button>
                      )}
                    </>
                  }
                />
              )}
            </MeetingConnectionGate>

            {!isLive && (
              <MeetingLobbyBanner
                isHost={isOrganizerHost}
                starting={startingMeeting}
                onStartMeeting={isOrganizerHost ? onStartForEveryone : undefined}
              />
            )}
          </div>
        }
      />

      <MeetingLeaveDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        onConfirm={confirmLeave}
        isHost={isLocalHost && isLive}
      />
      <MeetingEndDialog
        open={endOpen}
        onOpenChange={setEndOpen}
        onConfirm={confirmEnd}
        ending={ending}
        inWaitingRoom={!isLive}
      />
    </>
  );
}
