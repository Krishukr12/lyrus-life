import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  FileText,
  Mic,
  ShieldCheck,
  Users,
} from "lucide-react";
import { appLink } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-navy-deep text-white pt-24 pb-0 md:pt-28">
      <div className="absolute inset-0 bg-hero-mesh pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 bg-grid-fade bg-grid opacity-50 pointer-events-none"
        aria-hidden
      />
      <div className="absolute inset-0 noise opacity-40 mix-blend-overlay pointer-events-none" aria-hidden />

      <div className="container relative flex flex-col min-h-[calc(100svh-6rem)]">
        <div className="flex-1 flex flex-col justify-center max-w-3xl pt-6 pb-12 md:pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-[2.35rem] sm:text-5xl lg:text-[3.65rem] font-bold leading-[1.05] tracking-tight text-balance"
          >
            Every meeting ends with an{" "}
            <span className="text-gradient">approved MOM</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-6 text-lg md:text-xl text-white/65 max-w-xl leading-relaxed"
          >
            Record Google Meet & Teams, draft Minutes with action items, and share
            only after you approve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <a
              href={appLink("/login")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-navy-deep shadow-glow hover:bg-teal-300 transition-colors"
            >
              Start 14-day free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-white/85 hover:bg-white/[0.06] transition-colors"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl mx-auto"
          aria-hidden
        >
          <HeroStage />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStage() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-8 -top-16 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent pointer-events-none z-10" />

      <div className="rounded-t-2xl md:rounded-t-3xl border border-white/10 border-b-0 bg-navy/90 backdrop-blur-xl shadow-soft overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/8 px-5 py-3.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex-1 text-center">
            <span className="font-mono text-[11px] text-white/35 tracking-wide">
              meetingdesk.in · Product roadmap review
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-teal-200/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Recording
          </span>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] min-h-[280px] md:min-h-[340px]">
          <div className="p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40 mb-2">
                Live · Google Meet
              </p>
              <p className="font-heading text-xl font-semibold text-white">
                Product roadmap review
              </p>
            </div>

            <Waveform />

            <div className="flex items-center gap-6 text-[11px] text-white/40">
              {["Connect", "Live", "Ended", "Transcribe", "MOM"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={
                      i < 4
                        ? "h-1.5 w-1.5 rounded-full bg-brand"
                        : "h-1.5 w-1.5 rounded-full border border-white/30"
                    }
                  />
                  <span className={i === 3 ? "text-teal-200" : undefined}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-white/[0.02] flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40 mb-4">
              Draft MOM
            </p>
            <div className="space-y-3 flex-1">
              <p className="text-sm text-white/75 leading-relaxed">
                Agreed on Q2 launch scope and ownership.
              </p>
              <p className="text-sm text-white/75 leading-relaxed">
                Budget review deferred to finance for next week.
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Action: Priya to circulate revised timeline by Friday.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-[11px]">
              <span className="text-brand/90 font-medium">Awaiting approval</span>
              <span className="text-white/35">PDF · DOCX · Email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Waveform() {
  const bars = [28, 52, 38, 72, 44, 88, 56, 94, 48, 76, 40, 64, 34, 58, 46];
  return (
    <div className="flex items-end gap-1 h-16 my-8" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-brand/25 to-brand origin-bottom animate-waveform"
          style={{
            height: `${h}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export const featureCards = [
  {
    icon: Calendar,
    title: "Calendar-native",
    description:
      "Connect Google Calendar. Meet events auto-import — join from Google Calendar or the platform, same link.",
  },
  {
    icon: Bot,
    title: "Recording bot",
    description:
      "A bot joins Google Meet & Teams, records audio, and leaves when everyone else does.",
  },
  {
    icon: Mic,
    title: "AI transcription",
    description:
      "Speaker-aware transcripts merged across re-joins. One continuous record per meeting.",
  },
  {
    icon: FileText,
    title: "Smart MOM drafts",
    description:
      "Key points, template sections, and action items extracted using your org MOM templates.",
  },
  {
    icon: ShieldCheck,
    title: "Approval gate",
    description:
      "Edit the draft, then approve. Stakeholders receive the PDF only after you sign off.",
  },
  {
    icon: Users,
    title: "Team workspaces",
    description:
      "Multi-tenant orgs, roles, tasks from action items, and audit-friendly workflows.",
  },
];
