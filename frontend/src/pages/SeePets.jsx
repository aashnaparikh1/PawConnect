import React, {useEffect, useState} from 'react'
import AddAnimal from '../components/AddAnimals';

const SeePets = () => {
  const [addAnimal, setAddAnimal] = useState(false);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try{
        const response = await fetch('http://localhost:3000/dogs');
        if (!response.ok){
          throw new Error('Failed to fetch pets');
        }
        const data = response.json();
        setPets(data);
      }
      catch(err){
        setError(err.message) 
      }
    };

    fetchPets();
  }, [])

  return (
    <div>
      <div className='flex flex-col justify-center items-center mt-10 gap-4'>
        <div className='flex flex-col border-solid'>
          <p>Name: </p>
          <p>Age:</p>
          <p>Gender:</p>

        </div>
        <button className='border p-3 rounded-xl bg-blue-400' onClick={() => setAddAnimal(!addAnimal)}>Add Animal</button>
        {addAnimal && <AddAnimal />}
      </div>
    </div>
  )
}

export default SeePets
