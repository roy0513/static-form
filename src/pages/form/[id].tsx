import { JsonObject } from "@prisma/client/runtime/library";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Link from "next/link";
import FormQuestion from "../component/FormQuestion";
import { CldUploadWidgetResults } from "next-cloudinary";
// Define a type for your form data
type FormType = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  formQuestions: {
    question: {
      id: string;
      label: string;
      type: string;
      options: any;
      responses: {
        responseValue: any;
      }[];
    };
  }[];
} | null;

function FormDetail() {
  const router = useRouter();
  const { id } = router.query;
  // Initialize form as null and define its type
  const [form, setForm] = useState<FormType>(null);
  const updateFormMutation = api.form.updateForm.useMutation();
  const [updatedForm, setUpdatedForm] = useState<FormType>(null);
  // Call your API endpoint to get the form by ID
  const formQuery = api.form.getFormById.useQuery(
    { formId: typeof id === "string" ? id : "" },
    {
      onSuccess: (data) => {
        // Set the form state with the fetched data
        setForm(data);
      },
      onError: (error) => {
        console.error("Error fetching form:", error);
      },
    },
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => {
    const newForm = { ...form };
    if (!newForm || !newForm.formQuestions) return;
    newForm.formQuestions[
      questionIndex
    ]!.question.responses[0]!.responseValue.responseValue = e.target.value;

    setUpdatedForm(newForm);
  };
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    questionIndex: number,
  ) => {
    const newForm = { ...form };
    if (!newForm || !newForm.formQuestions) return;
    newForm.formQuestions[
      questionIndex
    ]!.question.responses[0]!.responseValue.responseValue = e.target.value;
    setUpdatedForm(newForm);
  };

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => {
    const newForm = { ...form };
    if (!newForm || !newForm.formQuestions) return;
    newForm.formQuestions[
      questionIndex
    ]!.question.responses[0]!.responseValue.responseValue = e.target.value;
    setUpdatedForm(newForm);
  };
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionValue: string,
  ) => {
    const newForm = { ...form };
    // Ensure responseValue is an array
    if (
      !Array.isArray(
        newForm.formQuestions[questionIndex]!.question.responses[0]
          ?.responseValue.responseValue,
      )
    ) {
      newForm.formQuestions[
        questionIndex
      ]!.question.responses[0]!.responseValue.responseValue = [];
    }
    if (e.target.checked) {
      // Check if the optionValue is already in the responseValue array
      if (
        !newForm.formQuestions[
          questionIndex
        ]!.question.responses[0]!.responseValue.responseValue.includes(
          optionValue,
        )
      ) {
        // If the optionValue is the custom option, clear the responseValue array before adding it
        if (optionValue === customOption) {
          newForm.formQuestions[
            questionIndex
          ]!.question.responses[0]!.responseValue.responseValue = [];
        }
        newForm.formQuestions[
          questionIndex
        ]!.question.responses[0]!.responseValue.responseValue.push(optionValue);
      }
    } else {
      const index =
        newForm.formQuestions[
          questionIndex
        ]!.question.responses[0]!.responseValue.responseValue.indexOf(
          optionValue,
        );
      if (index > -1) {
        newForm.formQuestions[
          questionIndex
        ]!.question.responses[0]!.responseValue.responseValue.splice(index, 1);
      }
    }
    setUpdatedForm(newForm);
  };
  const handleImageUpload = (
    result: CldUploadWidgetResults,
    questionIndex: number,
  ) => {
    const info = result.info as object;

    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      const public_id = info.public_id as string;
      console.log("url: ", url);
      console.log("public_id: ", public_id);

      // Update the form state with the image URL and public_id
      const newForm = { ...form };
      console.log(newForm.formQuestions);
      console.log(questionIndex);
      if (!newForm || !newForm.formQuestions) return;
      newForm.formQuestions[
        questionIndex
      ]!.question.responses[0]!.responseValue.responseValue = url;
      setUpdatedForm(newForm);
    }
  };
  const handleImageRemove = (questionIndex: number) => {
    const newForm = { ...form };
    if (!newForm || !newForm.formQuestions) return;
    newForm.formQuestions[
      questionIndex
    ]!.question.responses[0]!.responseValue.responseValue = null;
    setUpdatedForm(newForm);
  };

  const handleSave = async () => {
    if (!updatedForm) {
      console.error("Updated form is null");
      return;
    }

    const responses = updatedForm.formQuestions.map((formQuestion) => ({
      questionId: formQuestion.question.id,
      responseValue:
        formQuestion.question.responses[0]?.responseValue.responseValue,
    }));

    try {
      console.log(updatedForm.id);
      await updateFormMutation.mutateAsync({
        formId: updatedForm.id,
        responses,
      });
      formQuery.refetch();
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  useEffect(() => {
    if (id) {
      formQuery.refetch();
      console.log(form?.formQuestions);
    }
  }, [id]);
  // Display form details...
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Link href={`/`}>
          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            Back
          </button>
        </Link>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {form?.title} <span className="text-[hsl(280,100%,70%)]">Form </span>
        </h1>
        <p className="text-xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Description:{form?.description}
        </p>
        <form className="w-9/12 rounded-lg border-2 border-white">
          {form?.formQuestions.map((formQuestion, index) => (
            <FormQuestion
              key={index}
              formQuestion={formQuestion}
              index={index}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleSelectChange={handleSelectChange}
              handleRadioChange={handleRadioChange}
              handleImageUpload={handleImageUpload}
              handleImageRemove={handleImageRemove}
            />
          ))}
        </form>

        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </main>
  );
}

export default FormDetail;
