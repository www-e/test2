/*
  Warnings:

  - You are about to drop the column `startNumber` on the `discussions` table. All the data in the column will be lost.
  - You are about to drop the `operations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `discussions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `discussions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_authorId_fkey";

-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_parentId_fkey";

-- AlterTable
ALTER TABLE "discussions" DROP COLUMN "startNumber",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "operations";

-- CreateTable
CREATE TABLE "replies" (
    "id" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
