import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load all components
const LoginScreen = lazy(() => import('./pages/loginScreen'));
const SignInScreen = lazy(() => import('./pages/signInScreen'));
const CheckUser = lazy(() => import('./CheckUser'));
const NotFound = lazy(() => import('./pages/page_not_found'));
const Admin = lazy(() => import('./pages/ADMIN'));

function App() {

  const isAdmin=false;
  const isLoggedin=true;//this will come from the backend

  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/signIn" element={<SignInScreen />} />
            <Route path="/Home" element={isLoggedin ? <CheckUser /> : <Navigate to={"/"}/> } />
            <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to={"/"} />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
