import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/events?${filter}=true`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4">
            Community Events 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Join animal welfare events in your community
          </p>
        </div>

        {/* Add Event Button (Admin/Shelter only) */}
        {user && (user.role === 'admin' || user.role === 'shelter') && (
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/events/create')}
              className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-8 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
            >
              + Create Event
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              filter === 'upcoming'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-8 py-3 rounded-full font-semibold transition ${
              filter === 'past'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            Past Events
          </button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-9xl">📅</span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">
              No {filter} events found
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
              >
                <div className="bg-gradient-to-br from-primary-100 to-accent-100 h-48 flex items-center justify-center">
                  <span className="text-8xl">
                    {event.eventType === 'Adoption Drive' ? '🐕' :
                     event.eventType === 'Fundraiser' ? '💰' :
                     event.eventType === 'Workshop' ? '🎓' :
                     event.eventType === 'Community Meetup' ? '👥' :
                     event.eventType === 'Awareness Campaign' ? '📢' : '🎉'}
                  </span>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {event.eventType}
                  </span>
                  <h3 className="text-2xl font-bold text-primary-700 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📅</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {event.location?.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📍</span>
                        <span>{event.location.city}, {event.location.state}</span>
                      </div>
                    )}
                    {event.isVirtual && (
                      <div className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                        <span>💻</span>
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {event.rsvps.length} attending
                    </span>
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
