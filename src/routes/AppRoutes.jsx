import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard'; // Ensure this is imported

export default function AppRoutes() {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* If Not Authenticated, show Login. If Authenticated, go Home */}
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" />} />
        
        {/* If Not Authenticated, show Register. If Authenticated, go Home */}
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" />} />
        
        {/* Protected Route */}
        <Route path="/Dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}