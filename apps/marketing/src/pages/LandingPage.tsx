import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Mail,
  MessageSquare,
  Video,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero, featureCards } from "@/components/Hero";
import { appLink, cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Connect & sync",
    body: "Link contact@yourcompany.com via Google OAuth. Auto-track imports Meet events from your calendar.",
  },
  {
    step: "02",
    title: "Join as you always do",
    body: "Open Google Calendar and join the Meet — or use Meeting Desk. The bot records in the background.",
  },
  {
    step: "03",
    title: "Review draft MOM",
    body: "AI transcribes and drafts Minutes with key points, sections, and action items. You edit freely.",
  },
  {
    step: "04",
    title: "Approve & share",
    body: "One click approves and emails the MOM PDF to stakeholders. Export DOCX, TXT, or JSON anytime.",
  },
];

const integrations = [
  { name: "Google Meet", desc: "Calendar import + recording bot on your Meet links" },
  { name: "Microsoft Teams", desc: "Teams meetings with the same MOM & approval flow" },
  { name: "Lyrus Live", desc: "Built-in HD rooms with real-time notes and recording" },
  { name: "Google Calendar", desc: "Auto-sync Meet events from connected accounts" },
];

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    desc: "Small teams getting started with AI meeting notes.",
    features: ["Up to 10 users", "Google Meet & Teams", "MOM approval workflow", "PDF export"],
  },
  {
    name: "Growth",
    price: "₹2,999",
    period: "/month",
    desc: "Growing teams that live in back-to-back calls.",
    features: ["Up to 50 users", "Custom MOM templates", "Calendar auto-track", "Priority support"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "SSO, dedicated support, and org-wide governance.",
    features: ["Unlimited locations", "SLA & onboarding", "Advanced audit logs", "Volume pricing"],
  },
];

const faqs = [
  {
    q: "Can I join from Google Calendar and still get a MOM?",
    a: "Yes. Import the event (or enable auto-track), join from Google Calendar as usual, admit the recording bot, and the platform handles transcription and MOM generation after the call.",
  },
  {
    q: "Is anything sent to attendees without my approval?",
    a: "No. MOMs stay in draft until a reviewer approves. Only then are stakeholders emailed the PDF.",
  },
  {
    q: "Does it work with Microsoft Teams?",
    a: "Yes. Connect Microsoft, schedule or import Teams meetings, and get the same recording and MOM workflow.",
  },
  {
    q: "Where is data stored?",
    a: "Meeting Desk AI is built for business use with secure storage, org isolation, and configurable retention. Contact us for enterprise data residency needs.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-14 space-y-4">
      <p
        className={cn(
          "text-sm font-medium uppercase tracking-[0.14em]",
          dark ? "text-teal-300" : "text-teal-700",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn("text-3xl md:text-4xl font-bold", dark ? "text-white" : "text-[hsl(var(--ink))]")}
      >
        {title}
      </h2>
      <p className={cn("text-lg leading-relaxed", dark ? "text-white/65" : "text-slate-600")}>
        {description}
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Social proof strip */}
        <section className="border-y border-slate-200/80 bg-white py-8" aria-label="Platform highlights">
          <div className="container flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-teal" aria-hidden /> Google Meet & Teams ready
            </span>
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4 text-teal" aria-hidden /> PDF · DOCX · JSON export
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-teal" aria-hidden /> Email on approval only
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-teal" aria-hidden /> Action items → tasks
            </span>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section-pad bg-[hsl(var(--mist))]" aria-labelledby="features-heading">
          <div className="container">
            <SectionHeading
              id="features-heading"
              eyebrow="Features"
              title="Meeting intelligence that respects your process"
              description="Not another note-taker that spams your team. Meeting Desk AI fits how Indian businesses actually close meetings — with a signed-off MOM."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((f, i) => (
                <motion.article
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card hover:shadow-lg hover:border-brand/30 transition-all"
                >
                  <div className="h-11 w-11 rounded-xl bg-teal-soft flex items-center justify-center text-teal-700 mb-4">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section-pad bg-white" aria-labelledby="how-heading">
          <div className="container">
            <SectionHeading
              id="how-heading"
              eyebrow="How it works"
              title="From calendar invite to approved MOM in four steps"
              description="Whether you host on Google Meet or join someone else's call — if it's on your connected calendar, Meeting Desk AI has you covered."
            />
            <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none">
              {steps.map((s, i) => (
                <li
                  key={s.step}
                  className="relative rounded-2xl border border-slate-200 bg-[hsl(var(--mist))] p-6"
                >
                  <span className="font-heading text-4xl font-bold text-brand/25">{s.step}</span>
                  <h3 className="font-heading font-semibold text-lg mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  {i < steps.length - 1 && (
                    <span className="hidden lg:block absolute -right-3 top-1/2 text-slate-300" aria-hidden>
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Integrations */}
        <section
          id="integrations"
          className="section-pad bg-[hsl(var(--navy-deep))] text-white"
          aria-labelledby="integrations-heading"
        >
          <div className="container">
            <SectionHeading
              id="integrations-heading"
              dark
              eyebrow="Integrations"
              title="Works where your meetings already happen"
              description="No rip-and-replace. Connect the calendar you use today and keep your Meet links."
            />
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {integrations.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
                >
                  <h3 className="font-heading font-semibold text-teal-200">{item.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-pad bg-[hsl(var(--mist))]" aria-labelledby="pricing-heading">
          <div className="container">
            <SectionHeading
              id="pricing-heading"
              eyebrow="Pricing"
              title="Simple plans in INR"
              description="14-day free trial on all plans. GST as applicable. Upgrade as your team grows."
            />
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={cn(
                    "rounded-2xl border bg-white p-6 flex flex-col",
                    plan.highlighted
                      ? "border-teal shadow-glow scale-[1.02] md:scale-105"
                      : "border-slate-200 shadow-card",
                  )}
                >
                  {plan.highlighted && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-700 mb-2">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-xl">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4">{plan.desc}</p>
                  <p className="font-heading text-3xl font-bold">
                    {plan.price}
                    <span className="text-base font-normal text-slate-500">{plan.period}</span>
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-600 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-teal mt-0.5" aria-hidden>
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={appLink("/login")}
                    className={cn(
                      "mt-6 block text-center rounded-full py-2.5 text-sm font-semibold transition-colors",
                      plan.highlighted
                        ? "bg-brand text-[hsl(var(--navy-deep))] hover:bg-teal-300"
                        : "border border-slate-200 hover:border-brand hover:text-teal-800",
                    )}
                  >
                    Get started
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-pad bg-white" aria-labelledby="faq-heading">
          <div className="container max-w-3xl">
            <SectionHeading
              id="faq-heading"
              eyebrow="FAQ"
              title="Common questions"
              description="Everything you need to know before rolling out to your team."
            />
            <div className="space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-slate-200 bg-[hsl(var(--mist))] open:bg-white open:shadow-card transition-all"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium text-[hsl(var(--ink))] list-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad bg-[hsl(var(--navy-deep))] text-white" aria-labelledby="cta-heading">
          <div className="container text-center max-w-2xl space-y-6">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold">
              Ready to never write MOMs from scratch again?
            </h2>
            <p className="text-white/65 text-lg">
              Deploy at <strong className="text-white">meetingdesk.in</strong>. Your team gets clarity;
              stakeholders get professional minutes — only when you approve.
            </p>
            <a
              href={appLink("/login")}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-[hsl(var(--navy-deep))] shadow-glow hover:bg-teal-300 transition-colors"
            >
              Start your free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-3 max-w-sm">
            <p className="font-heading font-bold text-lg">
              Meeting Desk <span className="text-teal-700">AI</span>
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI meeting intelligence for teams in India. Record, transcribe, approve, and share Minutes
              of Meeting — across Google Meet, Microsoft Teams, and live rooms.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600" aria-label="Footer">
            <a href="#features" className="hover:text-teal-800">
              Features
            </a>
            <a href="#pricing" className="hover:text-teal-800">
              Pricing
            </a>
            <a href="#faq" className="hover:text-teal-800">
              FAQ
            </a>
            <a href={appLink("/login")} className="hover:text-teal-800">
              Log in
            </a>
            <a href="mailto:contact@virtualedge.in" className="hover:text-teal-800">
              Contact
            </a>
          </nav>
        </div>
        <div className="container mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} Meeting Desk AI. All rights reserved.</p>
          <p>meetingdesk.in</p>
        </div>
      </footer>
    </>
  );
}
