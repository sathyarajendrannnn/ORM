import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import reviewService from '../../services/reviewService';
import { detectFakeReview, getRiskColor } from '../../utils/fakeReviewDetector';

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    productService: '',
    isAnonymous: false
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [detection, setDetection] = useState(null);

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const reviews = await reviewService.getMyReviews();
      const review = reviews.find(r => r.id === parseInt(id));
      if (review) {
        setFormData({
          title: review.title,
          content: review.content,
          rating: review.rating,
          productService: review.productService,
          isAnonymous: review.isAnonymous || false
        });
        setDetection(detectFakeReview(review.content));
      }
    } catch (error) {
      setError('Failed to fetch review');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'rating' ? parseInt(value) : value)
    }));

    if (name === 'content') {
      setDetection(detectFakeReview(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await reviewService.updateReview(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">Edit Review</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="productService" className="block text-sm font-medium text-gray-700">
                Product/Service Name
              </label>
              <input
                type="text"
                id="productService"
                name="productService"
                required
                value={formData.productService}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Review Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength="100"
                value={formData.title}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Your Review
              </label>
              <textarea
                id="content"
                name="content"
                rows="6"
                required
                maxLength="1000"
                value={formData.content}
                onChange={handleChange}
                className="input-field mt-1"
              />
              
              {detection && detection.isFake && (
                <div className={`mt-3 p-3 rounded-lg ${getRiskColor(detection.risk)}`}>
                  <p className="text-sm font-medium">
                    ⚠️ Fake Review Risk: {detection.risk} ({detection.score})
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                Post as Anonymous (Your name will not be shown publicly)
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Review'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReview;