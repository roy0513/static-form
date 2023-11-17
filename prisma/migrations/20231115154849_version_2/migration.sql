/*
  Warnings:

  - You are about to drop the column `formId` on the `Question` table. All the data in the column will be lost.

*/
-- AlterSequence
ALTER SEQUENCE "Response_id_seq" MAXVALUE 9223372036854775807;

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_formId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "formId";
