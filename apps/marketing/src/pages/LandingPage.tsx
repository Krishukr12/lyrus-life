import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { LogoIcon } from "@/components/BrandMark";
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
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  id?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl mb-16 space-y-4",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      <p
        className={cn(
          "text-[12px] font-semibold uppercase tracking-[0.18em]",
          dark ? "text-brand" : "text-teal-700",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "text-3xl md:text-[2.65rem] font-bold leading-[1.12] text-balance",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-lg leading-relaxed",
          dark ? "text-white/60" : "text-slate-600",
          align === "center" && "mx-auto",
        )}
      >
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

        {/* Features */}
        <section
          id="features"
          className="section-pad bg-mist"
          aria-labelledby="features-heading"
        >
          <div className="container">
            <SectionHeading
              id="features-heading"
              eyebrow="Features"
              title="Meeting intelligence that respects your process"
              description="Not another note-taker that spams your team. Meeting Desk AI fits how Indian businesses close meetings — with a signed-off MOM."
            />

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-0 border-t border-slate-200/90">
              {featureCards.map((f, i) => (
                <motion.article
                  key={f.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  className={cn(
                    "group py-8 md:py-10 border-b border-slate-200/90",
                    i % 2 === 0 && "md:pr-8 md:border-r",
                    i % 2 === 1 && "md:pl-8",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-soft text-teal-800 transition-colors group-hover:bg-brand group-hover:text-navy-deep">
                      <f.icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                        {f.title}
                      </h3>
                      <p className="text-slate-600 text-[15px] leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="section-pad bg-white"
          aria-labelledby="how-heading"
        >
          <div className="container">
            <SectionHeading
              id="how-heading"
              eyebrow="How it works"
              title="From calendar invite to approved MOM"
              description="Whether you host on Google Meet or join someone else's call — if it's on your connected calendar, Meeting Desk AI has you covered."
            />

            <ol className="relative max-w-3xl mx-auto list-none space-y-0">
              <div
                className="absolute left-[1.15rem] top-3 bottom-3 w-px bg-gradient-to-b from-brand via-slate-200 to-slate-200 md:left-[1.4rem]"
                aria-hidden
              />
              {steps.map((s, i) => (
                <motion.li
                  key={s.step}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                  className="relative flex gap-5 md:gap-7 pb-10 last:pb-0"
                >
                  <span className="relative z-10 flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-navy-deep font-heading text-xs md:text-sm font-bold text-brand ring-4 ring-white">
                    {s.step}
                  </span>
                  <div className="pt-1 md:pt-2">
                    <h3 className="font-heading font-semibold text-lg md:text-xl text-ink mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed max-w-lg">
                      {s.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Integrations */}
        <section
          id="integrations"
          className="section-pad bg-navy-deep text-white relative overflow-hidden"
          aria-labelledby="integrations-heading"
        >
          <div
            className="absolute inset-0 bg-hero-mesh opacity-70 pointer-events-none"
            aria-hidden
          />
          <div className="container relative">
            <SectionHeading
              id="integrations-heading"
              dark
              align="left"
              eyebrow="Integrations"
              title="Works where your meetings already happen"
              description="No rip-and-replace. Connect the calendar you use today and keep your Meet links."
            />

            <div className="grid sm:grid-cols-2 border-t border-white/10">
              {integrations.map((item, i) => (
                <div
                  key={item.name}
                  className={cn(
                    "py-8 border-b border-white/10",
                    i % 2 === 0 ? "sm:pr-10 sm:border-r" : "sm:pl-10",
                  )}
                >
                  <h3 className="font-heading font-semibold text-xl text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[15px] text-white/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="section-pad bg-mist"
          aria-labelledby="pricing-heading"
        >
          <div className="container">
            <SectionHeading
              id="pricing-heading"
              eyebrow="Pricing"
              title="Simple plans in INR"
              description="14-day free trial on all plans. GST as applicable. Upgrade as your team grows."
            />
            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={cn(
                    "rounded-2xl p-7 flex flex-col transition-shadow",
                    plan.highlighted
                      ? "bg-navy-deep text-white shadow-glow ring-1 ring-brand/40"
                      : "bg-white border border-slate-200/90 shadow-card",
                  )}
                >
                  {plan.highlighted && (
                    <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-brand mb-3">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-xl">{plan.name}</h3>
                  <p
                    className={cn(
                      "text-sm mt-1.5 mb-5",
                      plan.highlighted ? "text-white/55" : "text-slate-500",
                    )}
                  >
                    {plan.desc}
                  </p>
                  <p className="font-heading text-3xl font-bold tracking-tight">
                    {plan.price}
                    <span
                      className={cn(
                        "text-base font-normal",
                        plan.highlighted ? "text-white/45" : "text-slate-500",
                      )}
                    >
                      {plan.period}
                    </span>
                  </p>
                  <ul
                    className={cn(
                      "mt-7 space-y-2.5 text-sm flex-1",
                      plan.highlighted ? "text-white/70" : "text-slate-600",
                    )}
                  >
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-0.5",
                            plan.highlighted ? "text-brand" : "text-teal-700",
                          )}
                          aria-hidden
                        >
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={appLink("/login")}
                    className={cn(
                      "mt-8 block text-center rounded-full py-3 text-sm font-semibold transition-colors",
                      plan.highlighted
                        ? "bg-brand text-navy-deep hover:bg-teal-300"
                        : "border border-slate-200 text-ink hover:border-brand hover:text-teal-800",
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
          <div className="container max-w-2xl">
            <SectionHeading
              id="faq-heading"
              eyebrow="FAQ"
              title="Common questions"
              description="Everything you need to know before rolling out to your team."
            />
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((item) => (
                <details key={item.q} className="group py-1">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-medium text-ink list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] md:text-base leading-snug pr-2">
                      {item.q}
                    </span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-5 text-[15px] text-slate-600 leading-relaxed -mt-1">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden bg-navy-deep text-white py-24 md:py-32"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 bg-hero-mesh pointer-events-none" aria-hidden />
          <div className="container relative text-center max-w-2xl space-y-7">
            <h2
              id="cta-heading"
              className="text-3xl md:text-[2.75rem] font-bold leading-[1.12] text-balance"
            >
              Ready to never write MOMs from scratch again?
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Deploy at{" "}
              <span className="text-white font-medium">meetingdesk.in</span>. Your team
              gets clarity; stakeholders get professional minutes — only when you approve.
            </p>
            <a
              href={appLink("/login")}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-navy-deep shadow-glow hover:bg-teal-300 transition-colors"
            >
              Start your free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-14">
        <div className="container flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={32} className="rounded-xl ring-1 ring-slate-200/80" />
              <div className="leading-tight">
                <p className="font-heading font-bold text-lg tracking-tight">
                  Meeting Desk <span className="text-teal-700">AI</span>
                </p>
                <p className="text-[11px] text-slate-400 tracking-wide">by Virtual Edge</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI meeting intelligence for teams in India. Record, transcribe, approve, and
              share Minutes of Meeting — across Google Meet, Microsoft Teams, and live rooms.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600"
            aria-label="Footer"
          >
            <a href="#features" className="hover:text-teal-800 transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-teal-800 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-teal-800 transition-colors">
              FAQ
            </a>
            <a href={appLink("/login")} className="hover:text-teal-800 transition-colors">
              Log in
            </a>
            <a
              href="mailto:contact@virtualedge.in"
              className="hover:text-teal-800 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="container mt-10 pt-8 border-t border-slate-100 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} Meeting Desk AI. All rights reserved.</p>
          <p>meetingdesk.in</p>
        </div>
      </footer>
    </>
  );
}
