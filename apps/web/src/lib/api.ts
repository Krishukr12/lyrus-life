import { Meeting, MOM, MeetingStatus, UserTask, TaskStatus } from "./types";
import { SEED_MEETINGS } from "./mock-data";
import { getCurrentUserDisplayName } from "./current-user";

const STORAGE_KEY = "lyrus_meetings";
const TASKS_KEY = "lyrus_tasks";
function loadMeetings(): Meeting[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MEETINGS));
    return SEED_MEETINGS;
  }
  return JSON.parse(raw);
}

function saveMeetings(meetings: Meeting[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

function autoUpdateStatuses(meetings: Meeting[]): Meeting[] {
  const now = new Date();
  return meetings.map((m) => {
    if (m.status === "completed") return m;
    const start = new Date(`${m.date}T${m.time}`);
    const end = new Date(start.getTime() + m.duration * 60000);
    let status: MeetingStatus = "upcoming";
    if (now >= start && now <= end) status = "ongoing";
    else if (now > end) status = "completed";
    return { ...m, status };
  });
}

// Simulated delay
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getMeetings(): Promise<Meeting[]> {
  await delay();
  const meetings = autoUpdateStatuses(loadMeetings());
  saveMeetings(meetings);
  return meetings;
}

export async function getMeeting(id: string): Promise<Meeting | undefined> {
  const meetings = await getMeetings();
  return meetings.find((m) => m.id === id);
}

export async function createMeeting(data: Omit<Meeting, "id" | "status" | "notes" | "mom">): Promise<Meeting> {
  await delay();
  const meetings = loadMeetings();
  const meeting: Meeting = {
    ...data,
    id: `m${Date.now()}`,
    status: "upcoming",
    notes: "",
  };
  meetings.push(meeting);
  saveMeetings(meetings);
  return meeting;
}

export async function updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
  await delay();
  const meetings = loadMeetings();
  const idx = meetings.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Meeting not found");
  meetings[idx] = { ...meetings[idx], ...updates };
  saveMeetings(meetings);
  return meetings[idx];
}

export async function generateMOM(meetingId: string): Promise<MOM> {
  await delay(600);
  const meeting = (await getMeeting(meetingId))!;
  const mom: MOM = {
    id: `mom_${Date.now()}`,
    meetingId,
    title: meeting.title,
    dateTime: `${meeting.date} ${meeting.time}`,
    participants: meeting.stakeholders.map((s) => s.name),
    keyPoints: meeting.notes
      ? meeting.notes.split("\n").filter(Boolean)
      : [
          "Reviewed current progress and milestones",
          "Discussed blockers and mitigation strategies",
          "Aligned on next sprint priorities",
          "Resource allocation confirmed for upcoming phase",
        ],
    actionItems: [
      { task: "Prepare updated project timeline", assignee: meeting.stakeholders[0]?.name || "TBD", deadline: "Next Friday" },
      { task: "Share revised cost estimates", assignee: meeting.stakeholders[1]?.name || "TBD", deadline: "End of week" },
      { task: "Schedule follow-up review", assignee: meeting.stakeholders[0]?.name || "TBD", deadline: "Next Monday" },
    ],
    createdAt: new Date().toISOString(),
    shared: false,
    approved: false,
  };
  await updateMeeting(meetingId, { mom });
  return mom;
}

export async function shareMOM(meetingId: string): Promise<void> {
  await delay(800);
  const meeting = (await getMeeting(meetingId))!;
  if (meeting.mom) {
    if (!meeting.mom.approved) {
      throw new Error("MOM requires Lyrus Life approval before sharing.");
    }
    await updateMeeting(meetingId, { mom: { ...meeting.mom, shared: true } });
    // Auto-create tasks from MOM action items
    const existingTasks = loadTasks();
    const alreadyCreated = existingTasks.some((t) => t.meetingId === meetingId);
    if (!alreadyCreated && meeting.mom.actionItems.length > 0) {
      const newTasks: UserTask[] = meeting.mom.actionItems.map((item, i) => ({
        id: `task_${Date.now()}_${i}`,
        meetingId,
        meetingTitle: meeting.title,
        task: item.task,
        assignee: item.assignee,
        deadline: resolveDeadline(item.deadline),
        status: "pending" as TaskStatus,
        createdAt: new Date().toISOString(),
      }));
      saveTasks([...existingTasks, ...newTasks]);
    }
  }
}

export async function editMOM(meetingId: string, updates: Pick<MOM, "keyPoints" | "actionItems">): Promise<MOM> {
  await delay(300);
  const meeting = (await getMeeting(meetingId))!;
  if (!meeting.mom) throw new Error("MOM not found");

  const editedMom: MOM = {
    ...meeting.mom,
    keyPoints: updates.keyPoints,
    actionItems: updates.actionItems,
    approved: false,
    approvedBy: undefined,
    approvedAt: undefined,
    shared: false,
    lastEditedAt: new Date().toISOString(),
  };

  await updateMeeting(meetingId, { mom: editedMom });
  return editedMom;
}

export async function approveMOM(meetingId: string): Promise<MOM> {
  await delay(400);
  const meeting = (await getMeeting(meetingId))!;
  if (!meeting.mom) throw new Error("MOM not found");

  const approvedMom: MOM = {
    ...meeting.mom,
    approved: true,
    approvedBy: getCurrentUserDisplayName(),
    approvedAt: new Date().toISOString(),
  };

  await updateMeeting(meetingId, { mom: approvedMom });
  await shareMOM(meetingId);
  const final = (await getMeeting(meetingId))!;
  return final.mom!;
}

function resolveDeadline(text: string): string {
  const now = new Date();
  const lower = text.toLowerCase();
  if (lower.includes("tomorrow")) {
    return new Date(now.getTime() + 86400000).toISOString().split("T")[0];
  }
  if (lower.includes("next monday")) {
    const day = now.getDay();
    const diff = (8 - day) % 7 || 7;
    return new Date(now.getTime() + diff * 86400000).toISOString().split("T")[0];
  }
  if (lower.includes("next friday") || lower.includes("end of week")) {
    const day = now.getDay();
    const diff = (12 - day) % 7 || 7;
    return new Date(now.getTime() + diff * 86400000).toISOString().split("T")[0];
  }
  // Default: 3 days from now
  return new Date(now.getTime() + 3 * 86400000).toISOString().split("T")[0];
}

function loadTasks(): UserTask[] {
  const raw = localStorage.getItem(TASKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks: UserTask[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function autoUpdateTaskStatuses(tasks: UserTask[]): UserTask[] {
  const today = new Date().toISOString().split("T")[0];
  return tasks.map((t) => {
    if (t.status === "completed") return t;
    if (t.deadline < today) return { ...t, status: "overdue" as TaskStatus };
    return t;
  });
}

export async function getTasks(): Promise<UserTask[]> {
  await delay();
  const tasks = autoUpdateTaskStatuses(loadTasks());
  saveTasks(tasks);
  return tasks;
}

export async function updateTask(id: string, updates: Partial<UserTask>): Promise<UserTask> {
  await delay();
  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found");
  tasks[idx] = { ...tasks[idx], ...updates };
  saveTasks(tasks);
  return tasks[idx];
}

export function getTasksDueReminders(): UserTask[] {
  const tasks = autoUpdateTaskStatuses(loadTasks());
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  return tasks.filter(
    (t) => t.status !== "completed" && (t.deadline === today || t.deadline === tomorrow) && t.remindedAt !== today
  );
}
