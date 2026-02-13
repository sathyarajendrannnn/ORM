import { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import authService from '../../services/authService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching users...');
      const data = await reviewService.getAllUsers();
      console.log('✅ Users received:', data);
      setUsers(data);
    } catch (error) {
      console.error('❌ Error in fetchUsers:', error);
      setError(typeof error === 'string' ? error : 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setProcessingId(userId);
    setError('');
    setSuccessMessage('');

    try {
      console.log(`🔄 Changing user ${userId} role from ${currentRole} to ${newRole}`);
      const updatedUser = await reviewService.updateUserRole(userId, newRole);
      console.log('✅ Role updated:', updatedUser);
      
      // Update the users list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: updatedUser.role } : user
      ));
      
      setSuccessMessage(`User role updated to ${newRole} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Role change error:', error);
      setError(typeof error === 'string' ? error : 'Failed to update user role');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action CANNOT be undone!`)) {
      return;
    }

    setProcessingId(userId);
    setError('');
    setSuccessMessage('');

    try {
      console.log(`🗑️ Deleting user ${userId}...`);
      await reviewService.deleteUser(userId);
      console.log('✅ User deleted successfully');
      
      // Remove user from the list
      setUsers(users.filter(user => user.id !== userId));
      
      setSuccessMessage(`User "${userName}" deleted successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Delete user error:', error);
      setError(typeof error === 'string' ? error : 'Failed to delete user');
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'USER':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Users</h1>
            <p className="text-purple-100">View and manage all registered users</p>
          </div>
          <button
            onClick={fetchUsers}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Error:</span> {error}
          </div>
          <button 
            onClick={fetchUsers}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-gray-900">No users found</p>
                    <p className="mt-1 text-sm text-gray-500">New users will appear here when they register.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const currentUser = authService.getCurrentUser();
                  const isCurrentUser = currentUser?.id === user.id;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-gray-500">(You)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {/* Role Change Button */}
                          <button
                            onClick={() => handleRoleChange(user.id, user.role)}
                            disabled={processingId === user.id || isCurrentUser}
                            className={`
                              px-3 py-1 rounded-lg text-xs font-medium transition duration-200
                              ${isCurrentUser 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : processingId === user.id
                                  ? 'bg-gray-100 text-gray-400 cursor-wait'
                                  : user.role === 'USER'
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }
                            `}
                            title={isCurrentUser ? "Cannot change your own role" : ""}
                          >
                            {processingId === user.id ? (
                              <div className="flex items-center">
                                <div className="animate-spin h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                                Updating...
                              </div>
                            ) : (
                              user.role === 'USER' ? 'Make Admin' : 'Remove Admin'
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={processingId === user.id || isCurrentUser}
                            className={`
                              px-3 py-1 rounded-lg text-xs font-medium transition duration-200
                              ${isCurrentUser 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : processingId === user.id
                                  ? 'bg-gray-100 text-gray-400 cursor-wait'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }
                            `}
                            title={isCurrentUser ? "Cannot delete your own account" : ""}
                          >
                            {processingId === user.id ? (
                              <div className="flex items-center">
                                <div className="animate-spin h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                                Deleting...
                              </div>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer with user count */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Total users: <span className="font-semibold">{users.length}</span>
            </span>
            <span className="text-xs text-gray-500">
              {users.filter(u => u.role === 'ADMIN').length} Admins • {users.filter(u => u.role === 'USER').length} Regular Users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;