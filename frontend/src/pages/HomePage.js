import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doctorService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const specialtyColors = {
    'Cardiology': { bg: 'rgba(254, 243, 199, 0.1)', color: '#fbbf24', icon: '❤️' },
    'Pediatrics': { bg: 'rgba(209, 250, 229, 0.1)', color: '#34d399', icon: '👶' },
    'Neurology': { bg: 'rgba(237, 233, 254, 0.1)', color: '#a78bfa', icon: '🧠' },
    'Orthopedics': { bg: 'rgba(219, 234, 254, 0.1)', color: '#60a5fa', icon: '🦴' },
    'Dermatology': { bg: 'rgba(252, 231, 243, 0.1)', color: '#f472b6', icon: '🌟' },
};
//kishhore
const getSpecialtyStyle = (spec) => specialtyColors[spec] || { bg: 'rgba(224, 242, 254, 0.1)', color: '#38bdf8', icon: '🏥' };

const HomePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        doctorService.search('').then(res => {
            setDoctors(res.data.slice(0, 4));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleGetStarted = () => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'DOCTOR') navigate('/doctor');
            else navigate('/patient');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>✨</span> Next-Gen Healthcare Management
                    </div>
                    <h1 className="hero-title">
                        Elevating <br />
                        <span className="gradient-text">Patient Care</span>
                    </h1>
                    <p className="hero-subtitle">
                        Experience the most advanced hospital management system. 
                        Seamlessly connecting patients, doctors, and administrators 
                        with real-time intelligence and premium care.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-hero-primary" onClick={handleGetStarted}>
                            {user ? 'Open Dashboard' : 'Get Started Free'}
                            <span style={{ marginLeft: '10px' }}>→</span>
                        </button>
                        <button 
                            className="btn-hero-secondary" 
                            onClick={() => document.getElementById('portals-section').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Portals
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">2.4k+</span>
                            <span className="stat-label">Active Users</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">120+</span>
                            <span className="stat-label">Specialists</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-visual-card">
                        <div className="pulse-ring"></div>
                        <div className="hero-icon-wrap">🏥</div>
                        <p className="hero-visual-title">HMS Elite</p>
                        <p className="hero-visual-sub">Intelligent Ecosystem</p>
                    </div>
                </div>
            </section>

            {/* Portals Section - ADDED AS REQUESTED */}
            <section className="portals-section" id="portals-section">
                <h2 className="section-title">Expert <span className="gradient-text">Portals</span></h2>
                <p className="section-subtitle">Dedicated interfaces for every healthcare stakeholder</p>
                <div className="portals-grid">
                    <Link to="/patient" className="portal-card">
                        <span className="portal-icon">🧑‍platform</span>
                        <h3>Patient Portal</h3>
                        <p>Book appointments, view medical history, and connect with specialists instantly.</p>
                        <div className="btn-portal">Access Dashboard →</div>
                    </Link>
                    <Link to="/doctor" className="portal-card">
                        <span className="portal-icon">👨‍⚕️</span>
                        <h3>Doctor Workspace</h3>
                        <p>Manage your clinical schedule, patient consultations, and medical reports with ease.</p>
                        <div className="btn-portal">Access Workspace →</div>
                    </Link>
                    <Link to="/admin" className="portal-card">
                        <span className="portal-icon">👨‍💼</span>
                        <h3>Admin Control</h3>
                        <p>Monitor system-wide analytics, manage hospital departments, and doctor onboarding.</p>
                        <div className="btn-portal">Access Console →</div>
                    </Link>
                </div>
            </section>

            {/* Featured Doctors */}
            <section className="featured-doctors-section" id="doctors-section" style={{ padding: '0 4rem' }}>
                <h2 className="section-title">Our <span className="gradient-text">Specialists</span></h2>
                <p className="section-subtitle">Consult with the world's leading medical experts</p>
                {loading ? (
                    <div className="loading-spinner">Waking up the experts...</div>
                ) : (
                    <div className="doctors-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {doctors.map(doc => {
                            const style = getSpecialtyStyle(doc.specialization);
                            return (
                                <div key={doc.id} className="doctor-preview-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', textAlign: 'center' }}>
                                    <div className="doc-avatar" style={{ background: style.bg, width: '80px', height: '80px', borderRadius: '20px', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
                                        <span style={{ fontSize: '2.5rem' }}>{style.icon}</span>
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{doc.name}</h3>
                                    <span className="spec-pill" style={{ background: style.bg, color: style.color }}>
                                        {doc.specialization}
                                    </span>
                                    <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{doc.department}</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontBold: '700', marginBottom: '1.5rem' }}>
                                        <span>₹{doc.fee}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>|</span>
                                        <span>{doc.experience || 'Senior'}</span>
                                    </div>
                                    <button
                                        className="btn-hero-primary"
                                        style={{ width: '100%', padding: '0.75rem' }}
                                        onClick={handleGetStarted}
                                    >
                                        Book Consultation
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="cta-section" style={{ textAlign: 'center', padding: '10rem 4rem' }}>
                <div className="cta-content" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '5rem', borderRadius: '40px' }}>
                    <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Ready to Experience <span className="gradient-text">Elite Care?</span></h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Join the future of healthcare management today.</p>
                    <button className="btn-hero-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.1rem' }} onClick={handleGetStarted}>
                        {user ? 'Return to Dashboard' : 'Join HMS Elite Now'} →
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
