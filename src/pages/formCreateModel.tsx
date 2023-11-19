import { useState } from 'react';
import Modal from 'react-modal';
import { api } from "~/utils/api";
interface CustomPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userId: string;
    onFormCreated:()=>void;
  }
const CreateFormModal:React.FC<CustomPopupProps>=({ isOpen, onClose, onConfirm,userId,onFormCreated })=> {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const handleTitleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(event.target.value);
  };

  const handleDescriptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setFormDescription(event.target.value);
  };

  const FormCreateMutation = api.form.createForm.useMutation();
  // Function to handle form submission
  const handleCreateButtonClick = async (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    // Call your API endpoint to create a form
    FormCreateMutation.mutateAsync(
      { userId:userId, title: formTitle, description: formDescription },
      {
        onSuccess: () => {
          // Refetch the userForm after the form is created
          onFormCreated();
        }
      }
    );

    // Clear the form inputs and close the modal
    setFormTitle('');
    setFormDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-6 rounded-md">
  <h2 className="text-2xl font-bold mb-4">Create a new form</h2>
  <label className="block mb-2">
    <span className="text-gray-700">Title:</span>
    <input type="text" value={formTitle} onChange={handleTitleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
  </label>
  <label className="block mb-4">
    <span className="text-gray-700">Description:</span>
    <input type="text" value={formDescription} onChange={handleDescriptionChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
  </label>

  <div className="mt-4 flex justify-end">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      onClick={handleCreateButtonClick}
    >
      Confirm
    </button>
    <button
      className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
      onClick={onClose}
    >
      Cancel
    </button>
  </div>
</Modal>

  );
}

export default CreateFormModal;
