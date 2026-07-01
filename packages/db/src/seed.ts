import { config } from "dotenv";
import { resolve } from "node:path";
import { MeetingStatus, MeetingTag, prisma } from "./index.js";

config({ path: resolve(import.meta.dirname, "../../../.env") });
config({ path: resolve(import.meta.dirname, "../.env") });

async function main() {
  const organizer = await prisma.user.upsert({
    where: { email: "host@lyrus.life" },
    update: {},
    create: {
      email: "host@lyrus.life",
      name: "Lyrus Host",
    },
  });

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(14, 0, 0, 0);

  await prisma.meeting.upsert({
    where: { id: "seed-meeting-upcoming" },
    update: {},
    create: {
      id: "seed-meeting-upcoming",
      title: "Q3 Planning Sync",
      description: "Quarterly planning and resource alignment",
      scheduledAt: tomorrow,
      durationMinutes: 45,
      status: MeetingStatus.UPCOMING,
      tag: MeetingTag.INTERNAL,
      organizerId: organizer.id,
      participants: {
        create: [
          { name: "Alice Chen", email: "alice@lyrus.life", role: "Team Lead" },
          { name: "Bob Martinez", email: "bob@lyrus.life", role: "Analyst" },
          { name: "Carol Singh", email: "carol@lyrus.life", role: "Manager" },
        ],
      },
    },
  });

  await prisma.meeting.upsert({
    where: { id: "seed-meeting-completed" },
    update: {},
    create: {
      id: "seed-meeting-completed",
      title: "Client Onboarding Review",
      description: "Review onboarding milestones with client stakeholders",
      scheduledAt: lastWeek,
      durationMinutes: 60,
      status: MeetingStatus.COMPLETED,
      tag: MeetingTag.CLIENT,
      notes:
        "Discussed pilot timeline and budget constraints.\nClient requested revised cost breakdown.",
      organizerId: organizer.id,
      participants: {
        create: [
          { name: "Alice Chen", email: "alice@lyrus.life" },
          { name: "David Park", email: "david@client.com" },
        ],
      },
    },
  });

  console.log("Database seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
