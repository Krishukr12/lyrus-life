import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  FileText,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { appLink } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--navy-deep))] text-white pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 bg-hero-mesh pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 bg-grid-fade bg-grid opacity-40 pointer-events-none"
        aria-hidden
      />

      <div className="container relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-teal-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Built for Google Meet, Teams & live calls
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-tight">
            Every meeting ends with an{" "}
            <span className="text-gradient">approved MOM</span> — not another forgotten call
          </h1>

          <p className="text-lg text-white/70 max-w-xl leading-relaxed">
            Meeting Desk AI records your calls, drafts Minutes of Meeting with action items, and
            waits for your approval before anything goes to stakeholders. Connect your calendar once —
            join from Google Calendar as usual.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={appLink("/login")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-[hsl(var(--navy-deep))] shadow-glow hover:bg-teal-300 transition-colors"
            >
              Start 14-day free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white/90 hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55" aria-label="Key benefits">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal" aria-hidden /> No credit card required
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal" aria-hidden /> India-ready billing (INR)
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal" aria-hidden /> GDPR-minded approval gate
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <ProductPreview />
        </motion.div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative animate-float" aria-hidden>
      <div className="rounded-2xl border border-white/10 bg-[hsl(var(--navy))]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[10px] text-white/40 font-mono">meetingdesk.in / Q2 planning</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Live · Google Meet</p>
              <p className="font-heading font-semibold text-white">Product roadmap review</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] bg-brand/20 text-teal-200 px-2 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              Recording
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] text-white/45">
            {["Connect", "Live", "Ended", "Transcribe", "MOM"].map((s, i) => (
              <div key={s} className="space-y-1">
                <div
                  className={`mx-auto h-6 w-6 rounded-full flex items-center justify-center text-[8px] ${
                    i <= 3 ? "bg-teal text-[hsl(var(--navy-deep))]" : "border border-white/20"
                  }`}
                >
                  {i <= 3 ? "✓" : "5"}
                </div>
                <span className={i === 3 ? "text-teal-200" : ""}>{s}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Draft MOM</p>
            <p className="text-xs text-white/75">• Agreed on Q2 launch scope</p>
            <p className="text-xs text-white/75">• Budget review deferred to finance</p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[10px] text-amber-200/90 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Awaiting approval
              </span>
              <span className="text-[10px] text-white/40">PDF · DOCX · Email</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-1/4 rounded-xl border border-white/10 bg-[hsl(var(--navy))] p-3 shadow-xl hidden sm:block">
        <Bot className="h-5 w-5 text-teal mb-1" />
        <p className="text-[10px] text-white/60">Bot joined Meet</p>
      </div>
      <div className="absolute -right-2 bottom-8 rounded-xl border border-white/10 bg-[hsl(var(--navy))] p-3 shadow-xl hidden sm:block">
        <FileText className="h-5 w-5 text-teal mb-1" />
        <p className="text-[10px] text-white/60">MOM generated</p>
      </div>
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
    description: "Speaker-aware transcripts merged across re-joins. One continuous record per meeting.",
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
    description: "Multi-tenant orgs, roles, tasks from action items, and audit-friendly workflows.",
  },
];
