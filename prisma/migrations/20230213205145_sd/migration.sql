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
    "isVerify" BOOLEAN DEFAULT true,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingUser" (
    "id" UUID NOT NULL,
    "avatar" TEXT NOT NULL,
    "language" VARCHAR(9) NOT NULL DEFAULT 'ar',
    "darkmode" BOOLEAN NOT NULL DEFAULT false,
    "bio" VARCHAR(255) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" VARCHAR(9) NOT NULL,

    CONSTRAINT "SettingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HfonUser" (
    "userId" UUID NOT NULL,
    "hfId" UUID NOT NULL,

    CONSTRAINT "HfonUser_pkey" PRIMARY KEY ("userId","hfId")
);

-- CreateTable
CREATE TABLE "Hf" (
    "id" UUID NOT NULL,
    "phoneNumber" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "addressId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "settingHfId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingHf" (
    "id" UUID NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCounter" INTEGER NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avatar" TEXT NOT NULL,
    "openAt" DOUBLE PRECISION NOT NULL,
    "closeAt" DOUBLE PRECISION NOT NULL,
    "language" VARCHAR(9) NOT NULL DEFAULT 'ar',
    "darkmode" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,

    CONSTRAINT "SettingHf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialtiesOnSettingHf" (
    "settingHfId" UUID NOT NULL,
    "specialtiesId" INTEGER NOT NULL,

    CONSTRAINT "SpecialtiesOnSettingHf_pkey" PRIMARY KEY ("specialtiesId","settingHfId")
);

-- CreateTable
CREATE TABLE "SpecialtiesOnSetting" (
    "settingId" UUID NOT NULL,
    "specialtiesId" INTEGER NOT NULL,

    CONSTRAINT "SpecialtiesOnSetting_pkey" PRIMARY KEY ("specialtiesId","settingId")
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
CREATE UNIQUE INDEX "Hf_phoneNumber_key" ON "Hf"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Hf_addressId_key" ON "Hf"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Hf_roleId_key" ON "Hf"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Hf_settingHfId_key" ON "Hf"("settingHfId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "SettingUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HfonUser" ADD CONSTRAINT "HfonUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HfonUser" ADD CONSTRAINT "HfonUser_hfId_fkey" FOREIGN KEY ("hfId") REFERENCES "Hf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hf" ADD CONSTRAINT "Hf_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hf" ADD CONSTRAINT "Hf_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hf" ADD CONSTRAINT "Hf_settingHfId_fkey" FOREIGN KEY ("settingHfId") REFERENCES "SettingHf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtiesOnSettingHf" ADD CONSTRAINT "SpecialtiesOnSettingHf_settingHfId_fkey" FOREIGN KEY ("settingHfId") REFERENCES "SettingHf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtiesOnSettingHf" ADD CONSTRAINT "SpecialtiesOnSettingHf_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtiesOnSetting" ADD CONSTRAINT "SpecialtiesOnSetting_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "SettingUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtiesOnSetting" ADD CONSTRAINT "SpecialtiesOnSetting_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
