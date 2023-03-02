/*
  Warnings:

  - You are about to drop the column `drId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SpecialtiesOnDr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specialties` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `isVerify` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SpecialtiesOnDr" DROP CONSTRAINT "SpecialtiesOnDr_drId_fkey";

-- DropForeignKey
ALTER TABLE "SpecialtiesOnDr" DROP CONSTRAINT "SpecialtiesOnDr_specialtiesId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_drId_fkey";

-- DropIndex
DROP INDEX "User_drId_key";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "isVerify" SET NOT NULL;

-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "drId";

-- DropTable
DROP TABLE "SpecialtiesOnDr";

-- DropTable
DROP TABLE "dr";

-- DropTable
DROP TABLE "specialties";

-- CreateTable
CREATE TABLE "Dr" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "cost" DOUBLE PRECISION NOT NULL,
    "openAt" INTEGER NOT NULL,
    "closeAt" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "hfId" UUID,

    CONSTRAINT "Dr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hf" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "drNumbers" INTEGER NOT NULL DEFAULT 0,
    "openAt" INTEGER NOT NULL,
    "closeAt" INTEGER NOT NULL,
    "specialtiesNumbers" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "Hf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DrToSpecialties" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_fav" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_favhf" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_HfToSpecialties" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Dr_userId_key" ON "Dr"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hf_userId_key" ON "Hf"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_DrToSpecialties_AB_unique" ON "_DrToSpecialties"("A", "B");

-- CreateIndex
CREATE INDEX "_DrToSpecialties_B_index" ON "_DrToSpecialties"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fav_AB_unique" ON "_fav"("A", "B");

-- CreateIndex
CREATE INDEX "_fav_B_index" ON "_fav"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_favhf_AB_unique" ON "_favhf"("A", "B");

-- CreateIndex
CREATE INDEX "_favhf_B_index" ON "_favhf"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HfToSpecialties_AB_unique" ON "_HfToSpecialties"("A", "B");

-- CreateIndex
CREATE INDEX "_HfToSpecialties_B_index" ON "_HfToSpecialties"("B");

-- AddForeignKey
ALTER TABLE "Dr" ADD CONSTRAINT "Dr_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dr" ADD CONSTRAINT "Dr_hfId_fkey" FOREIGN KEY ("hfId") REFERENCES "Hf"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hf" ADD CONSTRAINT "Hf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DrToSpecialties" ADD CONSTRAINT "_DrToSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "Dr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DrToSpecialties" ADD CONSTRAINT "_DrToSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fav" ADD CONSTRAINT "_fav_A_fkey" FOREIGN KEY ("A") REFERENCES "Dr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fav" ADD CONSTRAINT "_fav_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favhf" ADD CONSTRAINT "_favhf_A_fkey" FOREIGN KEY ("A") REFERENCES "Hf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favhf" ADD CONSTRAINT "_favhf_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HfToSpecialties" ADD CONSTRAINT "_HfToSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "Hf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HfToSpecialties" ADD CONSTRAINT "_HfToSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
