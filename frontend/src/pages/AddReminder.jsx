import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const AddReminder = () => {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId');
  const [myPets, setMyPets] = useState([]);
  const [formData, setFormData] = useState({
    pet: petId || '',
    title: '',
    description: '',
    dueDate: '',
    reminderType: 'Vet Appointment',
    recurring: false,
    frequency: 'Monthly',
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
      const reminderData = {
        pet: formData.pet || undefined,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        reminderType: formData.reminderType,
        recurring: {
          enabled: formData.recurring,
          frequency: formData.recurring ? formData.frequency : undefined,
        },
      };

      const response = await fetch('http://localhost:3000/api/reminders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reminderData),
      });

      if (!response.ok) {
        throw new Error('Failed to add reminder');
      }

      alert('Reminder added successfully!');
      navigate('/reminders');
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
            Add Reminder ⏰
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Schedule important pet care tasks
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pet (Optional)</label>
              <select
                name="pet"
                value={formData.pet}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">General Reminder</option>
                {myPets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Reminder Type *</label>
              <select
                name="reminderType"
                value={formData.reminderType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Vaccination">💉 Vaccination</option>
                <option value="Medication">💊 Medication</option>
                <option value="Vet Appointment">🏥 Vet Appointment</option>
                <option value="Grooming">✂️ Grooming</option>
                <option value="Food">🍖 Food/Supplies</option>
                <option value="Exercise">🏃 Exercise</option>
                <option value="Other">📅 Other</option>
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
                placeholder="e.g., Rabies vaccination due"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Add any additional details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-gray-700 font-semibold">
                  Make this a recurring reminder
                </label>
              </div>

              {formData.recurring && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/reminders')}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Reminder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReminder;
