import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAuthenticated, getAuthHeaders } from '../utils/auth';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResourceDetail();
  }, [id]);

  const fetchResourceDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/resources/${id}`);
      const data = await response.json();
      setResource(data.resource);
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          resourceId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setNewReview({ rating: 5, comment: '' });
        fetchResourceDetail();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Resource not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => navigate('/resources')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
        >
          ← Back to Resources
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">{resource.name}</h1>
                <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full font-semibold">
                  {resource.type}
                </span>
              </div>
              {resource.verified && (
                <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Rating */}
            {resource.ratings.count > 0 && (
              <div className="mb-8 flex items-center gap-4">
                <div className="flex text-3xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(resource.ratings.average) ? 'text-yellow-500' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-700">{resource.ratings.average.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">({resource.ratings.count} reviews)</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-3">About</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{resource.description}</p>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-primary-700 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {resource.contact.phone && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <a href={`tel:${resource.contact.phone}`} className="text-primary-600 font-semibold hover:text-primary-700">
                          {resource.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {resource.contact.email && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a href={`mailto:${resource.contact.email}`} className="text-primary-600 font-semibold hover:text-primary-700">
                          {resource.contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {resource.contact.website && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <a href={resource.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:text-primary-700">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary-700 mb-4">Location</h3>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    {resource.address.street && <p className="text-gray-700">{resource.address.street}</p>}
                    <p className="text-gray-700">
                      {resource.address.city}, {resource.address.state} {resource.address.zipCode}
                    </p>
                  </div>
                </div>
                {resource.hours && (
                  <div className="flex items-start gap-3 mt-4">
                    <span className="text-2xl">🕒</span>
                    <div>
                      <p className="text-sm text-gray-600">Hours</p>
                      <p className="text-gray-700 font-semibold">{resource.hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {resource.services && resource.services.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary-700 mb-4">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.services.map((service, index) => (
                    <span key={index} className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-semibold">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-6">Reviews</h2>

              {/* Submit Review */}
              {isAuthenticated() && (
                <form onSubmit={handleSubmitReview} className="bg-primary-50 p-6 rounded-xl mb-8">
                  <h3 className="text-lg font-bold text-primary-700 mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                      <option value={3}>⭐⭐⭐ (3 stars)</option>
                      <option value={2}>⭐⭐ (2 stars)</option>
                      <option value={1}>⭐ (1 star)</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                      rows="4"
                      placeholder="Share your experience..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 px-8 rounded-full hover:from-primary-600 hover:to-primary-700 transition"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-800">
                            {review.user.firstName} {review.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
