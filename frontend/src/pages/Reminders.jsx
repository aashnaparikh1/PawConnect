import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();
  }, [filter]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const completed = filter === 'completed' ? 'true' : 'false';
      const response = await fetch(`http://localhost:3000/api/reminders?completed=${completed}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeReminder = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reminders/${id}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        fetchReminders();
      }
    } catch (error) {
      console.error('Error completing reminder:', error);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/reminders/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        fetchReminders();
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4">
            Pet Care Reminders ⏰
          </h1>
          <p className="text-xl text-gray-600">
            Never miss important pet care tasks
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/reminders/add')}
            className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-8 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
          >
            + Add Reminder
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('pending')}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Reminders List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto"></div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-9xl">⏰</span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">
              No {filter} reminders
            </p>
            {filter === 'pending' && (
              <button
                onClick={() => navigate('/reminders/add')}
                className="mt-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition"
              >
                Add Your First Reminder
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => {
              const dueDate = new Date(reminder.dueDate);
              const today = new Date();
              const isOverdue = dueDate < today && !reminder.completed;
              const isDueSoon = dueDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) && !reminder.completed;

              return (
                <div
                  key={reminder._id}
                  className={`rounded-xl p-6 border-l-4 transition ${
                    reminder.completed
                      ? 'bg-gray-50 border-gray-400'
                      : isOverdue
                      ? 'bg-red-50 border-red-500'
                      : isDueSoon
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-green-50 border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-4xl">
                        {reminder.reminderType === 'Vaccination' ? '💉' :
                         reminder.reminderType === 'Medication' ? '💊' :
                         reminder.reminderType === 'Vet Appointment' ? '🏥' :
                         reminder.reminderType === 'Grooming' ? '✂️' :
                         reminder.reminderType === 'Food' ? '🍖' :
                         reminder.reminderType === 'Exercise' ? '🏃' : '📅'}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {reminder.title}
                        </h3>
                        {reminder.description && (
                          <p className="text-gray-700 mb-3">{reminder.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
                            reminder.completed
                              ? 'bg-gray-200 text-gray-700'
                              : isOverdue
                              ? 'bg-red-200 text-red-800'
                              : isDueSoon
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                          }`}>
                            📅 {dueDate.toLocaleDateString()}
                            {isOverdue && ' - Overdue!'}
                            {isDueSoon && !isOverdue && ' - Due Soon'}
                          </span>
                          <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full font-semibold">
                            {reminder.reminderType}
                          </span>
                          {reminder.pet && (
                            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold">
                              🐾 {reminder.pet.name}
                            </span>
                          )}
                          {reminder.recurring.enabled && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                              🔁 {reminder.recurring.frequency}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!reminder.completed && (
                        <button
                          onClick={() => completeReminder(reminder._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold transition"
                        >
                          ✓ Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteReminder(reminder._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
