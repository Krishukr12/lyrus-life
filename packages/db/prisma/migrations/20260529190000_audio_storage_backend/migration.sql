-- CreateEnum
CREATE TYPE "AudioStorageBackend" AS ENUM ('LOCAL', 'S3');

-- AlterTable
ALTER TABLE "AudioFile" ADD COLUMN "storageBackend" "AudioStorageBackend" NOT NULL DEFAULT 'LOCAL';
