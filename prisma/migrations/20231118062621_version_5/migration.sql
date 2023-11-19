-- CreateTable
CREATE TABLE "FormQuestion" (
    "formId" STRING NOT NULL,
    "questionId" STRING NOT NULL,

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("formId","questionId")
);

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
