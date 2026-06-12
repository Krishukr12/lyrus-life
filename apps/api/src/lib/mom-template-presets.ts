import type { MomTemplateCategory } from "@lyrus/shared";

export interface MomTemplatePresetSection {
  title: string;
  description: string;
  aiInstructions: string;
  isRequired: boolean;
}

export interface MomTemplatePreset {
  key: string;
  name: string;
  description: string;
  category: MomTemplateCategory;
  accentColor: string;
  icon: string;
  sections: MomTemplatePresetSection[];
}

export const MOM_TEMPLATE_PRESETS: MomTemplatePreset[] = [
  {
    key: "general-business",
    name: "General Business Meetings",
    description: "Balanced structure for cross-functional meetings, reviews, and planning sessions.",
    category: "GENERAL_BUSINESS",
    accentColor: "#2563eb",
    icon: "briefcase",
    sections: [
      {
        title: "Executive Summary",
        description: "High-level overview of the meeting outcomes.",
        aiInstructions: "Generate a concise executive summary covering purpose, outcomes, and next focus.",
        isRequired: true,
      },
      {
        title: "Key Discussion Points",
        description: "Main topics discussed during the meeting.",
        aiInstructions: "List the most important discussion points with brief context for each.",
        isRequired: true,
      },
      {
        title: "Decisions Made",
        description: "Formal decisions and agreements reached.",
        aiInstructions: "List key decisions with context, owners, and rationale where available.",
        isRequired: true,
      },
      {
        title: "Action Items",
        description: "Tasks assigned with owners and deadlines.",
        aiInstructions: "Extract tasks, owners, and deadlines. Use clear, actionable language.",
        isRequired: true,
      },
      {
        title: "Risks & Blockers",
        description: "Issues that may impact progress.",
        aiInstructions: "Identify risks, blockers, and dependencies mentioned during the meeting.",
        isRequired: false,
      },
      {
        title: "Next Steps",
        description: "Follow-up actions and upcoming milestones.",
        aiInstructions: "Summarize immediate follow-ups and proposed next meeting topics.",
        isRequired: false,
      },
    ],
  },
  {
    key: "engineering-standup",
    name: "Engineering Standups",
    description: "Daily standup format focused on progress, blockers, and sprint alignment.",
    category: "ENGINEERING_STANDUP",
    accentColor: "#7c3aed",
    icon: "code",
    sections: [
      {
        title: "Sprint Context",
        description: "Current sprint goals and focus areas.",
        aiInstructions: "Summarize sprint goals and team focus for this standup.",
        isRequired: true,
      },
      {
        title: "Yesterday / Completed",
        description: "Work completed since the last standup.",
        aiInstructions: "List completed work items and progress updates per team member.",
        isRequired: true,
      },
      {
        title: "Today / In Progress",
        description: "Planned work for today.",
        aiInstructions: "List in-progress and planned work items with owners.",
        isRequired: true,
      },
      {
        title: "Blockers",
        description: "Impediments requiring resolution.",
        aiInstructions: "Identify blockers, dependencies, and items needing escalation.",
        isRequired: true,
      },
      {
        title: "Technical Notes",
        description: "Architecture, design, or implementation notes.",
        aiInstructions: "Capture technical decisions, trade-offs, and implementation notes.",
        isRequired: false,
      },
    ],
  },
  {
    key: "project-management",
    name: "Project Management",
    description: "PMO-style meetings with milestones, RAID logs, and stakeholder updates.",
    category: "PROJECT_MANAGEMENT",
    accentColor: "#0891b2",
    icon: "kanban",
    sections: [
      {
        title: "Project Status",
        description: "Overall health and milestone progress.",
        aiInstructions: "Summarize project status, timeline health, and milestone progress.",
        isRequired: true,
      },
      {
        title: "Milestone Updates",
        description: "Progress against key deliverables.",
        aiInstructions: "List milestone updates with status, dates, and responsible owners.",
        isRequired: true,
      },
      {
        title: "RAID Log",
        description: "Risks, assumptions, issues, and dependencies.",
        aiInstructions: "Identify risks, assumptions, issues, and dependencies with severity.",
        isRequired: true,
      },
      {
        title: "Action Items",
        description: "Assigned follow-ups and owners.",
        aiInstructions: "Extract tasks, owners, and deadlines with priority where stated.",
        isRequired: true,
      },
      {
        title: "Stakeholder Updates",
        description: "Communications and decisions for stakeholders.",
        aiInstructions: "Summarize stakeholder-relevant updates and communication needs.",
        isRequired: false,
      },
    ],
  },
  {
    key: "sales",
    name: "Sales Meetings",
    description: "Client-facing and pipeline meetings with deal intelligence.",
    category: "SALES",
    accentColor: "#ea580c",
    icon: "trending-up",
    sections: [
      {
        title: "Meeting Objective",
        description: "Purpose and desired outcomes.",
        aiInstructions: "State the meeting objective and whether it was achieved.",
        isRequired: true,
      },
      {
        title: "Client Needs & Pain Points",
        description: "Customer requirements and challenges discussed.",
        aiInstructions: "Capture client needs, pain points, and buying signals.",
        isRequired: true,
      },
      {
        title: "Solution Discussion",
        description: "Proposed solutions and value proposition.",
        aiInstructions: "Summarize solutions discussed and value propositions presented.",
        isRequired: true,
      },
      {
        title: "Objections & Responses",
        description: "Concerns raised and how they were addressed.",
        aiInstructions: "List objections raised and responses or commitments made.",
        isRequired: false,
      },
      {
        title: "Next Steps & Follow-ups",
        description: "Pipeline actions and follow-up schedule.",
        aiInstructions: "Extract follow-up actions, owners, and proposed next touchpoints.",
        isRequired: true,
      },
    ],
  },
  {
    key: "hr-interview",
    name: "HR Interviews",
    description: "Structured interview notes with competency and recommendation sections.",
    category: "HR_INTERVIEW",
    accentColor: "#db2777",
    icon: "users",
    sections: [
      {
        title: "Candidate Overview",
        description: "Role, background, and interview context.",
        aiInstructions: "Summarize candidate background, role applied for, and interview panel.",
        isRequired: true,
      },
      {
        title: "Competency Assessment",
        description: "Skills and experience evaluation.",
        aiInstructions: "Assess competencies discussed with evidence from the conversation.",
        isRequired: true,
      },
      {
        title: "Strengths",
        description: "Notable strengths demonstrated.",
        aiInstructions: "List candidate strengths with supporting examples from the interview.",
        isRequired: true,
      },
      {
        title: "Areas for Development",
        description: "Gaps or concerns identified.",
        aiInstructions: "Identify development areas or concerns with specific examples.",
        isRequired: false,
      },
      {
        title: "Recommendation",
        description: "Hiring recommendation and rationale.",
        aiInstructions: "Provide a hiring recommendation with clear rationale based on discussion.",
        isRequired: true,
      },
    ],
  },
  {
    key: "leadership-review",
    name: "Leadership Reviews",
    description: "Executive reviews with strategic decisions and organizational priorities.",
    category: "LEADERSHIP_REVIEW",
    accentColor: "#4f46e5",
    icon: "crown",
    sections: [
      {
        title: "Strategic Context",
        description: "Business context and strategic priorities.",
        aiInstructions: "Summarize strategic context and leadership priorities discussed.",
        isRequired: true,
      },
      {
        title: "Performance Highlights",
        description: "Key wins and metrics discussed.",
        aiInstructions: "Capture performance highlights, KPIs, and notable wins.",
        isRequired: true,
      },
      {
        title: "Strategic Decisions",
        description: "Executive decisions and direction changes.",
        aiInstructions: "List strategic decisions with rationale and accountable leaders.",
        isRequired: true,
      },
      {
        title: "Resource & Investment",
        description: "Budget, headcount, and resource allocation.",
        aiInstructions: "Summarize resource, budget, and investment discussions.",
        isRequired: false,
      },
      {
        title: "Action Items",
        description: "Leadership commitments and follow-ups.",
        aiInstructions: "Extract leadership action items with owners and timelines.",
        isRequired: true,
      },
    ],
  },
  {
    key: "consulting-review",
    name: "Consulting Reviews",
    description: "Client engagement reviews with findings, recommendations, and deliverables.",
    category: "CONSULTING_REVIEW",
    accentColor: "#0d9488",
    icon: "clipboard-check",
    sections: [
      {
        title: "Engagement Summary",
        description: "Scope and objectives of the engagement.",
        aiInstructions: "Summarize engagement scope, objectives, and current phase.",
        isRequired: true,
      },
      {
        title: "Key Findings",
        description: "Analysis results and observations.",
        aiInstructions: "List key findings with supporting evidence from the discussion.",
        isRequired: true,
      },
      {
        title: "Recommendations",
        description: "Proposed actions and strategic advice.",
        aiInstructions: "Present recommendations with expected impact and priority.",
        isRequired: true,
      },
      {
        title: "Client Feedback",
        description: "Client reactions and concerns.",
        aiInstructions: "Capture client feedback, concerns, and requested changes.",
        isRequired: false,
      },
      {
        title: "Deliverables & Next Steps",
        description: "Upcoming deliverables and timeline.",
        aiInstructions: "List deliverables, owners, and next-step milestones.",
        isRequired: true,
      },
    ],
  },
  {
    key: "custom",
    name: "Custom Template",
    description: "Start from a blank canvas and define your own MOM structure.",
    category: "CUSTOM",
    accentColor: "#64748b",
    icon: "sparkles",
    sections: [
      {
        title: "Meeting Overview",
        description: "Purpose and context of the meeting.",
        aiInstructions: "Summarize the meeting purpose, context, and participants.",
        isRequired: true,
      },
      {
        title: "Discussion Summary",
        description: "Main points discussed.",
        aiInstructions: "Capture the main discussion points with relevant detail.",
        isRequired: true,
      },
      {
        title: "Action Items",
        description: "Tasks and follow-ups.",
        aiInstructions: "Extract tasks, owners, and deadlines.",
        isRequired: true,
      },
    ],
  },
];

export function getMomTemplatePreset(key: string): MomTemplatePreset | undefined {
  return MOM_TEMPLATE_PRESETS.find((p) => p.key === key);
}
