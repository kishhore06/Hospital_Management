import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import PatientDashboard from './pages/PatientDashboard.js';
import DoctorDashboard from './pages/DoctorDashboard.js';
import AdminDashboard from './pages/AdminDashboard.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import { Hospital, UserCircle, Stethoscope } from './components/Icons.js';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="logo d-flex align-center">
          <Hospital size={28} className="mr-2" style={{color: '#4f46e5'}} />
          HMS Elite
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Patient
          </NavLink>
          <NavLink to="/doctor" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Doctor
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin
          </NavLink>
          <div className="auth-nav-links" style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Login
            </NavLink>
            <NavLink to="/signup" className="nav-link-btn" style={{ 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Sign Up
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
