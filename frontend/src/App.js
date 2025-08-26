import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load all components
const LoginScreen = lazy(() => import('./pages/loginScreen'));
const SignInScreen = lazy(() => import('./pages/signInScreen'));
const NotFound = lazy(() => import('./pages/page_not_found'));
const Admin = lazy(() => import('./pages/ADMIN'));
const UserHomeScreen = lazy(() => import('./pages/userHomeScreen'));
const Clearances = lazy(() => import('./pages/grantedClearances'));
const AdminLoginScreen = lazy(() => import('./pages/ADMIN_LOGIN'));
const AdminSignInScreen = lazy(() => import('./pages/ADMIN_SIGNIN'));

// Protected route for regular users
const UserProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    // Redirect to the main login page if not logged in
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected route for administrators
const AdminProtectedRoute = ({ children }) => {
  const { isAdminLoggedIn } = useAuth();
  if (!isAdminLoggedIn) {
    // Redirect to the admin login page if not logged in as an admin
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

// A simple loading spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LoginScreen />} />
              <Route path="/signIn" element={<SignInScreen />} />
              <Route path="/admin-signIn" element={<AdminSignInScreen />} />
              <Route path="/admin-login" element={<AdminLoginScreen />} />

              {/* Protected User Routes */}
              <Route path="/Home" element={<UserProtectedRoute><UserHomeScreen /></UserProtectedRoute>} />
              <Route path="/clearances" element={<UserProtectedRoute><Clearances /></UserProtectedRoute>} />

              {/* Protected Admin Route */}
              <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />

              {/* Catch-all 404 Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;