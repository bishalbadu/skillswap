-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('PENDING', 'APPROVED', 'DISABLED');

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "status" "SkillStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Skill_status_idx" ON "Skill"("status");
