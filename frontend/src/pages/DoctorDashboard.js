import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const statusConfig = {
    BOOKED: { color: '#1d4ed8', bg: '#dbeafe', label: 'Booked' },
    CONFIRMED: { color: '#059669', bg: '#d1fae5', label: 'Confirmed' },
    COMPLETED: { color: '#475569', bg: '#f1f5f9', label: 'Completed' },
    CANCELLED: { color: '#991b1b', bg: '#fee2e2', label: 'Cancelled' },
};

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [toast, setToast] = useState({ text: '', type: '' });
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        if (user?.id) fetchSchedule();
    }, [user]);

    const fetchSchedule = async () => {
        try {
            const res = await appointmentService.getDoctorSchedule(user.id);
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast({ text: '', type: '' }), 3000);
    };

    const handleConfirm = async (id) => {
        try {
            await appointmentService.confirm(id, user.id);
            showToast('✅ Appointment confirmed!');
            fetchSchedule();
        } catch {
            showToast('❌ Failed to confirm appointment.', 'error');
        }
    };

    const handleComplete = async (id) => {
        try {
            await appointmentService.complete(id, user.id);
            showToast('✅ Appointment marked as completed!');
            fetchSchedule();
        } catch {
            showToast('❌ Failed to complete appointment.', 'error');
        }
    };

    const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

    const counts = appointments.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="doctor-dashboard">
            {toast.text && (
                <div className={`toast toast-${toast.type}`}>{toast.text}</div>
            )}

            <div className="dashboard-header">
                <div>
                    <h1>My Schedule</h1>
                    <p className="text-muted">Welcome, {user?.name}! Manage your patient appointments below.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="stats-row">
                {Object.entries(statusConfig).map(([status, cfg]) => (
                    <div key={status} className="stat-card" style={{ borderTop: `3px solid ${cfg.color}` }}>
                        <div className="stat-card-icon" style={{ background: cfg.bg }}>
                            {status === 'BOOKED' ? '📋' : status === 'CONFIRMED' ? '✅' : status === 'COMPLETED' ? '🏁' : '❌'}
                        </div>
                        <div>
                            <p className="stat-card-label">{cfg.label}</p>
                            <h2 className="stat-card-value">{counts[status] || 0}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['ALL', 'BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
                    <button
                        key={f}
                        className={`filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'ALL' ? `All (${appointments.length})` : `${statusConfig[f]?.label} (${counts[f] || 0})`}
                    </button>
                ))}
            </div>

            {/* Appointments */}
            <div className="appointments-list">
                {filtered.length === 0 && (
                    <div className="empty-state-box">
                        <span style={{ fontSize: '3rem' }}>📭</span>
                        <p>No appointments in this category.</p>
                    </div>
                )}
                {filtered.map(app => {
                    const cfg = statusConfig[app.status] || statusConfig.BOOKED;
                    return (
                        <div key={app.id} className="appointment-card">
                            <div className="appt-card-left">
                                <div className="appt-patient-icon">👤</div>
                                <div>
                                    <h4>Patient ID #{app.patientId}</h4>
                                    <p className="text-muted small">Appointment #{app.id}</p>
                                </div>
                            </div>
                            <div className="appt-card-mid">
                                <span className="appt-info-item">📅 {app.appointmentDate}</span>
                                <span className="appt-info-item">🕐 {app.startTime} – {app.endTime}</span>
                            </div>
                            <div className="appt-card-right">
                                <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
                                    {cfg.label}
                                </span>
                                {app.status === 'BOOKED' && (
                                    <button className="btn-action btn-confirm" onClick={() => handleConfirm(app.id)}>
                                        ✅ Confirm
                                    </button>
                                )}
                                {app.status === 'CONFIRMED' && (
                                    <button className="btn-action btn-complete" onClick={() => handleComplete(app.id)}>
                                        🏁 Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DoctorDashboard;
