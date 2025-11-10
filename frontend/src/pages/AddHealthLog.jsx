import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const AddHealthLog = () => {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId');
  const [myPets, setMyPets] = useState([]);
  const [formData, setFormData] = useState({
    pet: petId || '',
    logType: 'Vet Visit',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    weight: '',
    temperature: '',
    medication: '',
    dosage: '',
    veterinarian: '',
    cost: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      setMyPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const logData = {
        pet: formData.pet,
        logType: formData.logType,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        details: {
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
          medication: formData.medication || undefined,
          dosage: formData.dosage || undefined,
          veterinarian: formData.veterinarian || undefined,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
        },
        notes: formData.notes,
      };

      const response = await fetch('http://localhost:3000/api/health-logs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        throw new Error('Failed to add health log');
      }

      alert('Health log added successfully!');
      if (petId) {
        navigate(`/pet-profile/${petId}`);
      } else {
        navigate('/my-pets');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-center text-primary-700 mb-3">
            Add Health Log 📝
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Track your pet's health and care events
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Pet *</label>
              <select
                name="pet"
                value={formData.pet}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a pet...</option>
                {myPets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Log Type *</label>
              <select
                name="logType"
                value={formData.logType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Vaccination">💉 Vaccination</option>
                <option value="Medication">💊 Medication</option>
                <option value="Vet Visit">🏥 Vet Visit</option>
                <option value="Weight">⚖️ Weight Check</option>
                <option value="Grooming">✂️ Grooming</option>
                <option value="Exercise">🏃 Exercise</option>
                <option value="Diet">🍖 Diet/Feeding</option>
                <option value="Symptom">🤒 Symptom</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Annual checkup, Rabies vaccination"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Add details about this health event..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            {/* Additional Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="10.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Temperature (°C)</label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="38.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Medication</label>
                  <input
                    type="text"
                    name="medication"
                    value={formData.medication}
                    onChange={handleChange}
                    placeholder="Medicine name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    placeholder="e.g., 2 tablets daily"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Veterinarian</label>
                  <input
                    type="text"
                    name="veterinarian"
                    value={formData.veterinarian}
                    onChange={handleChange}
                    placeholder="Dr. Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Cost ($)</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="50.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional notes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Health Log'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHealthLog;
