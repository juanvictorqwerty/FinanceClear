import './App.css';
import CheckUser from './CheckUser';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/loginScreen';
import SignInScreen from './pages/signInScreen';
import NotFound from './pages/page_not_found';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/signIn" element={<SignInScreen />} />
          <Route path="/Home" element={<CheckUser />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;