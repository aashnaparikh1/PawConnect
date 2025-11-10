import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedPets();
  }, []);

  const fetchFeaturedPets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/animals?status=Available');
      const data = await response.json();
      setFeaturedPets(data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/pets?search=${searchTerm}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            🐾 Find Your Perfect Companion
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-10 drop-shadow-md">
            Give a loving home to a pet in need
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center bg-white rounded-full shadow-2xl p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by breed, age, or location..."
              className="w-full px-6 py-4 text-gray-800 focus:outline-none rounded-l-full"
            />
            <button 
              type="submit" 
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Featured Pets Section */}
        <section className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary-700">
            Featured Pets Waiting for You
          </h2>
          
          {featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPets.map((pet) => (
                <div 
                  key={pet._id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-primary-300"
                >
                  <div className="h-56 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <span className="text-8xl">{pet.animalType === 'Dog' ? '🐕' : pet.animalType === 'Cat' ? '🐈' : '🐾'}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-primary-600 mb-2">{pet.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{pet.description}</p>
                    <button 
                      onClick={() => navigate(`/pet/${pet._id}`)}
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xl">Loading pets...</p>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/pets')}
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Pets
            </button>
          </div>
        </section>

        {/* Why Adopt Section */}
        <section className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-12 mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary-700">Why Adopt?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="text-xl font-bold text-primary-600 mb-2">Save a Life</h3>
              <p className="text-gray-700">Give a second chance to a pet in need of a loving home</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🏡</div>
              <h3 className="text-xl font-bold text-primary-600 mb-2">Perfect Match</h3>
              <p className="text-gray-700">Find the perfect companion that fits your lifestyle</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-primary-600 mb-2">Unconditional Love</h3>
              <p className="text-gray-700">Experience the joy and companionship pets bring</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-8 mt-16">
        <p className="text-lg">&copy; {new Date().getFullYear()} PawConnect. All rights reserved.</p>
        <p className="mt-2 text-primary-100">Making tails wag, one adoption at a time 🐾</p>
      </footer>
    </div>
  );
};

export default LandingPage;
