import React, {useState, useEffect} from 'react'

const DemoAPI2 = () => {
  const [facts, setFacts] = useState([]);

  useEffect(() => {
    const fetchFacts = async () => {
      const response = await fetch('https://meowfacts.herokuapp.com/?count=3');
      const result = await response.json();
      setFacts(result.data);
    };

    fetchFacts();
  }, []);

  return (
    <div>
      {facts.map((fact, index) => (
        <div key={index}>
          <p>{fact}</p>
        </div>
      ))}
    </div>
  );
}

export default DemoAPI2
