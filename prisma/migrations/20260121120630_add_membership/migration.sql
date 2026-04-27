-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('FREE', 'PREMIUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "membership" "Membership" NOT NULL DEFAULT 'FREE';
