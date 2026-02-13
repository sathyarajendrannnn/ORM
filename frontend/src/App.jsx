import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/user/Dashboard';
import CreateReview from './components/user/CreateReview';
import MyReviews from './components/user/MyReviews';
import EditReview from './components/user/EditReview';
import ApprovedReviews from './components/public/ApprovedReviews';
import AdminDashboard from './components/admin/AdminDashboard';
import PendingReviews from './components/admin/PendingReviews';
import ManageUsers from './components/admin/ManageUsers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/approved-reviews" element={<ApprovedReviews />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/create-review" element={
            <PrivateRoute>
              <CreateReview />
            </PrivateRoute>
          } />
          <Route path="/my-reviews" element={
            <PrivateRoute>
              <MyReviews />
            </PrivateRoute>
          } />
          <Route path="/edit-review/:id" element={
            <PrivateRoute>
              <EditReview />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/pending" element={
            <AdminRoute>
              <PendingReviews />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          } />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/approved-reviews" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;