-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "remindersSent" TEXT[] DEFAULT ARRAY[]::TEXT[];
