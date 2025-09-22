import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAnimal = ({ onAnimalAdded }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Adding new animal:', { name, age, gender });
    
    const newDog = { name, age: parseInt(age), gender };

    try {
      const response = await fetch('http://localhost:3000/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDog),
      });

      if (!response.ok) {
        throw new Error('Failed to add animal');
      }

      
      onAnimalAdded();
      
      setName('');
      setAge('');
      setGender('');

    } catch (error) {
      console.error('Error adding animal:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto mt-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">Add New Animal</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Gender"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
          Add Animal
        </button>
      </form>
    </div>
  );
};

export default AddAnimal;