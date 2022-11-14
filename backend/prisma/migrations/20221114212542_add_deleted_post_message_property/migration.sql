-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
