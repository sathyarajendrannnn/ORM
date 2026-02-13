import api from './api';

class ReviewService {
  // User endpoints
  async createReview(reviewData) {
    try {
      console.log('📤 Sending review to backend:', reviewData);
      const response = await api.post('/reviews', reviewData);
      console.log('📥 Backend response:', response);
      return response.data;
    } catch (error) {
      console.error('❌ ReviewService.createReview error:', error);
      throw error.response?.data || 'Failed to create review';
    }
  }

  async getMyReviews() {
    try {
      const response = await api.get('/reviews/my');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      throw error.response?.data || 'Failed to fetch reviews';
    }
  }

  async getApprovedReviews() {
    try {
      const response = await api.get('/reviews/approved');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      throw error.response?.data || 'Failed to fetch reviews';
    }
  }

  async updateReview(id, reviewData) {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Failed to update review:', error);
      throw error.response?.data || 'Failed to update review';
    }
  }

  async deleteReview(id) {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete review:', error);
      throw error.response?.data || 'Failed to delete review';
    }
  }

  // ✅ FIXED: Admin endpoints with better error handling
  async getPendingReviews() {
    try {
      const response = await api.get('/admin/reviews/pending');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch pending reviews:', error);
      throw error.response?.data || 'Failed to fetch pending reviews';
    }
  }

  async moderateReview(id, status) {
    try {
      const response = await api.put(`/admin/reviews/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to moderate review:', error);
      throw error.response?.data || 'Failed to moderate review';
    }
  }

  // ✅ FIXED: Get all users with detailed error logging
  async getAllUsers() {
    try {
      console.log('📡 Fetching all users...');
      const response = await api.get('/admin/users');
      console.log('✅ Users fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch users:');
      console.error('Error:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      
      if (error.response?.status === 403) {
        throw 'Access denied. Admin privileges required.';
      } else if (error.response?.status === 401) {
        throw 'Session expired. Please login again.';
      }
      
      throw error.response?.data || 'Failed to fetch users';
    }
  }

  async updateUserRole(id, role) {
    try {
      console.log(`📡 Updating user ${id} role to ${role}...`);
      const response = await api.put(`/admin/users/${id}/role?role=${role}`);
      console.log('✅ User role updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update user role:', error);
      throw error.response?.data || 'Failed to update user role';
    }
  }

  async deleteUser(id) {
    try {
      console.log(`📡 Deleting user ${id}...`);
      const response = await api.delete(`/admin/users/${id}`);
      console.log('✅ User deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete user:', error);
      throw error.response?.data || 'Failed to delete user';
    }
  }

  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error);
      throw error.response?.data || 'Failed to fetch stats';
    }
  }
}

export default new ReviewService();