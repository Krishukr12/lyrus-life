/**
 * Removes fabricated notes-sourced transcripts and their MOMs.
 *
 * Usage (from repo root, with DATABASE_URL set to the target DB):
 *   pnpm --filter @lyrus/db exec tsx scripts/purge-notes-transcripts.ts
 *   pnpm --filter @lyrus/db exec tsx scripts/purge-notes-transcripts.ts --apply
 */
import { prisma } from "../src/index.js";

const apply = process.argv.includes("--apply");

const notesTranscripts = await prisma.transcript.findMany({
  where: { source: "notes" },
  select: {
    id: true,
    meetingId: true,
    fullText: true,
    meeting: { select: { title: true } },
  },
});

console.log(`Found ${notesTranscripts.length} notes-sourced transcript(s).`);
for (const t of notesTranscripts) {
  console.log(
    `- ${t.meetingId} | ${t.meeting.title} | ${t.fullText.length} chars`,
  );
}

if (!apply) {
  console.log("Dry run only. Re-run with --apply to delete transcripts + MOMs.");
  await prisma.$disconnect();
  process.exit(0);
}

let deletedMoms = 0;
let deletedTranscripts = 0;
for (const t of notesTranscripts) {
  const mom = await prisma.mom.deleteMany({ where: { meetingId: t.meetingId } });
  deletedMoms += mom.count;
  await prisma.transcriptSegment.deleteMany({ where: { transcriptId: t.id } });
  await prisma.transcript.delete({ where: { id: t.id } });
  deletedTranscripts += 1;
}

console.log(`Deleted ${deletedTranscripts} transcript(s) and ${deletedMoms} MOM(s).`);
await prisma.$disconnect();
