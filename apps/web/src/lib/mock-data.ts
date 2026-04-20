import { Meeting } from "./types";

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export const SEED_MEETINGS: Meeting[] = [
  {
    id: "m1",
    title: "Q1 Production Review",
    description: "Review Q1 production targets, bottlenecks, and quality metrics across all assembly lines.",
    date: today,
    time: "09:00",
    duration: 60,
    stakeholders: [
      { name: "Arvind Mehta", email: "arvind@lyruslife.com" },
      { name: "Priya Sharma", email: "priya@lyruslife.com" },
      { name: "Rakesh Gupta", email: "rakesh@lyruslife.com" },
    ],
    status: "upcoming",
    tag: "internal",
    notes: "",
  },
  {
    id: "m2",
    title: "Vendor Onboarding: Steel Components",
    description: "Finalize contract terms with Tata Steel for Q2 raw material supply.",
    date: today,
    time: "11:30",
    duration: 45,
    stakeholders: [
      { name: "Sanjay Patel", email: "sanjay@lyruslife.com" },
      { name: "Deepak Rao", email: "deepak@tatasteel.com" },
    ],
    status: "upcoming",
    tag: "vendor",
    notes: "",
  },
  {
    id: "m3",
    title: "Client Demo: Smart Assembly Line",
    description: "Demonstrate the new IoT-enabled assembly line monitoring system to Mahindra team.",
    date: today,
    time: "14:00",
    duration: 90,
    stakeholders: [
      { name: "Neha Kapoor", email: "neha@lyruslife.com" },
      { name: "Vikram Singh", email: "vikram@mahindra.com" },
      { name: "Anita Desai", email: "anita@mahindra.com" },
    ],
    status: "upcoming",
    tag: "client",
    notes: "",
  },
  {
    id: "m4",
    title: "Safety Compliance Audit Prep",
    description: "Prepare documentation for upcoming ISO 45001 audit.",
    date: yesterday,
    time: "10:00",
    duration: 60,
    stakeholders: [
      { name: "Ravi Kumar", email: "ravi@lyruslife.com" },
      { name: "Suresh Nair", email: "suresh@lyruslife.com" },
    ],
    status: "completed",
    tag: "internal",
    notes: "Reviewed all safety checklists. Need to update fire escape route documentation.",
  },
  {
    id: "m5",
    title: "New Product Line Kickoff",
    description: "Kickoff meeting for the EV battery component manufacturing line.",
    date: tomorrow,
    time: "10:00",
    duration: 120,
    stakeholders: [
      { name: "Arvind Mehta", email: "arvind@lyruslife.com" },
      { name: "Priya Sharma", email: "priya@lyruslife.com" },
      { name: "Kiran Joshi", email: "kiran@lyruslife.com" },
      { name: "Meera Bhat", email: "meera@lyruslife.com" },
    ],
    status: "upcoming",
    tag: "internal",
    notes: "",
  },
];
