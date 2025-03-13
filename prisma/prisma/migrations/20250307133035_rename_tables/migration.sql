/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModuleAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_moduleAccessId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_parentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "_ClientModules" DROP CONSTRAINT "_ClientModules_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientModules" DROP CONSTRAINT "_ClientModules_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupPermissions" DROP CONSTRAINT "_GroupPermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupPermissions" DROP CONSTRAINT "_GroupPermissions_B_fkey";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "ModuleAccess";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "config_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "roleId" INTEGER,
    "groupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "inReset" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "config_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code_name" TEXT NOT NULL,
    "moduleAccessId" INTEGER,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_module_access" (
    "id" SERIAL NOT NULL,
    "moduleName" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_module_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "config_user_username_key" ON "config_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "config_user_email_key" ON "config_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "config_role_name_key" ON "config_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "config_group_name_key" ON "config_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "config_permission_code_name_key" ON "config_permission"("code_name");

-- CreateIndex
CREATE UNIQUE INDEX "config_module_access_moduleName_key" ON "config_module_access"("moduleName");

-- AddForeignKey
ALTER TABLE "config_user" ADD CONSTRAINT "config_user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "config_role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_user" ADD CONSTRAINT "config_user_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "config_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_permission" ADD CONSTRAINT "config_permission_moduleAccessId_fkey" FOREIGN KEY ("moduleAccessId") REFERENCES "config_module_access"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_permission" ADD CONSTRAINT "config_permission_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "config_permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupPermissions" ADD CONSTRAINT "_GroupPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "config_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupPermissions" ADD CONSTRAINT "_GroupPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "config_permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientModules" ADD CONSTRAINT "_ClientModules_A_fkey" FOREIGN KEY ("A") REFERENCES "config_client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientModules" ADD CONSTRAINT "_ClientModules_B_fkey" FOREIGN KEY ("B") REFERENCES "config_module_access"("id") ON DELETE CASCADE ON UPDATE CASCADE;
