-- CreateEnum
CREATE TYPE "SponsorshipType" AS ENUM ('RECURRING', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "SponsorshipFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsorship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "SponsorshipType" NOT NULL,
    "frequency" "SponsorshipFrequency",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updateToken" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorshipRecipient" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "sponsorshipId" TEXT NOT NULL,

    CONSTRAINT "SponsorshipRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sponsorship_updateToken_key" ON "Sponsorship"("updateToken");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsorship" ADD CONSTRAINT "Sponsorship_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorshipRecipient" ADD CONSTRAINT "SponsorshipRecipient_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "Sponsorship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
