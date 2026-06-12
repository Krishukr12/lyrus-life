import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LeaveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isHost: boolean;
};

export function MeetingLeaveDialog({ open, onOpenChange, onConfirm, isHost }: LeaveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-white/10 bg-[#141a26] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this meeting?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/60">
            {isHost
              ? "You are the host. If you leave, host controls will pass to another participant automatically. The meeting stays live until someone ends it."
              : "You will disconnect from video and audio. You can rejoin from your invite link while the meeting is live."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/15 bg-transparent text-white hover:bg-white/10">
            Stay in meeting
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-white/10 text-white hover:bg-white/20"
            onClick={onConfirm}
          >
            Leave meeting
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type EndDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  ending: boolean;
  inWaitingRoom?: boolean;
};

export function MeetingEndDialog({
  open,
  onOpenChange,
  onConfirm,
  ending,
  inWaitingRoom = false,
}: EndDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-red-500/30 bg-[#141a26] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>End meeting for everyone?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/60">
            {inWaitingRoom
              ? "This closes the waiting room and live session for everyone, uploads the mixed audio from all participants, and generates minutes. This cannot be undone."
              : "This stops the live session for all participants, uploads the mixed audio from everyone, and starts minutes generation. This cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-white/15 bg-transparent text-white hover:bg-white/10"
            disabled={ending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-500"
            disabled={ending}
            onClick={onConfirm}
          >
            {ending ? "Ending…" : "End meeting"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
