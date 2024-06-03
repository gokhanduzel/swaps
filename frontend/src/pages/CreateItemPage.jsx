import React from 'react';
import CreateItemForm from '../components/createItem/CreateItemForm';

const CreateItemPage = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-r from-teal-400 via-blue-400 to-teal-400 flex flex-col items-center pt-32 pb-32">
      <h1 className="text-5xl font-bold text-white mb-8 mt-8 shadow-lg p-3 rounded-md bg-opacity-30 bg-black">
        Create New Item
      </h1>
      <CreateItemForm />
    </div>
  );
};

export default CreateItemPage;
