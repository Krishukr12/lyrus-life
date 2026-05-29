-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "joinSlug" TEXT,
ADD COLUMN "liveStartedAt" TIMESTAMP(3),
ADD COLUMN "liveEndedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_joinSlug_key" ON "Meeting"("joinSlug");
