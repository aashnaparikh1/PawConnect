import React, {useState, useEffect} from 'react'


const DemoAPI = () => {
    const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await fetch('https://dogapi.dog/api/v2/breeds');
      const result = await response.json();
      setBreeds(result.data);
    };

    fetchBreeds();
  }, []);

    
  return (
    <div>
      {breeds.map(breed => (
        <div key={breed.id} className='border p-4 m-4'>
          <h3 className="font-bold">{breed.attributes.name}</h3>
          <p>{breed.attributes.description}</p>
          <p>Lifespan: {breed.attributes.life.min}-{breed.attributes.life.max} years</p>
          <p>Weight: {breed.attributes.male_weight.min}-{breed.attributes.male_weight.max} kg</p>
          <p>Hypoallergenic: {breed.attributes.hypoallergenic ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}

export default DemoAPI
