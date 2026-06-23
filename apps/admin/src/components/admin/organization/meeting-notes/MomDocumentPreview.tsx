import { Calendar, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type PreviewSection = {
  title: string;
  description?: string;
  isRequired?: boolean;
};

type MomDocumentPreviewProps = {
  templateName?: string;
  sections: PreviewSection[];
  organizationName?: string;
  className?: string;
  compact?: boolean;
};

const SAMPLE_BY_TITLE: Record<string, string> = {
  "Executive Summary":
    "The team reviewed quarterly goals and aligned on next steps. Budget approval was deferred pending finance review.",
  "Key Discussion Points":
    "• Product roadmap priorities for Q3\n• Customer feedback on the beta release\n• Hiring plan for the engineering team",
  "Decisions Made":
    "• Approved phase 2 launch for April 15\n• Selected vendor A for infrastructure upgrade\n• Deferred pricing changes to next quarter",
  "Action Items":
    "• Alex — Send revised proposal by Friday\n• Priya — Schedule stakeholder demo\n• Team — Review draft by EOD Wednesday",
  "Risks & Blockers":
    "Dependency on third-party API integration may delay the release by one sprint.",
  "Next Steps":
    "Follow-up sync scheduled for next Tuesday. Finance to share updated forecast before then.",
  "Meeting Overview":
    "Weekly sync to review sprint progress, blockers, and upcoming deliverables.",
  "Discussion Summary":
    "The team discussed sprint velocity, open bugs, and the upcoming release checklist.",
  "Strategic Context":
    "Leadership reviewed market conditions and competitive positioning for the second half of the year.",
  "Performance Highlights":
    "Revenue up 12% QoQ. Customer retention improved to 94%. New enterprise deals closed in APAC.",
  "Strategic Decisions":
    "Invest in customer success headcount. Pause non-core product experiments until Q4.",
  "Yesterday's Progress":
    "Completed auth refactor. Fixed 3 critical bugs. Merged payment integration PR.",
  "Today's Plan":
    "Finish API documentation. Start load testing. Review design specs with product.",
  "Blockers":
    "Waiting on legal review for the updated terms of service.",
};

function sampleForSection(title: string): string {
  return (
    SAMPLE_BY_TITLE[title] ??
    "AI will generate this section automatically from your meeting transcript and notes."
  );
}

export function MomDocumentPreview({
  templateName,
  sections,
  organizationName = "Your Organization",
  className,
  compact,
}: MomDocumentPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      )}
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Document preview
            </p>
            <p className="truncate text-xs font-semibold text-slate-800">
              {templateName ?? "Sample meeting notes"}
            </p>
          </div>
        </div>
      </div>

      <div className={cn("overflow-y-auto bg-[#fafafa]", compact ? "max-h-[420px]" : "max-h-[560px]")}>
        <div className="mx-3 my-4 rounded-xl border border-slate-200/90 bg-white px-5 py-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] sm:mx-4">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              {organizationName}
            </p>
            <h3 className="mt-2 text-base font-bold text-slate-900">Minutes of Meeting</h3>
          </div>

          <div className="mt-5 space-y-2 border-y border-slate-100 py-4 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                <span className="font-semibold text-slate-700">Date:</span> June 13, 2026
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                <span className="font-semibold text-slate-700">Meeting:</span> Weekly Team Sync
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                <span className="font-semibold text-slate-700">Attendees:</span> Alex, Priya, Jordan
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {sections.length === 0 ? (
              <p className="text-center text-xs italic text-slate-400">
                Select a template to see how your meeting notes will be structured.
              </p>
            ) : (
              sections.map((section, index) => (
                <div key={`${section.title}-${index}`}>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wide text-slate-800">
                      {section.title}
                    </h4>
                    {section.isRequired === false ? (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  {section.description && !compact ? (
                    <p className="mt-0.5 text-[10px] text-slate-400">{section.description}</p>
                  ) : null}
                  <p className="mt-1.5 whitespace-pre-line text-[11px] leading-relaxed text-slate-500">
                    {sampleForSection(section.title)}
                  </p>
                </div>
              ))
            )}
          </div>

          <p className="mt-6 border-t border-slate-100 pt-3 text-center text-[10px] italic text-slate-400">
            Generated from meeting transcript · Sample content shown
          </p>
        </div>
      </div>
    </div>
  );
}
