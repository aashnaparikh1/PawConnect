import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for the featured pets and success stories
const featuredPets = [
  { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: '2 years', image: 'https://placehold.co/400x300/e0f2fe/1d4ed8?text=Buddy', description: 'A playful and friendly companion looking for a forever home.' },
  { id: 2, name: 'Mittens', breed: 'Siamese', age: '1 year', image: 'https://placehold.co/400x300/e0f2fe/1d4ed8?text=Mittens', description: 'A sweet and calm cat who loves to curl up on a warm lap.' },
  { id: 3, name: 'Rocky', breed: 'Bulldog', age: '3 years', image: 'https://placehold.co/400x300/e0f2fe/1d4ed8?text=Rocky', description: 'A goofy, loving bulldog with a heart of gold. Loves to chew toys.' },
];

const successStories = [
  { id: 1, name: 'The Johnson Family & Sparky', story: 'Sparky has brought so much joy into our lives. He loves to play fetch and is the perfect addition to our family.', image: 'https://placehold.co/100x100/e0f2fe/1d4ed8?text=J' },
  { id: 2, name: 'Alex & Luna', story: 'Luna is the best cat I could have ever asked for. She is so affectionate and has a personality all her own.', image: 'https://placehold.co/100x100/e0f2fe/1d4ed8?text=A' },
  { id: 3, name: 'The Millers & Daisy', story: 'We were looking for a companion for our kids, and Daisy was the perfect fit. She is so gentle and loves cuddles.', image: 'https://placehold.co/100x100/e0f2fe/1d4ed8?text=M' },
];

// Main App component
const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a search API call
    console.log('Searching for:', searchTerm);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {/* Hero Section */}
      <header className="relative bg-blue-500 text-white py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
            Pawsitive Adoptions
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-8 drop-shadow-sm">
            Find your perfect companion.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-xl p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by breed, age, or location..."
              className="w-full px-6 py-3 text-gray-800 focus:outline-none rounded-l-full"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105">
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Featured Animals Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Featured Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{pet.breed} &bull; {pet.age}</p>
                  <p className="text-gray-700 mb-4">{pet.description}</p>
                  <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-full hover:bg-blue-700 transition-colors" onClick={() => navigate('/aboutPets') }>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t-2 border-blue-200 my-12" />

        {/* Success Stories Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Happy Tails: Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                <div className="flex items-center mb-4">
                  <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full border-2 border-blue-500 mr-4" />
                  <div>
                    <h4 className="font-bold text-lg">{story.name}</h4>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>&copy; {new Date().getFullYear()} Pawsitive Adoptions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
