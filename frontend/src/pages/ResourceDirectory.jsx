import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ResourceDirectory = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    state: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(`http://localhost:3000/api/resources?${params}`);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ type: '', city: '', state: '', search: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4">
            Resource Directory 🏥
          </h1>
          <p className="text-xl text-gray-600">
            Find local animal welfare resources in your area
          </p>
        </div>

        {/* Add Resource Button */}
        {isAuthenticated() && (
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/resources/add')}
              className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold py-3 px-8 rounded-full hover:from-accent-600 hover:to-accent-700 transition"
            >
              + Submit a Resource
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Filter Resources</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="Veterinary">Veterinary</option>
              <option value="Shelter">Shelter</option>
              <option value="Pet Store">Pet Store</option>
              <option value="Grooming">Grooming</option>
              <option value="Training">Training</option>
              <option value="Emergency">Emergency</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={filters.state}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={resetFilters}
            className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
          >
            Reset Filters
          </button>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-9xl">🏥</span>
            <p className="mt-6 text-2xl text-gray-600 font-semibold">No resources found</p>
            <button
              onClick={resetFilters}
              className="mt-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-full transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource._id}
                onClick={() => navigate(`/resources/${resource._id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
              >
                <div className="bg-gradient-to-br from-primary-100 to-accent-100 p-6 flex items-center justify-center h-32">
                  <span className="text-6xl">
                    {resource.type === 'Veterinary' ? '🏥' :
                     resource.type === 'Shelter' ? '🏠' :
                     resource.type === 'Pet Store' ? '🛒' :
                     resource.type === 'Grooming' ? '✂️' :
                     resource.type === 'Training' ? '🎓' :
                     resource.type === 'Emergency' ? '🚨' : '📍'}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-primary-700">{resource.name}</h3>
                    {resource.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <span className="inline-block bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {resource.type}
                  </span>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>📍</span>
                    <span>{resource.address.city}, {resource.address.state}</span>
                  </div>
                  {resource.ratings.count > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.round(resource.ratings.average) ? 'text-yellow-500' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({resource.ratings.count} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDirectory;
