/*
  Warnings:

  - You are about to drop the column `autoArchiveCompletedChats` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `maxActiveSwaps` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `profileVisibility` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `quietHoursEnabled` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `quietHoursFrom` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `quietHoursTo` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `showAvailabilitySlots` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `showOfferedSkills` on the `UserSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "autoArchiveCompletedChats",
DROP COLUMN "maxActiveSwaps",
DROP COLUMN "profileVisibility",
DROP COLUMN "quietHoursEnabled",
DROP COLUMN "quietHoursFrom",
DROP COLUMN "quietHoursTo",
DROP COLUMN "showAvailabilitySlots",
DROP COLUMN "showOfferedSkills",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
