import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';

// Lazy load all components
const LoginScreen = lazy(() => import('./pages/loginScreen'));
const SignInScreen = lazy(() => import('./pages/signInScreen'));
const CheckUser = lazy(() => import('./pages/CheckUser'));
const NotFound = lazy(() => import('./pages/page_not_found'));
const Admin = lazy(() => import('./pages/ADMIN'));
const UserHomeScreen=lazy(()=>import('./pages/userHomeScreen'))
const Clearances=lazy(()=>import('./pages/grantedClearances'))

function App() {
  const isLoggedIn=true;
  const isAdmin=true;

  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/signIn" element={<SignInScreen />} />
            <Route path="/Check user" element={isLoggedIn ? <CheckUser /> : <Navigate to={"/"}/> } />
            <Route path= "/Home" element={isLoggedIn ? <UserHomeScreen/> : <Navigate to={"/"}/> } />
            <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to={"/"} />} />
            <Route path="/clearances" element={isLoggedIn ? <Clearances/> : <Navigate to={"/"}/> } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
