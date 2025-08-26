import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense} from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load all components
const LoginScreen = lazy(() => import('./pages/loginScreen'));
const SignInScreen = lazy(() => import('./pages/signInScreen'));
const CheckUser = lazy(() => import('./pages/CheckUser'));
const NotFound = lazy(() => import('./pages/page_not_found'));
const Admin = lazy(() => import('./pages/ADMIN'));
const UserHomeScreen=lazy(()=>import('./pages/userHomeScreen'))
const Clearances=lazy(()=>import('./pages/grantedClearances'))

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && (!user || !user.isAdmin)) { // Assuming user object has an isAdmin property
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return ( // the ? should not be spaced
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/signIn" element={<SignInScreen />} />
              <Route path="/Check user" element={<ProtectedRoute><CheckUser /></ProtectedRoute>} />
              <Route path= "/Home" element={<ProtectedRoute><UserHomeScreen/></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
              <Route path="/clearances" element={<ProtectedRoute><Clearances/></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;