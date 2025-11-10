import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const AdoptionApplication = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({
    homeType: '',
    hasYard: false,
    otherPets: false,
    otherPetsDetails: '',
    experience: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/animals/${id}`);
      const data = await response.json();
      setPet(data);
    } catch (error) {
      console.error('Error fetching pet:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          animalId: id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      alert('Application submitted successfully! We will review it soon.');
      navigate('/my-applications');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-center text-primary-700 mb-3">
            Adoption Application
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Applying to adopt <span className="font-bold text-primary-600">{pet.name}</span>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Home Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                What type of home do you live in? *
              </label>
              <select
                name="homeType"
                value={formData.homeType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select...</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Condo">Condo</option>
                <option value="Farm">Farm</option>
              </select>
            </div>

            {/* Has Yard */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hasYard"
                checked={formData.hasYard}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-gray-700 font-semibold">
                Do you have a fenced yard?
              </label>
            </div>

            {/* Other Pets */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="otherPets"
                checked={formData.otherPets}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-3 text-gray-700 font-semibold">
                Do you have other pets?
              </label>
            </div>

            {/* Other Pets Details */}
            {formData.otherPets && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Please describe your other pets
                </label>
                <textarea
                  name="otherPetsDetails"
                  value={formData.otherPetsDetails}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
            )}

            {/* Experience */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Do you have experience with {pet.animalType}s?
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your experience with pets..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Why do you want to adopt {pet.name}? *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tell us why you would be a great match..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/pet/${id}`)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionApplication;
