/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,slotId,status]` on the table `SwapRequest` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slotId` on table `SwapRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SwapRequest" DROP CONSTRAINT "SwapRequest_slotId_fkey";

-- DropIndex
DROP INDEX "SwapRequest_requesterId_receiverId_idx";

-- DropIndex
DROP INDEX "SwapRequest_slotId_key";

-- AlterTable
ALTER TABLE "SwapRequest" ALTER COLUMN "slotId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "SwapRequest_requesterId_idx" ON "SwapRequest"("requesterId");

-- CreateIndex
CREATE INDEX "SwapRequest_receiverId_idx" ON "SwapRequest"("receiverId");

-- CreateIndex
CREATE INDEX "SwapRequest_slotId_idx" ON "SwapRequest"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_pending_request" ON "SwapRequest"("requesterId", "slotId", "status");

-- AddForeignKey
ALTER TABLE "SwapRequest" ADD CONSTRAINT "SwapRequest_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "SkillSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
