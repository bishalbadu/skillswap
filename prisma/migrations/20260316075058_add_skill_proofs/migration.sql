/*
  Warnings:

  - You are about to drop the column `certificationType` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `certificationUrl` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "certificationType",
DROP COLUMN "certificationUrl";

-- CreateTable
CREATE TABLE "SkillProof" (
    "id" SERIAL NOT NULL,
    "skillId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SkillProof_skillId_idx" ON "SkillProof"("skillId");

-- AddForeignKey
ALTER TABLE "SkillProof" ADD CONSTRAINT "SkillProof_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
