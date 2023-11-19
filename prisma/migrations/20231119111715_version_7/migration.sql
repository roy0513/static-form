-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_formId_fkey";

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
