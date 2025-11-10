import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, getUser } from '../utils/auth';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'shelter')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'applications') {
        const response = await fetch('http://localhost:3000/api/applications', {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        setApplications(data);
      } else {
        const response = await fetch('http://localhost:3000/api/animals');
        const data = await response.json();
        setPets(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, notes) => {
    try {
      const response = await fetch(`http://localhost:3000/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        alert('Application status updated successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const deletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/animals/${petId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        alert('Pet deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-5xl font-bold text-center mb-12 text-primary-700">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              activeTab === 'applications'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              activeTab === 'pets'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Manage Pets ({pets.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                {applications.length === 0 ? (
                  <p className="text-center text-gray-500 py-20">No applications found</p>
                ) : (
                  applications.map((app) => (
                    <div key={app._id} className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="md:flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-primary-700 mb-2">
                            {app.animal?.name} - {app.user?.firstName} {app.user?.lastName}
                          </h3>
                          <p className="text-gray-600">
                            {app.user?.email} • {app.user?.phone}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-primary-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Home Type</p>
                          <p className="font-semibold">{app.homeType}</p>
                        </div>
                        <div className="bg-primary-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Has Yard</p>
                          <p className="font-semibold">{app.hasYard ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="bg-primary-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Other Pets</p>
                          <p className="font-semibold">{app.otherPets ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      <div className="bg-accent-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-600 mb-1">Reason for Adoption</p>
                        <p className="text-gray-800">{app.reason}</p>
                      </div>

                      {app.status === 'Pending' && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              const notes = prompt('Enter notes (optional):');
                              updateApplicationStatus(app._id, 'Approved', notes || '');
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Enter rejection reason:');
                              if (notes) updateApplicationStatus(app._id, 'Rejected', notes);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-full transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pets Tab */}
            {activeTab === 'pets' && (
              <>
                <div className="text-center mb-8">
                  <button
                    onClick={() => setShowAddPetForm(!showAddPetForm)}
                    className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-4 px-8 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
                  >
                    {showAddPetForm ? 'Cancel' : '+ Add New Pet'}
                  </button>
                </div>

                {showAddPetForm && <AddPetForm onSuccess={() => { setShowAddPetForm(false); fetchData(); }} />}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {pets.map((pet) => (
                    <div key={pet._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                        <span className="text-7xl">
                          {pet.animalType === 'Dog' ? '🐕' : 
                           pet.animalType === 'Cat' ? '🐈' : 
                           pet.animalType === 'Bird' ? '🦜' :
                           pet.animalType === 'Rabbit' ? '🐰' : '🐾'}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-primary-700 mb-2">{pet.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {pet.breed} • {pet.age} years • {pet.gender}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                          pet.adoptionStatus === 'Available' ? 'bg-green-100 text-green-800' :
                          pet.adoptionStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pet.adoptionStatus}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/pet/${pet._id}`)}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-full transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deletePet(pet._id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-full transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Add Pet Form Component
const AddPetForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    animalType: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    color: '',
    description: '',
    temperament: '',
    vaccinated: false,
    neutered: false,
    healthIssues: '',
    adoptionFee: '',
    shelter: '',
    city: '',
    state: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const petData = {
      name: formData.name,
      animalType: formData.animalType,
      breed: formData.breed,
      age: parseInt(formData.age),
      gender: formData.gender,
      size: formData.size,
      color: formData.color,
      description: formData.description,
      temperament: formData.temperament.split(',').map(t => t.trim()).filter(t => t),
      medicalHistory: {
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        healthIssues: formData.healthIssues,
      },
      location: {
        shelter: formData.shelter,
        city: formData.city,
        state: formData.state,
      },
      adoptionFee: formData.adoptionFee ? parseInt(formData.adoptionFee) : 0,
    };

    try {
      const response = await fetch('http://localhost:3000/api/animals', {
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h3 className="text-2xl font-bold text-primary-700 mb-6">Add New Pet</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          name="name"
          placeholder="Pet Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          name="animalType"
          value={formData.animalType}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="breed"
          placeholder="Breed *"
          value={formData.breed}
          onChange={handleChange}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="number"
          name="age"
          placeholder="Age *"
          value={formData.age}
          onChange={handleChange}
          required
          min="0"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="number"
          name="adoptionFee"
          placeholder="Adoption Fee ($)"
          value={formData.adoptionFee}
          onChange={handleChange}
          min="0"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <textarea
        name="description"
        placeholder="Description *"
        value={formData.description}
        onChange={handleChange}
        required
        rows="4"
        className="w-full mt-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      ></textarea>

      <input
        type="text"
        name="temperament"
        placeholder="Temperament (comma separated: Friendly, Playful, Calm)"
        value={formData.temperament}
        onChange={handleChange}
        className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <input
          type="text"
          name="shelter"
          placeholder="Shelter Name"
          value={formData.shelter}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-6 mt-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="vaccinated"
            checked={formData.vaccinated}
            onChange={handleChange}
            className="w-5 h-5 text-primary-600"
          />
          <span className="font-semibold">Vaccinated</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="neutered"
            checked={formData.neutered}
            onChange={handleChange}
            className="w-5 h-5 text-primary-600"
          />
          <span className="font-semibold">Neutered/Spayed</span>
        </label>
      </div>

      <textarea
        name="healthIssues"
        placeholder="Health Issues (optional)"
        value={formData.healthIssues}
        onChange={handleChange}
        rows="3"
        className="w-full mt-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      ></textarea>

      <button
        type="submit"
        className="w-full mt-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition"
      >
        Add Pet
      </button>
    </form>
  );
};

export default AdminDashboard;
