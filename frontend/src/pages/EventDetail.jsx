import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAuthenticated, getAuthHeaders, getUser } from '../utils/auth';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRSVP, setUserRSVP] = useState(null);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${id}`);
      const data = await response.json();
      setEvent(data);

      // Check if user has RSVP'd
      if (user) {
        const rsvp = data.rsvps.find(r => r.user._id === user._id);
        setUserRSVP(rsvp);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/events/${id}/rsvp`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert('RSVP updated successfully!');
        fetchEventDetail();
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => navigate('/events')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 md:p-12 text-white">
            <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full font-semibold mb-4">
              {event.eventType}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-lg">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              {event.location?.city && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.location.city}, {event.location.state}</span>
                </div>
              )}
              {event.isVirtual && (
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span>💻</span>
                  <span>Virtual Event</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-4">About This Event</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-primary-700 mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {event.organizer && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="text-sm text-gray-600">Organized by</p>
                        <p className="font-semibold text-gray-800">
                          {event.organizer.firstName} {event.organizer.lastName}
                        </p>
                      </div>
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <div>
                        <p className="text-sm text-gray-600">Capacity</p>
                        <p className="font-semibold text-gray-800">
                          {event.rsvps.filter(r => r.status === 'Going').length} / {event.capacity} attending
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary-700 mb-4">Location</h3>
                {event.isVirtual ? (
                  <div className="bg-accent-50 p-4 rounded-xl">
                    <p className="text-gray-700 mb-2">This is a virtual event</p>
                    {event.virtualLink && (
                      <a
                        href={event.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-600 font-semibold hover:text-accent-700"
                      >
                        Join Virtual Event →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {event.location?.venue && (
                      <p className="font-semibold text-gray-800">{event.location.venue}</p>
                    )}
                    {event.location?.address && (
                      <p className="text-gray-700">{event.location.address}</p>
                    )}
                    <p className="text-gray-700">
                      {event.location?.city}, {event.location?.state}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RSVP Section */}
            <div className="border-t pt-8 mb-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-6">RSVP to this Event</h3>
              
              {userRSVP ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                  <p className="text-green-800 font-semibold mb-4">
                    You're {userRSVP.status === 'Going' ? 'attending' : userRSVP.status === 'Maybe' ? 'marked as maybe' : 'not attending'} this event
                  </p>
                  <p className="text-sm text-gray-600">Change your RSVP:</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleRSVP('Going')}
                  className={`flex-1 min-w-[150px] py-4 rounded-full font-bold transition ${
                    userRSVP?.status === 'Going'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                  }`}
                >
                  ✓ Going
                </button>
                <button
                  onClick={() => handleRSVP('Maybe')}
                  className={`flex-1 min-w-[150px] py-4 rounded-full font-bold transition ${
                    userRSVP?.status === 'Maybe'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  ? Maybe
                </button>
                <button
                  onClick={() => handleRSVP('Not Going')}
                  className={`flex-1 min-w-[150px] py-4 rounded-full font-bold transition ${
                    userRSVP?.status === 'Not Going'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white border-2 border-gray-500 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ✗ Can't Go
                </button>
              </div>
            </div>

            {/* Attendees */}
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-6">
                Attendees ({event.rsvps.filter(r => r.status === 'Going').length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {event.rsvps
                  .filter(rsvp => rsvp.status === 'Going')
                  .slice(0, 20)
                  .map((rsvp) => (
                    <div
                      key={rsvp._id}
                      className="bg-primary-50 px-4 py-2 rounded-full"
                    >
                      <span className="font-semibold text-primary-700">
                        {rsvp.user.firstName} {rsvp.user.lastName}
                      </span>
                    </div>
                  ))}
                {event.rsvps.filter(r => r.status === 'Going').length > 20 && (
                  <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-gray-600">
                      +{event.rsvps.filter(r => r.status === 'Going').length - 20} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
