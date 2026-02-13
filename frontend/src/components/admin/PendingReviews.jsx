import { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';

const PendingReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const data = await reviewService.getPendingReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id, status) => {
    try {
      await reviewService.moderateReview(id, status);
      fetchPendingReviews();
    } catch (error) {
      alert('Failed to moderate review');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Pending Reviews</h1>
        <p className="text-yellow-100">Moderate reviews submitted by users</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending reviews</h3>
          <p className="mt-1 text-sm text-gray-500">All reviews have been moderated.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{review.title}</h3>
                    <p className="text-sm text-gray-600">{review.productService}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      PENDING
                    </span>
                    {/* ✅ FAKE DETECTION - ONLY VISIBLE TO ADMIN */}
                    {review.isSuspectedFake && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ⚠️ SUSPECTED FAKE REVIEW
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.content}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      By: <span className="font-medium">{review.authorName}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* ✅ FAKE SCORE - ONLY VISIBLE TO ADMIN */}
                  {review.fakeReviewScore !== undefined && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      review.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' :
                      review.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Fake Review Risk: {review.riskLevel} ({review.fakeReviewScore})
                    </span>
                  )}
                </div>

                {/* ✅ FAKE REVIEW WARNING - ONLY VISIBLE TO ADMIN */}
                {review.isSuspectedFake && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">⚠️ FAKE REVIEW DETECTION ALERT</h4>
                    <p className="text-sm text-red-700">
                      This review has been flagged as potentially fake (Score: {review.fakeReviewScore}/100).
                      Please review carefully before approving.
                    </p>
                    <ul className="text-xs text-red-600 mt-2 list-disc list-inside">
                      <li>Contains suspicious keywords</li>
                      <li>Unusual pattern detected</li>
                      <li>Recommend: Reject or investigate further</li>
                    </ul>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleModerate(review.id, 'APPROVED')}
                    className="btn-success"
                  >
                    Approve Review
                  </button>
                  <button
                    onClick={() => handleModerate(review.id, 'REJECTED')}
                    className="btn-danger"
                  >
                    Reject Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingReviews;