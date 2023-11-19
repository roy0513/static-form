/*
  Warnings:

  - You are about to alter the column `id` on the `Response` table. The data in that column will be cast from `Int` to `String`. This cast may fail. Please make sure the data in the column can be cast.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_Response" (
    "id" STRING NOT NULL,
    "formId" STRING NOT NULL,
    "questionId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "responseValue" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Response" ("createdAt","formId","id","questionId","responseValue","updatedAt","userId") SELECT "createdAt","formId","id","questionId","responseValue","updatedAt","userId" FROM "Response";
DROP TABLE "Response" CASCADE;
ALTER TABLE "_prisma_new_Response" RENAME TO "Response";
ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
