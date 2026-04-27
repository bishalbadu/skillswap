/*
  Warnings:

  - Made the column `date` on table `SkillSlot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SkillSlot" ALTER COLUMN "date" SET NOT NULL;
