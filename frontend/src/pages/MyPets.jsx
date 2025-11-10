import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pet-profiles/my-pets', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4">
            My Pets 🐾
          </h1>
          <p className="text-xl text-gray-600">
            Manage your pet profiles, health logs, and reminders
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-8 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
          >
            {showAddForm ? 'Cancel' : '+ Add New Pet'}
          </button>
        </div>

        {showAddForm && (
          <AddPetForm 
            onSuccess={() => {
              setShowAddForm(false);
              fetchMyPets();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {pets.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-9xl">🐕</span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">No pets added yet</p>
            <p className="mt-2 text-gray-500">Add your first pet to start tracking their health and care</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                onClick={() => navigate(`/pet-profile/${pet._id}`)}
              >
                <div className="bg-gradient-to-br from-primary-100 to-accent-100 h-56 flex items-center justify-center">
                  <span className="text-9xl">
                    {pet.species === 'Dog' ? '🐕' : 
                     pet.species === 'Cat' ? '🐈' : 
                     pet.species === 'Bird' ? '🦜' :
                     pet.species === 'Rabbit' ? '🐰' : '🐾'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary-700 mb-2">{pet.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🏷️</span>
                      <span>{pet.breed || pet.species}</span>
                    </div>
                    {pet.age && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>🎂</span>
                        <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⚧️</span>
                      <span>{pet.gender}</span>
                    </div>
                    {pet.weight && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⚖️</span>
                        <span>{pet.weight} kg</span>
                      </div>
                    )}
                  </div>
                  <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition">
                    View Profile
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

// Add Pet Form Component
const AddPetForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    dateOfBirth: '',
    gender: 'Male',
    weight: '',
    color: '',
    microchipId: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const petData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
      };

      const response = await fetch('http://localhost:3000/api/pet-profiles', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(petData),
      });

      if (response.ok) {
        alert('Pet added successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      alert('Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h3 className="text-2xl font-bold text-primary-700 mb-6">Add New Pet</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Pet Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Species *</label>
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Age (years)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Color</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Microchip ID</label>
          <input
            type="text"
            name="microchipId"
            value={formData.microchipId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Pet'}
        </button>
      </div>
    </form>
  );
};

export default MyPets;
