-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "notifySwapRequests" BOOLEAN NOT NULL DEFAULT true,
    "notifyMessages" BOOLEAN NOT NULL DEFAULT true,
    "notifySessionReminders" BOOLEAN NOT NULL DEFAULT true,
    "notifySkillApproval" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursFrom" TEXT NOT NULL DEFAULT '22:00',
    "quietHoursTo" TEXT NOT NULL DEFAULT '07:00',
    "profileVisibility" TEXT NOT NULL DEFAULT 'public',
    "showOfferedSkills" BOOLEAN NOT NULL DEFAULT true,
    "showAvailabilitySlots" BOOLEAN NOT NULL DEFAULT true,
    "maxActiveSwaps" TEXT NOT NULL DEFAULT '3',
    "autoReminderBeforeSession" BOOLEAN NOT NULL DEFAULT true,
    "autoArchiveCompletedChats" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
