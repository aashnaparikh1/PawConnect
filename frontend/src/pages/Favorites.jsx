import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/favorites', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (petId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/favorites/${petId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setFavorites(favorites.filter(pet => pet._id !== petId));
        alert('Removed from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-12 text-primary-700">
          My Favorite Pets ❤️
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-9xl">💔</span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">No favorites yet</p>
            <p className="mt-2 text-gray-500">Start adding pets to your favorites!</p>
            <button
              onClick={() => navigate('/pets')}
              className="mt-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition"
            >
              Browse Pets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-primary-300"
              >
                <div className="relative h-56 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center cursor-pointer"
                     onClick={() => navigate(`/pet/${pet._id}`)}>
                  <span className="text-8xl">
                    {pet.animalType === 'Dog' ? '🐕' : 
                     pet.animalType === 'Cat' ? '🐈' : 
                     pet.animalType === 'Bird' ? '🦜' :
                     pet.animalType === 'Rabbit' ? '🐰' : '🐾'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(pet._id);
                    }}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition"
                  >
                    <span className="text-2xl">💔</span>
                  </button>
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
                  <button
                    onClick={() => navigate(`/pet/${pet._id}`)}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
