import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import LandlordDashboard from './pages/dashboards/LandlordDashboard';
import RelocatorDashboard from './pages/dashboards/RelocatorDashboard';
import PropertyListings from './pages/Propertylistings.tsx';
import PropertyDetail from './pages/Propertydetails';
import PropertyUpload from './pages/Propertyupload.tsx';
import MyProperties from './pages/MyProperties.tsx';

function App() {
  const { isAuthenticated, user } = useAuth();

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }: { 
    children: JSX.Element; 
    allowedRoles?: string[] 
  }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<PropertyListings />} />
        <Route path="/upload" element={<PropertyUpload />} />
        <Route path="/property/:id" element={<PropertyDetail />} />

        {/* Protected Role-based Dashboards */}
        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/landlord/properties" 
          element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <MyProperties />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/landlord/dashboard"
          element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relocator/dashboard"
          element={
            <ProtectedRoute allowedRoles={['relocator']}>
              <RelocatorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;