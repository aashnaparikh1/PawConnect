import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const PetProfileDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPetData();
  }, [id]);

  const fetchPetData = async () => {
    try {
      setLoading(true);

      // Fetch pet profile
      const petRes = await fetch(`http://localhost:3000/api/pet-profiles/${id}`, {
        headers: getAuthHeaders(),
      });
      const petData = await petRes.json();
      setPet(petData);

      // Fetch health logs
      const logsRes = await fetch(`http://localhost:3000/api/health-logs/pet/${id}`, {
        headers: getAuthHeaders(),
      });
      const logsData = await logsRes.json();
      setHealthLogs(logsData);

      // Fetch reminders for this pet
      const remindersRes = await fetch(`http://localhost:3000/api/reminders?completed=false`, {
        headers: getAuthHeaders(),
      });
      const remindersData = await remindersRes.json();
      setReminders(remindersData.filter(r => r.pet?._id === id));

    } catch (error) {
      console.error('Error fetching pet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async () => {
    if (!window.confirm(`Are you sure you want to delete ${pet.name}'s profile?`)) return;

    try {
      const response = await fetch(`http://localhost:3000/api/pet-profiles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        alert('Pet profile deleted successfully');
        navigate('/my-pets');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
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
          onClick={() => navigate('/my-pets')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
        >
          ← Back to My Pets
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Pet Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 md:p-12 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <span className="text-9xl">
                  {pet.species === 'Dog' ? '🐕' : 
                   pet.species === 'Cat' ? '🐈' : 
                   pet.species === 'Bird' ? '🦜' :
                   pet.species === 'Rabbit' ? '🐰' : '🐾'}
                </span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{pet.name}</h1>
                  <p className="text-xl opacity-90">{pet.breed || pet.species}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/pet-profile/${id}/edit`)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-full font-semibold transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={deletePet}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-semibold transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Age</p>
                <p className="text-2xl font-bold">{pet.age || 'N/A'} years</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Weight</p>
                <p className="text-2xl font-bold">{pet.weight || 'N/A'} kg</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Health Logs</p>
                <p className="text-2xl font-bold">{healthLogs.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <p className="text-sm opacity-80 mb-1">Reminders</p>
                <p className="text-2xl font-bold">{reminders.length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-4 font-semibold border-b-4 transition ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className={`px-8 py-4 font-semibold border-b-4 transition ${
                  activeTab === 'health'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600'
                }`}
              >
                Health Logs
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`px-8 py-4 font-semibold border-b-4 transition ${
                  activeTab === 'reminders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600'
                }`}
              >
                Reminders
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Basic Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-primary-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Species</p>
                      <p className="text-xl font-semibold text-gray-800">{pet.species}</p>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Breed</p>
                      <p className="text-xl font-semibold text-gray-800">{pet.breed || 'Mixed'}</p>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Gender</p>
                      <p className="text-xl font-semibold text-gray-800">{pet.gender}</p>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Color</p>
                      <p className="text-xl font-semibold text-gray-800">{pet.color || 'N/A'}</p>
                    </div>
                    {pet.dateOfBirth && (
                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {new Date(pet.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {pet.microchipId && (
                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Microchip ID</p>
                        <p className="text-xl font-semibold text-gray-800">{pet.microchipId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Information */}
                {pet.medicalInfo && (
                  <div>
                    <h2 className="text-2xl font-bold text-primary-700 mb-4">Medical Information</h2>
                    <div className="bg-accent-50 p-6 rounded-xl space-y-4">
                      {pet.medicalInfo.allergies && pet.medicalInfo.allergies.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Allergies</p>
                          <div className="flex flex-wrap gap-2">
                            {pet.medicalInfo.allergies.map((allergy, i) => (
                              <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {pet.medicalInfo.conditions && pet.medicalInfo.conditions.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Medical Conditions</p>
                          <div className="flex flex-wrap gap-2">
                            {pet.medicalInfo.conditions.map((condition, i) => (
                              <span key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {pet.medicalInfo.medications && pet.medicalInfo.medications.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Current Medications</p>
                          <div className="flex flex-wrap gap-2">
                            {pet.medicalInfo.medications.map((med, i) => (
                              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {pet.medicalInfo.veterinarian && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Veterinarian</p>
                          <div className="space-y-1">
                            <p className="font-semibold">{pet.medicalInfo.veterinarian.name}</p>
                            {pet.medicalInfo.veterinarian.clinic && (
                              <p className="text-gray-700">{pet.medicalInfo.veterinarian.clinic}</p>
                            )}
                            {pet.medicalInfo.veterinarian.phone && (
                              <p className="text-primary-600">{pet.medicalInfo.veterinarian.phone}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Health Logs Tab */}
            {activeTab === 'health' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary-700">Health Diary</h2>
                  <button
                    onClick={() => navigate(`/health-logs/add?petId=${id}`)}
                    className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-6 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
                  >
                    + Add Log
                  </button>
                </div>

                {healthLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-8xl">📝</span>
                    <p className="mt-4 text-xl text-gray-600">No health logs yet</p>
                    <button
                      onClick={() => navigate(`/health-logs/add?petId=${id}`)}
                      className="mt-6 bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition"
                    >
                      Add First Log
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {healthLogs.map((log) => (
                      <div
                        key={log._id}
                        className="bg-primary-50 p-6 rounded-xl hover:bg-primary-100 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">
                              {log.logType === 'Vaccination' ? '💉' :
                               log.logType === 'Medication' ? '💊' :
                               log.logType === 'Vet Visit' ? '🏥' :
                               log.logType === 'Weight' ? '⚖️' :
                               log.logType === 'Grooming' ? '✂️' :
                               log.logType === 'Exercise' ? '🏃' :
                               log.logType === 'Diet' ? '🍖' :
                               log.logType === 'Symptom' ? '🤒' : '📝'}
                            </span>
                            <div>
                              <h3 className="text-xl font-bold text-primary-700">{log.title}</h3>
                              <p className="text-sm text-gray-600">
                                {log.logType} • {new Date(log.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        {log.description && (
                          <p className="text-gray-700 mb-3">{log.description}</p>
                        )}
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="flex flex-wrap gap-3 text-sm">
                            {log.details.weight && (
                              <span className="bg-white px-3 py-1 rounded-full">
                                Weight: {log.details.weight} kg
                              </span>
                            )}
                            {log.details.temperature && (
                              <span className="bg-white px-3 py-1 rounded-full">
                                Temp: {log.details.temperature}°C
                              </span>
                            )}
                            {log.details.cost && (
                              <span className="bg-white px-3 py-1 rounded-full">
                                Cost: ${log.details.cost}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reminders Tab */}
            {activeTab === 'reminders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary-700">Upcoming Reminders</h2>
                  <button
                    onClick={() => navigate(`/reminders/add?petId=${id}`)}
                    className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-6 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
                  >
                    + Add Reminder
                  </button>
                </div>

                {reminders.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-8xl">⏰</span>
                    <p className="mt-4 text-xl text-gray-600">No reminders set</p>
                    <button
                      onClick={() => navigate(`/reminders/add?petId=${id}`)}
                      className="mt-6 bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition"
                    >
                      Add First Reminder
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder._id}
                        className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-3xl">
                              {reminder.reminderType === 'Vaccination' ? '💉' :
                               reminder.reminderType === 'Medication' ? '💊' :
                               reminder.reminderType === 'Vet Appointment' ? '🏥' :
                               reminder.reminderType === 'Grooming' ? '✂️' :
                               reminder.reminderType === 'Food' ? '🍖' :
                               reminder.reminderType === 'Exercise' ? '🏃' : '📅'}
                            </span>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {reminder.title}
                              </h3>
                              <p className="text-gray-700 mb-2">{reminder.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>📅 {new Date(reminder.dueDate).toLocaleDateString()}</span>
                                <span className="bg-yellow-200 px-3 py-1 rounded-full font-semibold">
                                  {reminder.reminderType}
                                </span>
                                {reminder.recurring.enabled && (
                                  <span className="bg-blue-100 px-3 py-1 rounded-full font-semibold">
                                    🔁 {reminder.recurring.frequency}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/reminders`)}
                            className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                          >
                            Manage →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileDetail;
