import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load all components
const LoginScreen = lazy(() => import('./pages/loginScreen'));
const SignInScreen = lazy(() => import('./pages/signInScreen'));
const CheckUser = lazy(() => import('./CheckUser'));
const NotFound = lazy(() => import('./pages/page_not_found'));
const Admin = lazy(() => import('./pages/ADMIN'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/signIn" element={<SignInScreen />} />
            <Route path="/Home" element={<CheckUser />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
