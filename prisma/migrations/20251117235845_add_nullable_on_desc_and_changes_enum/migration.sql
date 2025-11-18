/*
  Warnings:

  - The values [PENDING] on the enum `task_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "task_status_new" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "public"."tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "task_status_new" USING ("status"::text::"task_status_new");
ALTER TYPE "task_status" RENAME TO "task_status_old";
ALTER TYPE "task_status_new" RENAME TO "task_status";
DROP TYPE "public"."task_status_old";
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED',
ALTER COLUMN "level" SET DEFAULT 'LOW';
