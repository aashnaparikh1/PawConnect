import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../utils/auth';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [statusFilter, searchTerm, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/applications/my-applications', {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setApplications(data);

      // Calculate stats
      const stats = {
        total: data.length,
        pending: data.filter(app => app.status === 'Pending').length,
        approved: data.filter(app => app.status === 'Approved').length,
        rejected: data.filter(app => app.status === 'Rejected').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.animal?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.animal?.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Approved':
        return '✅';
      case 'Rejected':
        return '❌';
      case 'Completed':
        return '🎉';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4">
            My Adoption Applications 📋
          </h1>
          <p className="text-xl text-gray-600">
            Track the status of your pet adoption applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Applications</p>
                <p className="text-4xl font-bold text-primary-700">{stats.total}</p>
              </div>
              <span className="text-5xl">📋</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending Review</p>
                <p className="text-4xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <span className="text-5xl">⏳</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Approved</p>
                <p className="text-4xl font-bold text-green-700">{stats.approved}</p>
              </div>
              <span className="text-5xl">✅</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Rejected</p>
                <p className="text-4xl font-bold text-red-700">{stats.rejected}</p>
              </div>
              <span className="text-5xl">❌</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by pet name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <span className="text-9xl">
              {applications.length === 0 ? '📋' : '🔍'}
            </span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">
              {applications.length === 0
                ? 'No adoption applications yet'
                : 'No applications match your filters'}
            </p>
            {applications.length === 0 ? (
              <>
                <p className="mt-2 text-gray-500 mb-6">
                  Start your adoption journey by browsing available pets
                </p>
                <button
                  onClick={() => navigate('/pets')}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-8 rounded-full hover:from-primary-600 hover:to-primary-700 transition transform hover:scale-105"
                >
                  Browse Available Pets
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setSearchTerm('');
                }}
                className="mt-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-[1.02]"
              >
                <div className="md:flex">
                  {/* Pet Image */}
                  <div className="md:w-1/4 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center p-8">
                    <span className="text-9xl">
                      {application.animal?.animalType === 'Dog' ? '🐕' : 
                       application.animal?.animalType === 'Cat' ? '🐈' : 
                       application.animal?.animalType === 'Bird' ? '🦜' :
                       application.animal?.animalType === 'Rabbit' ? '🐰' : '🐾'}
                    </span>
                  </div>

                  {/* Application Details */}
                  <div className="md:w-3/4 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-3xl font-bold text-primary-700 mb-2">
                          {application.animal?.name || 'Pet Name'}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {application.animal?.breed}
                          </span>
                          <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {application.animal?.age} {application.animal?.age === 1 ? 'year' : 'years'}
                          </span>
                          <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {application.animal?.gender}
                          </span>
                        </div>
                      </div>
                      <span className={`px-5 py-2 rounded-full text-sm font-bold border-2 inline-flex items-center gap-2 ${getStatusColor(application.status)}`}>
                        <span className="text-xl">{getStatusIcon(application.status)}</span>
                        {application.status}
                      </span>
                    </div>

                    {/* Application Info Grid */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Applied On</p>
                        <p className="font-bold text-gray-800">
                          {new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Home Type</p>
                        <p className="font-bold text-gray-800">{application.homeType}</p>
                      </div>

                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Has Yard</p>
                        <p className="font-bold text-gray-800">
                          {application.hasYard ? '✅ Yes' : '❌ No'}
                        </p>
                      </div>

                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Other Pets</p>
                        <p className="font-bold text-gray-800">
                          {application.otherPets ? '✅ Yes' : '❌ No'}
                        </p>
                      </div>

                      <div className="bg-primary-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Application ID</p>
                        <p className="font-bold text-gray-800 text-xs">
                          {application._id.substring(0, 8)}...
                        </p>
                      </div>

                      {application.reviewDate && (
                        <div className="bg-primary-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Reviewed On</p>
                          <p className="font-bold text-gray-800">
                            {new Date(application.reviewDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Other Pets Details */}
                    {application.otherPets && application.otherPetsDetails && (
                      <div className="bg-accent-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-gray-600 mb-1 font-semibold">About Your Other Pets:</p>
                        <p className="text-gray-800">{application.otherPetsDetails}</p>
                      </div>
                    )}

                    {/* Adoption Reason */}
                    {application.reason && (
                      <div className="bg-primary-50 p-5 rounded-xl mb-4">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Why You Want to Adopt:</p>
                        <p className="text-gray-800 leading-relaxed">{application.reason}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {application.experience && (
                      <div className="bg-accent-50 p-5 rounded-xl mb-4">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Your Experience:</p>
                        <p className="text-gray-800 leading-relaxed">{application.experience}</p>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {application.notes && (
                      <div className={`p-5 rounded-xl mb-4 border-l-4 ${
                        application.status === 'Approved' 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}>
                        <p className="text-sm text-gray-600 mb-2 font-semibold flex items-center gap-2">
                          <span className="text-xl">📝</span>
                          Message from Admin:
                        </p>
                        <p className="text-gray-800 leading-relaxed font-medium">{application.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <button
                        onClick={() => navigate(`/pet/${application.animal?._id}`)}
                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full transition transform hover:scale-105"
                      >
                        View Pet Details →
                      </button>
                      
                      {application.status === 'Approved' && (
                        <button
                          onClick={() => navigate(`/pet-profile/${application.animal?._id}`)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition transform hover:scale-105"
                        >
                          🎉 View in My Pets
                        </button>
                      )}

                      {application.status === 'Rejected' && (
                        <button
                          onClick={() => navigate('/pets')}
                          className="flex-1 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-full transition transform hover:scale-105"
                        >
                          Browse Other Pets
                        </button>
                      )}
                    </div>

                    {/* Status Timeline */}
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-3 font-semibold">Application Timeline:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Submitted</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            application.status !== 'Pending' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm text-gray-700">Under Review</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            application.status === 'Approved' || application.status === 'Completed'
                              ? 'bg-green-500'
                              : application.status === 'Rejected'
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm text-gray-700">{application.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        {applications.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
            <p className="mb-6 text-lg opacity-90">
              Have questions about your application? Our team is here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/resources')}
                className="bg-white text-primary-600 px-8 py-3 rounded-full font-bold hover:bg-primary-50 transition"
              >
                Visit Resources
              </button>
              <button
                onClick={() => navigate('/events')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-3 rounded-full font-bold transition"
              >
                View Events
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
