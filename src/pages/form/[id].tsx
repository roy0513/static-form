import { JsonObject } from "@prisma/client/runtime/library";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
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
  type QuestionResponse={
    question: {
        id: string;
        label: string;
        type: string;
        options: any;
        responses: {
          responseValue: responseValue;
        }[];
      };
  }
  type responseValue = {
    responseValue: any|JsonObject;
  }

function FormDetail() {
  const router = useRouter();
  const { id } = router.query;
  // Initialize form as null and define its type
  const [form, setForm] = useState<FormType>(null);
  const updateFormMutation = api.form.updateForm.useMutation();
  const [updatedForm, setUpdatedForm] = useState<FormType>(null);
  // Call your API endpoint to get the form by ID
  const formQuery = api.form.getFormById.useQuery({ formId: typeof id === 'string' ? id : '' }, 
    {
      onSuccess: (data) => {
        // Set the form state with the fetched data
        setForm(data);
      },
      onError: (error) => {
        console.error('Error fetching form:', error);
      }
    }
  );
  const handleInputChange = (e :React.ChangeEvent<HTMLInputElement>, questionIndex:number) => {
    const newForm = { ...form };
    newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue = e.target.value;

    setUpdatedForm(newForm);
};
  const handleSelectChange = (e :React.ChangeEvent<HTMLSelectElement>, questionIndex:number) => {
    const newForm = {...form};
;
    newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue = e.target.value;
    setUpdatedForm(newForm);
};

const handleRadioChange = (e :React.ChangeEvent<HTMLInputElement>, questionIndex:number) => {
    const newForm = {...form};
;
    newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue = e.target.value;
    setUpdatedForm(newForm);
};
const handleCheckboxChange = (e :React.ChangeEvent<HTMLInputElement>, questionIndex:number, optionValue:string) => {
    const newForm = {...form};
;
    if (!newForm.formQuestions[questionIndex].question.responses[0]?.responseValue?.responseValue) {
        newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue = [];
    }
    if (e.target.checked) {
        newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue.push(optionValue);
    } else {
        const index = newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue.indexOf(optionValue);
        if (index > -1) {
            newForm.formQuestions[questionIndex].question.responses[0].responseValue.responseValue.splice(index, 1);
        }
    }
    setUpdatedForm(newForm);
};


  const handleSave = async () => {
    const responses = updatedForm.formQuestions.map(formQuestion => ({
        questionId: formQuestion.question.id,
        responseValue: formQuestion.question.responses[0]?.responseValue.responseValue
    }));
    try {
        console.log(form?.id)
      await updateFormMutation.mutateAsync({ formId: updatedForm.id, responses });
      console.log('Form updated');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };
  useEffect(() => {
    if (id) {
      formQuery.refetch();
      console.log(form?.formQuestions)
    }
  }, [id]);
  // Display form details...
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {form?.title} <span className="text-[hsl(280,100%,70%)]">Form </span> 
        </h1>
        <p className="text-xl font-extrabold tracking-tight text-white sm:text-[5rem]">Description:{form?.description}</p>
        <form className="border-white border-2 w-9/12 rounded-lg">
  {form?.formQuestions.map((formQuestion, index) => (
    <div key={index} className="text-white border-white border-2 p-4 m-4 rounded-lg bg-purple-500">
      <label htmlFor={`question-${index}`} className="py-2 block">{formQuestion.question.label}</label>
      {formQuestion.question.type === 'string' && (
              <input id={`question-${index}`} type="text" className="text-black mt-2" value={formQuestion.question.responses[0]?.responseValue.responseValue || ''} onChange={(e) => handleInputChange(e, index)}/>
            )}
      {formQuestion.question.type === 'checkbox' && formQuestion.question.options.options.map((option: { value: string, label: string }, optionIndex:number) => (
  <div key={optionIndex}>
    <input id={`question-${index}-option-${optionIndex}`} type="checkbox" value={option.value} className="text-black mt-2" checked={formQuestion.question.responses[0]?.responseValue?.responseValue && formQuestion.question.responses[0]?.responseValue.responseValue.includes(option.value)} onChange={(e) => handleCheckboxChange(e, index, option.value)}/>
    <label htmlFor={`question-${index}-option-${optionIndex}`}>{option.label}</label>
  </div>
))}

{formQuestion.question.type === 'dropdown' && (
    <select id={`question-${index}`} className="text-black mt-2" value={formQuestion.question.responses[0]?.responseValue.responseValue || ''} onChange={(e) => handleSelectChange(e, index)}>
        {formQuestion.question.options.options.map((option: { value: string, label: string }, optionIndex:number) => (
            <option key={optionIndex} value={option.value}>{option.label}</option>
        ))}
    </select>
)}
{formQuestion.question.type === 'radio' && formQuestion.question.options.options.map((option: { value: string, label: string }, optionIndex:number) => (
    <div key={optionIndex}>
        <input id={`question-${index}-option-${optionIndex}`} name={`question-${index}`} type="radio" value={option.value} className="text-black mt-2" checked={formQuestion.question.responses[0]?.responseValue.responseValue === option.value} onChange={(e) => handleRadioChange(e, index)}/>
        <label htmlFor={`question-${index}-option-${optionIndex}`}>{option.label}</label>
    </div>
))}
{formQuestion.question.type === 'date' && (
  <input id={`question-${index}`} type="date" className="text-black mt-2" value={formQuestion.question.responses[0]?.responseValue.responseValue || ''} onChange={(e) => handleInputChange(e, index)}/>
)}

{formQuestion.question.type === 'time' && (
  <input id={`question-${index}`} type="time" className="text-black mt-2" value={formQuestion.question.responses[0]?.responseValue.responseValue || ''} onChange={(e) => handleInputChange(e, index)}/>
)}

    </div>
  ))}
</form>
<button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={handleSave}>Save</button>
      </div>
    </main>
  );
  
  
  
}

export default FormDetail;
