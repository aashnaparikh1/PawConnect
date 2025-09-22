import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import DemoAPI from '../DemoAPI';


const AddAnimal = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding new animal:', { name, age, gender });
    setName('');
    setAge('');
    setGender('');

    
  };

  const navigate = useNavigate();

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


const SeePets = () => {
  const [addAnimal, setAddAnimal] = useState(false);
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try{
        const response = await fetch('http://localhost:3000/dogs');
        const response2 = await fetch('https://dogapi.dog/api/v2/breeds');
        const result = await response2.json();
      setBreeds(result.data);
        if (!response.ok){
          throw new Error('Failed to fetch pets');
        }
        const data = await response.json();
        setPets(data);
      }
      catch(err){
        console.error(err);
      }
    };

    fetchPets();
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12 font-sans text-gray-800">
      <div className='flex flex-col items-center gap-8'>
        {/* The 'Add Animal' button now has a more prominent, styled look. */}
        <button 
          className='px-6 py-3 rounded-full text-white font-semibold transition-transform duration-200 transform hover:scale-105 shadow-lg
                     bg-blue-600 hover:bg-blue-700' 
          onClick={() => setAddAnimal(!addAnimal)}
        >
          Add Animal
        </button>
        {addAnimal && <AddAnimal />}
      </div>
      
      {/* Pet list section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Available Pets</h2>
        
        {pets.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((item, idx) => (
              <li 
                key={item.id || item.name || idx}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex flex-col space-y-2 mb-4">
                  <p className="text-lg font-semibold text-blue-600">
                    <span className="font-medium text-gray-600">Name:</span> {item.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-600">Age:</span> {item.age}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-600">Gender:</span> {item.gender}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/aboutPet')}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Learn More
                </button>
              </li>
            ))}

            
            
          </ul>
          
          
        ) : (
          <p className="text-center text-gray-500 italic text-xl">
            No pets found. Try adding some!
          </p>
        )}
      </div>
    </div>
  )
}

export default SeePets
