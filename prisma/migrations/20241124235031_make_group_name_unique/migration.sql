/*
  Warnings:

  - You are about to drop the column `parentId` on the `Group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_parentId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "parentId";

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");
