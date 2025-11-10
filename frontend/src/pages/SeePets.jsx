import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isAuthenticated, getAuthHeaders } from '../utils/auth';

const SeePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    animalType: '',
    breed: '',
    age: '',
    size: '',
    gender: '',
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });
      
      const searchTerm = searchParams.get('search');
      if (searchTerm) queryParams.append('breed', searchTerm);

      const response = await fetch(`http://localhost:3000/api/animals?${queryParams}`);
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      animalType: '',
      breed: '',
      age: '',
      size: '',
      gender: '',
    });
  };

  const addToFavorites = async (petId, e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/favorites/${petId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        alert('Added to favorites!');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 text-primary-700">
          Find Your Perfect Pet 🐾
        </h1>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-primary-600 mb-6">Filter Pets</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <select
              name="animalType"
              value={filters.animalType}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              name="breed"
              placeholder="Breed"
              value={filters.breed}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <select
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              onClick={resetFilters}
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Pets Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading adorable pets...</p>
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-primary-300 cursor-pointer"
                onClick={() => navigate(`/pet/${pet._id}`)}
              >
                <div className="relative h-56 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <span className="text-8xl">
                    {pet.animalType === 'Dog' ? '🐕' : 
                     pet.animalType === 'Cat' ? '🐈' : 
                     pet.animalType === 'Bird' ? '🦜' :
                     pet.animalType === 'Rabbit' ? '🐰' : '🐾'}
                  </span>
                  <button
                    onClick={(e) => addToFavorites(pet._id, e)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-primary-50 transition"
                  >
                    <span className="text-2xl">❤️</span>
                  </button>
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    pet.adoptionStatus === 'Available' ? 'bg-green-500 text-white' :
                    pet.adoptionStatus === 'Pending' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {pet.adoptionStatus}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-bold text-primary-600 mb-2">{pet.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="bg-primary-100 px-2 py-1 rounded-full">{pet.breed}</span>
                    <span>•</span>
                    <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
                    <span>•</span>
                    <span>{pet.gender}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{pet.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-bold text-lg">
                      ${pet.adoptionFee || 'Free'}
                    </span>
                    <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-2 px-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-9xl">😢</span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">No pets found matching your filters</p>
            <button
              onClick={resetFilters}
              className="mt-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeePets;
