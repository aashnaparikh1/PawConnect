import React, { useState } from 'react'

const AddAnimal = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');

  const addAnimal = async() => {
    const dog = {name, age, gender};
    try{
      const response = await fetch('http://localhost:3000/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dog)
      });
      if(response.ok){
        const data = await response.json();
      }
      
    }
    catch(err){
      setErrorMessage(err.message)
    }
  }

  const handleClick = () => {
    addAnimal();

  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex flex-col gap-8 justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg w-96'>
        <div>
          <h2 className='text-2xl font-semibold mb-4 text-center'>Add New Animal</h2>
        </div>

        <div className='flex flex-col gap-2'>
          <p>Name</p>
          <input
            type="text"
            placeholder='Enter name'
            className='border border-gray-300 rounded-lg p-3 w-80 mb-4'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p>Age</p>
          <input 
            type = "number"
            placeholder = 'Enter Age' 
            className='border border-gray-300 rounded-lg p-3 w-80 mb-4'
            value = {age}
            onChange={(e)=> setAge(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
         <p>Gender</p>
         <select className='border border-gray-300 rounded-lg p-4 w-80 mb-4' onChange={(e)=> setGender(e.target.value)}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
         </select>
        </div>

        <button className='bg-blue-500 text-white rounded-lg p-3 w-80 hover:bg-blue-600 transition duration-300' onClick={addAnimal}>Add Animal</button>
      </div>

      
    </div>
  )
}

export default AddAnimal
