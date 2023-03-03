-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "roleId" UUID NOT NULL,
    "addressId" UUID NOT NULL,
    "settingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" UUID NOT NULL,
    "city" TEXT NOT NULL,
    "town" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT 'user',
    "isVerify" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" UUID NOT NULL,
    "avatar" TEXT,
    "language" VARCHAR(9) NOT NULL DEFAULT 'ar',
    "darkmode" BOOLEAN NOT NULL DEFAULT false,
    "bio" VARCHAR(255),
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" VARCHAR(9) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "BookingAv" (
    "id" UUID NOT NULL,
    "drId" UUID,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "av" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BookingAv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "drId" UUID,
    "phoneNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_roleId_key" ON "User"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_addressId_key" ON "User"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "User_settingId_key" ON "User"("settingId");

-- CreateIndex
CREATE UNIQUE INDEX "Dr_userId_key" ON "Dr"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hf_userId_key" ON "Hf"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingAv_drId_key" ON "BookingAv"("drId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_key" ON "Booking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_drId_key" ON "Booking"("drId");

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
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "Setting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dr" ADD CONSTRAINT "Dr_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dr" ADD CONSTRAINT "Dr_hfId_fkey" FOREIGN KEY ("hfId") REFERENCES "Hf"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hf" ADD CONSTRAINT "Hf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAv" ADD CONSTRAINT "BookingAv_drId_fkey" FOREIGN KEY ("drId") REFERENCES "Dr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_drId_fkey" FOREIGN KEY ("drId") REFERENCES "Dr"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
