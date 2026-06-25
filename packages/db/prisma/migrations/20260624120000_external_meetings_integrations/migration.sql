-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('GOOGLE', 'MICROSOFT');

-- CreateEnum
CREATE TYPE "MeetingPlatform" AS ENUM ('LYRUS_LIVEKIT', 'GOOGLE_MEET', 'MICROSOFT_TEAMS');

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "platform" "MeetingPlatform" NOT NULL DEFAULT 'LYRUS_LIVEKIT';
ALTER TABLE "Meeting" ADD COLUMN "externalMeetingUrl" TEXT;
ALTER TABLE "Meeting" ADD COLUMN "externalMeetingId" TEXT;
ALTER TABLE "Meeting" ADD COLUMN "recordingBotId" TEXT;
ALTER TABLE "Meeting" ADD COLUMN "recordingBotStatus" TEXT;

-- CreateTable
CREATE TABLE "UserIntegration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "accessTokenEnc" TEXT NOT NULL,
    "refreshTokenEnc" TEXT,
    "expiresAt" TIMESTAMP(3),
    "scopes" TEXT NOT NULL DEFAULT '',
    "externalAccountId" TEXT,
    "externalEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserIntegration_userId_idx" ON "UserIntegration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserIntegration_userId_provider_key" ON "UserIntegration"("userId", "provider");

-- AddForeignKey
ALTER TABLE "UserIntegration" ADD CONSTRAINT "UserIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
