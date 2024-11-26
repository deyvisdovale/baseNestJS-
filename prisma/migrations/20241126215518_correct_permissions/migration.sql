/*
  Warnings:

  - A unique constraint covering the columns `[code_name]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code_name` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "code_name" TEXT NOT NULL,
ADD COLUMN     "moduleAccessId" INTEGER,
ADD COLUMN     "parentId" INTEGER;

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientModules" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientModules_AB_unique" ON "_ClientModules"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientModules_B_index" ON "_ClientModules"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_name_key" ON "Permission"("code_name");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleAccessId_fkey" FOREIGN KEY ("moduleAccessId") REFERENCES "ModuleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientModules" ADD CONSTRAINT "_ClientModules_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientModules" ADD CONSTRAINT "_ClientModules_B_fkey" FOREIGN KEY ("B") REFERENCES "ModuleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
