import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Signin from './components/Signin';
import LoadingScreen from './components/LoadingScreen';
import expensifyLogo from './assets/expensify_logo.png';
import api from './api/axios';

function DashboardLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed on backend:', error);
    } finally {
      localStorage.removeItem('auth_token');
      navigate('/signin');
    }
  };

  return (
    <div>
      <nav className="top-nav">
        <div className="nav-left">
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={expensifyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          Expensify
        </div>
        <div className="nav-right">
          <div onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Sign Out</span>
          </div>
        </div>
      </nav>
      <Dashboard />
      <footer>
        © 2024 Expensify. All rights reserved.
      </footer>
    </div>
  );
}

function AuthLoading() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingScreen message="Authenticating..." />;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      } />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/loading" element={<AuthLoading />} />
    </Routes>
  );
}

export default App;
