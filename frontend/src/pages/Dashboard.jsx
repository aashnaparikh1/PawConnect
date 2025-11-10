import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, getUser } from '../utils/auth';

const Dashboard = () => {
  const [stats, setStats] = useState({
    applications: [],
    myPets: [],
    upcomingReminders: [],
    upcomingEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch applications
      const appsRes = await fetch('http://localhost:3000/api/applications/my-applications', {
        headers: getAuthHeaders(),
      });
      const applications = await appsRes.json();

      // Fetch my pets
      const petsRes = await fetch('http://localhost:3000/api/pet-profiles/my-pets', {
        headers: getAuthHeaders(),
      });
      const myPets = await petsRes.json();

      // Fetch reminders
      const remindersRes = await fetch('http://localhost:3000/api/reminders?completed=false', {
        headers: getAuthHeaders(),
      });
      const reminders = await remindersRes.json();

      // Fetch upcoming events
      const eventsRes = await fetch('http://localhost:3000/api/events?upcoming=true');
      const events = await eventsRes.json();

      setStats({
        applications: applications.slice(0, 5),
        myPets: myPets.slice(0, 4),
        upcomingReminders: reminders.slice(0, 5),
        upcomingEvents: events.slice(0, 3),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-lg opacity-90">
            Here's what's happening with your pets and adoption journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">My Pets</p>
                <p className="text-3xl font-bold text-primary-700">{stats.myPets.length}</p>
              </div>
              <span className="text-5xl">🐾</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-accent-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Applications</p>
                <p className="text-3xl font-bold text-accent-700">{stats.applications.length}</p>
              </div>
              <span className="text-5xl">📋</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Reminders</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.upcomingReminders.length}</p>
              </div>
              <span className="text-5xl">⏰</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Events</p>
                <p className="text-3xl font-bold text-green-700">{stats.upcomingEvents.length}</p>
              </div>
              <span className="text-5xl">🎉</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Pets Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">My Pets</h2>
              <button
                onClick={() => navigate('/my-pets')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All →
              </button>
            </div>

            {stats.myPets.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-6xl">🐕</span>
                <p className="mt-4 text-gray-600">No pets yet</p>
                <button
                  onClick={() => navigate('/my-pets')}
                  className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition"
                >
                  Add Your First Pet
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.myPets.map((pet) => (
                  <div
                    key={pet._id}
                    onClick={() => navigate(`/pet-profile/${pet._id}`)}
                    className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition cursor-pointer"
                  >
                    <span className="text-4xl">
                      {pet.species === 'Dog' ? '🐕' : 
                       pet.species === 'Cat' ? '🐈' : 
                       pet.species === 'Bird' ? '🦜' :
                       pet.species === 'Rabbit' ? '🐰' : '🐾'}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-primary-700">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.breed || pet.species} • {pet.age ? `${pet.age} years` : 'Age unknown'}
                      </p>
                    </div>
                    <span className="text-primary-600">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">Upcoming Reminders</h2>
              <button
                onClick={() => navigate('/reminders')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All →
              </button>
            </div>

            {stats.upcomingReminders.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-6xl">⏰</span>
                <p className="mt-4 text-gray-600">No upcoming reminders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingReminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
                  >
                    <span className="text-2xl">
                      {reminder.reminderType === 'Vaccination' ? '💉' :
                       reminder.reminderType === 'Medication' ? '💊' :
                       reminder.reminderType === 'Vet Appointment' ? '🏥' :
                       reminder.reminderType === 'Grooming' ? '✂️' : '📅'}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{reminder.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(reminder.dueDate).toLocaleDateString()}
                        {reminder.pet && ` • ${reminder.pet.name}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">My Applications</h2>
              <button
                onClick={() => navigate('/my-applications')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All →
              </button>
            </div>

            {stats.applications.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-6xl">📋</span>
                <p className="mt-4 text-gray-600">No applications yet</p>
                <button
                  onClick={() => navigate('/pets')}
                  className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition"
                >
                  Browse Pets
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{app.animal?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                        app.status === 'Approved' ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-700">Upcoming Events</h2>
              <button
                onClick={() => navigate('/events')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All →
              </button>
            </div>

            {stats.upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-6xl">🎉</span>
                <p className="mt-4 text-gray-600">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition cursor-pointer"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📅</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {event.location?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>📍</span>
                        <span>{event.location.city}, {event.location.state}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
