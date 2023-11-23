import React, { useState, useEffect } from "react";
import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
interface FormQuestionProps {
  formQuestion: any;
  index: number;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => void;
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionValue: string,
  ) => void;
  handleSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    questionIndex: number,
  ) => void;
  handleRadioChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => void;
  handleImageUpload: (e: CldUploadWidgetResults, questionIndex: number) => void;
  handleImageRemove: (questionIndex: number) => void;
}

const FormQuestion: React.FC<FormQuestionProps> = ({
  formQuestion,
  index,
  handleInputChange,
  handleCheckboxChange,
  handleSelectChange,
  handleRadioChange,
  handleImageUpload,
  handleImageRemove,
}) => {
  const [customOption, setCustomOption] = useState("");
  const [customOptionCheckbox, setCustomOptionCheckBox] = useState("");
  const inputType = formQuestion.question.type;

  useEffect(() => {
    if (formQuestion.question.type === "radio") {
      const savedResponse =
        formQuestion.question.responses[0]?.responseValue.responseValue;
      if (
        savedResponse &&
        !formQuestion.question.options.options.some(
          (option: { value: String }) => option.value === savedResponse,
        )
      ) {
        setCustomOption(savedResponse);
      }
    }
    if (formQuestion.question.type === "checkbox") {
      const savedResponse =
        formQuestion.question.responses[0]?.responseValue.responseValue;
      const predefinedOptions = formQuestion.question.options.options.map(
        (option: { value: String }) => option.value,
      );
      const customResponse = Array.isArray(savedResponse)
        ? savedResponse.filter((value) => !predefinedOptions.includes(value))
        : [];
      setCustomOptionCheckBox(customResponse.join(", "));
    }
  }, [formQuestion]);
  let inputElement;
  switch (inputType) {
    case "string":
      inputElement = (
        <input
          id={`question-${index}`}
          type="text"
          className="mt-2 text-black"
          value={
            formQuestion.question.responses[0]?.responseValue.responseValue ||
            ""
          }
          onChange={(e) => handleInputChange(e, index)}
        />
      );
      break;
    case "checkbox":
      inputElement = (
        <>
          {formQuestion.question.options.options.map(
            (option: { value: string; label: string }, optionIndex: number) => (
              <div key={optionIndex}>
                <input
                  id={`question-${index}-option-${optionIndex}`}
                  type="checkbox"
                  value={option.value}
                  className="mt-2 text-black"
                  checked={
                    formQuestion.question.responses[0]?.responseValue
                      ?.responseValue &&
                    formQuestion.question.responses[0]?.responseValue.responseValue.includes(
                      option.value,
                    )
                  }
                  onChange={(e) => handleCheckboxChange(e, index, option.value)}
                />
                <label htmlFor={`question-${index}-option-${optionIndex}`}>
                  {option.label}
                </label>
              </div>
            ),
          )}
          <input
            id={`question-${index}-custom`}
            type="checkbox"
            value={customOptionCheckbox}
            className="mt-2 text-black"
            checked={
              formQuestion.question.responses[0]?.responseValue.responseValue &&
              formQuestion.question.responses[0]?.responseValue.responseValue.includes(
                customOptionCheckbox,
              )
            }
            onChange={(e) =>
              handleCheckboxChange(e, index, customOptionCheckbox)
            }
          />
          <input
            type="text"
            placeholder="Enter your own option"
            className="text-black"
            value={customOptionCheckbox}
            onChange={(e) => setCustomOptionCheckBox(e.target.value)}
          />
        </>
      );
      break;

    case "dropdown":
      inputElement = (
        <select
          id={`question-${index}`}
          className="mt-2 text-black"
          value={
            formQuestion.question.responses[0]?.responseValue.responseValue ||
            ""
          }
          onChange={(e) => handleSelectChange(e, index)}
        >
          {formQuestion.question.options.options.map(
            (option: { value: string; label: string }, optionIndex: number) => (
              <option key={optionIndex} value={option.value}>
                {option.label}
              </option>
            ),
          )}
        </select>
      );
      break;
    case "radio":
      inputElement = formQuestion.question.options.options.map(
        (option: { value: string; label: string }, optionIndex: number) => (
          <div key={optionIndex}>
            <input
              id={`question-${index}-option-${optionIndex}`}
              name={`question-${index}`}
              type="radio"
              value={option.value}
              className="mt-2 text-black"
              checked={
                formQuestion.question.responses[0]?.responseValue
                  .responseValue === option.value
              }
              onChange={(e) => handleRadioChange(e, index)}
            />
            <label htmlFor={`question-${index}-option-${optionIndex}`}>
              {option.label}
            </label>
          </div>
        ),
      );
      inputElement.push(
        <div>
          <input
            id={`question-${index}-custom`}
            name={`question-${index}`}
            type="radio"
            value={customOption}
            checked={
              formQuestion.question.responses[0]?.responseValue
                .responseValue === customOption
            }
            className="mt-2 text-black"
            onChange={(e) => handleRadioChange(e, index)}
          />
          <input
            className="text-black"
            type="text"
            placeholder="Enter your own option"
            value={customOption}
            onChange={(e) => setCustomOption(e.target.value)}
          />
        </div>,
      );
      break;
    case "date":
      inputElement = (
        <input
          id={`question-${index}`}
          type="date"
          className="mt-2 text-black"
          value={
            formQuestion.question.responses[0]?.responseValue.responseValue ||
            ""
          }
          onChange={(e) => handleInputChange(e, index)}
        />
      );
      break;
    case "time":
      inputElement = (
        <input
          id={`question-${index}`}
          type="time"
          className="mt-2 text-black"
          value={
            formQuestion.question.responses[0]?.responseValue.responseValue ||
            ""
          }
          onChange={(e) => handleInputChange(e, index)}
        />
      );
      break;
    case "image":
      inputElement = (
        <div className="w-full">
          <CldUploadButton
            uploadPreset={"pdoxp4xb"}
            className={`relative mt-4 grid h-48 w-full place-items-center rounded-md border-2 border-dotted bg-slate-100 ${
              formQuestion.question.responses[0]?.responseValue.responseValue &&
              "pointer-events-none"
            }`}
            onUpload={(e) => handleImageUpload(e, index)}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>

            {formQuestion.question.responses[0]?.responseValue
              .responseValue && (
              <Image
                src={
                  formQuestion.question.responses[0]?.responseValue
                    .responseValue
                }
                fill
                className="absolute inset-0 object-cover"
                alt={"title"}
              />
            )}
          </CldUploadButton>
          {formQuestion.question.responses[0]?.responseValue.responseValue && (
            <button
              onClick={() => handleImageRemove(index)}
              className="mb-4 w-fit rounded-md bg-red-600 px-4 py-2 font-bold text-white"
            >
              Remove Image
            </button>
          )}
        </div>
      );
      break;
    default:
      inputElement = null;
  }

  return (
    <div
      key={index}
      className="m-4 rounded-lg border-2 border-white bg-purple-500 p-4 text-white"
    >
      <label htmlFor={`question-${index}`} className="block py-2">
        {formQuestion.question.label}
      </label>
      {inputElement}
    </div>
  );
};

export default FormQuestion;
