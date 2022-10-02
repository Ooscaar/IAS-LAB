-- DropIndex
DROP INDEX "users_user_name_key";

-- AlterTable
ALTER TABLE "sessions" RENAME COLUMN "createdAt" TO "created_at";

-- AlterTable
ALTER TABLE "users" RENAME COLUMN "user_name" TO "username";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
