import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAuthenticated, getAuthHeaders } from '../utils/auth';

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPetDetail();
  }, [id]);

  const fetchPetDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/animals/${id}`);
      const data = await response.json();
      setPet(data);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate(`/adopt/${id}`);
  };

  const addToFavorites = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/favorites/${id}`, {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/pets')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
        >
          ← Back to All Pets
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pet Image */}
            <div className="bg-gradient-to-br from-primary-100 to-accent-100 h-96 md:h-full flex items-center justify-center">
              <span className="text-9xl">
                {pet.animalType === 'Dog' ? '🐕' : 
                 pet.animalType === 'Cat' ? '🐈' : 
                 pet.animalType === 'Bird' ? '🦜' :
                 pet.animalType === 'Rabbit' ? '🐰' : '🐾'}
              </span>
            </div>

            {/* Pet Details */}
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-700">{pet.name}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  pet.adoptionStatus === 'Available' ? 'bg-green-500 text-white' :
                  pet.adoptionStatus === 'Pending' ? 'bg-yellow-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {pet.adoptionStatus}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold">
                  {pet.breed}
                </span>
                <span className="bg-accent-100 text-accent-700 px-4 py-2 rounded-full font-semibold">
                  {pet.animalType}
                </span>
              </div>

              <p className="text-gray-700 text-lg mb-8 leading-relaxed">{pet.description}</p>

              {/* Pet Information Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-primary-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Age</p>
                  <p className="text-xl font-bold text-primary-700">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Gender</p>
                  <p className="text-xl font-bold text-primary-700">{pet.gender}</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Size</p>
                  <p className="text-xl font-bold text-primary-700">{pet.size}</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Color</p>
                  <p className="text-xl font-bold text-primary-700">{pet.color || 'N/A'}</p>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-accent-50 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-bold text-accent-700 mb-4">Medical Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Vaccinated:</span>
                    <span className="font-semibold">{pet.medicalHistory?.vaccinated ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Neutered/Spayed:</span>
                    <span className="font-semibold">{pet.medicalHistory?.neutered ? '✅ Yes' : '❌ No'}</span>
                  </div>
                  {pet.medicalHistory?.healthIssues && (
                    <div className="mt-4">
                      <span className="text-gray-700 font-semibold">Health Notes:</span>
                      <p className="text-gray-600 mt-1">{pet.medicalHistory.healthIssues}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Temperament */}
              {pet.temperament && pet.temperament.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary-700 mb-3">Temperament</h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.temperament.map((trait, index) => (
                      <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {pet.location && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary-700 mb-3">Location</h3>
                  <p className="text-gray-700">
                    {pet.location.shelter && <span className="font-semibold">{pet.location.shelter}<br /></span>}
                    {pet.location.city}, {pet.location.state}
                  </p>
                </div>
              )}

              {/* Adoption Fee */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary-700 mb-3">Adoption Fee</h3>
                <p className="text-3xl font-bold text-accent-600">
                  {pet.adoptionFee ? `₹${pet.adoptionFee}` : 'Free'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {pet.adoptionStatus === 'Available' && (
                  <button
                    onClick={handleAdopt}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition transform hover:scale-105"
                  >
                    Apply to Adopt 🏠
                  </button>
                )}
                <button
                  onClick={addToFavorites}
                  className="bg-accent-100 text-accent-600 font-bold py-4 px-8 rounded-full hover:bg-accent-200 transition"
                >
                  ❤️ Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
