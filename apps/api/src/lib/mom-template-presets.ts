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
        aiInstructions: "Extract a concise executive summary only from what was said (purpose, outcomes, next focus). Leave empty if unsupported.",
        isRequired: true,
      },
      {
        title: "Key Discussion Points",
        description: "Main topics discussed during the meeting.",
        aiInstructions: "Extract the most important discussion points that were actually spoken. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Decisions Made",
        description: "Formal decisions and agreements reached.",
        aiInstructions: "Extract decisions that were explicitly made. Include owners/rationale only if stated. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Action Items",
        description: "Tasks assigned with owners and deadlines.",
        aiInstructions: "Extract only tasks/commitments stated in the transcript with owners and deadlines when given.",
        isRequired: true,
      },
      {
        title: "Risks & Blockers",
        description: "Issues that may impact progress.",
        aiInstructions: "Extract risks, blockers, and dependencies only if mentioned. Leave empty if none.",
        isRequired: false,
      },
      {
        title: "Next Steps",
        description: "Follow-up actions and upcoming milestones.",
        aiInstructions: "Extract follow-ups and next-meeting topics only if proposed in the transcript. Leave empty if none.",
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
        aiInstructions: "Extract sprint goals/focus only if discussed. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Yesterday / Completed",
        description: "Work completed since the last standup.",
        aiInstructions: "Extract completed work and progress updates that speakers reported. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Today / In Progress",
        description: "Planned work for today.",
        aiInstructions: "Extract in-progress/planned work only as stated by speakers. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Blockers",
        description: "Impediments requiring resolution.",
        aiInstructions: "Extract blockers/dependencies only if mentioned. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Technical Notes",
        description: "Architecture, design, or implementation notes.",
        aiInstructions: "Extract technical decisions/trade-offs only if discussed. Leave empty if none.",
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
        aiInstructions: "Extract project status/timeline points only from the transcript. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Milestone Updates",
        description: "Progress against key deliverables.",
        aiInstructions: "Extract milestone updates only if stated. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "RAID Log",
        description: "Risks, assumptions, issues, and dependencies.",
        aiInstructions: "Extract RAID items only if mentioned. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Action Items",
        description: "Assigned follow-ups and owners.",
        aiInstructions: "Extract only stated tasks/owners/deadlines/priorities. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Stakeholder Updates",
        description: "Communications and decisions for stakeholders.",
        aiInstructions: "Extract stakeholder updates only if discussed. Leave empty if none.",
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
        aiInstructions: "Extract the stated meeting objective and outcome only if said. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Client Needs & Pain Points",
        description: "Customer requirements and challenges discussed.",
        aiInstructions: "Extract client needs/pain points only if stated. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Solution Discussion",
        description: "Proposed solutions and value proposition.",
        aiInstructions: "Extract solutions/value points only if discussed. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Objections & Responses",
        description: "Concerns raised and how they were addressed.",
        aiInstructions: "Extract objections and responses only if raised. Leave empty if none.",
        isRequired: false,
      },
      {
        title: "Next Steps & Follow-ups",
        description: "Pipeline actions and follow-up schedule.",
        aiInstructions: "Extract follow-ups only if committed to. Leave empty if none.",
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
        aiInstructions: "Extract candidate/role/panel details only if stated. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Competency Assessment",
        description: "Skills and experience evaluation.",
        aiInstructions: "Extract competency evidence only from what was said. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Strengths",
        description: "Notable strengths demonstrated.",
        aiInstructions: "Extract strengths only with evidence from the interview. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Areas for Development",
        description: "Gaps or concerns identified.",
        aiInstructions: "Extract development areas/concerns only if stated. Leave empty if none.",
        isRequired: false,
      },
      {
        title: "Recommendation",
        description: "Hiring recommendation and rationale.",
        aiInstructions: "Extract a hiring recommendation only if one was stated. Leave empty if none.",
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
        aiInstructions: "Extract strategic context/priorities only if discussed. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Performance Highlights",
        description: "Key wins and metrics discussed.",
        aiInstructions: "Extract performance highlights/KPIs only if stated. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Strategic Decisions",
        description: "Executive decisions and direction changes.",
        aiInstructions: "Extract strategic decisions only if made. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Resource & Investment",
        description: "Budget, headcount, and resource allocation.",
        aiInstructions: "Extract resource/budget points only if discussed. Leave empty if none.",
        isRequired: false,
      },
      {
        title: "Action Items",
        description: "Leadership commitments and follow-ups.",
        aiInstructions: "Extract leadership action items only if committed. Leave empty if none.",
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
        aiInstructions: "Extract engagement scope/objectives only if stated. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Key Findings",
        description: "Analysis results and observations.",
        aiInstructions: "Extract findings only with transcript evidence. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Recommendations",
        description: "Proposed actions and strategic advice.",
        aiInstructions: "Extract recommendations only if proposed in the transcript. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Client Feedback",
        description: "Client reactions and concerns.",
        aiInstructions: "Extract client feedback only if stated. Leave empty if none.",
        isRequired: false,
      },
      {
        title: "Deliverables & Next Steps",
        description: "Upcoming deliverables and timeline.",
        aiInstructions: "Extract deliverables/next steps only if stated. Leave empty if none.",
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
        aiInstructions: "Extract meeting purpose/context only from the transcript. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Discussion Summary",
        description: "Main points discussed.",
        aiInstructions: "Extract main discussion points only as spoken. Leave empty if none.",
        isRequired: true,
      },
      {
        title: "Action Items",
        description: "Tasks and follow-ups.",
        aiInstructions: "Extract only stated tasks, owners, and deadlines. Leave empty if none.",
        isRequired: true,
      },
    ],
  },
];

export function getMomTemplatePreset(key: string): MomTemplatePreset | undefined {
  return MOM_TEMPLATE_PRESETS.find((p) => p.key === key);
}
