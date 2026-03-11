import React, { useState, useEffect } from 'react';
import { adminService, doctorService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

const specialtyColors = {
    'Cardiology': { bg: '#fef3c7', color: '#d97706', icon: '❤️' },
    'Pediatrics': { bg: '#d1fae5', color: '#059669', icon: '👶' },
    'Neurology': { bg: '#ede9fe', color: '#7c3aed', icon: '🧠' },
    'Orthopedics': { bg: '#dbeafe', color: '#1d4ed8', icon: '🦴' },
    'Dermatology': { bg: '#fce7f3', color: '#db2777', icon: '🌟' },
};

const getSpecialtyStyle = (spec) => specialtyColors[spec] || { bg: '#e0f2fe', color: '#0369a1', icon: '🏥' };

const defaultDoctorForm = {
    name: '', email: '', password: '', specialization: '', department: '', fee: '', experience: '',
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics');
    const [appointmentsReport, setAppointmentsReport] = useState({});
    const [revenueReport, setRevenueReport] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [doctorForm, setDoctorForm] = useState(defaultDoctorForm);
    const [toast, setToast] = useState({ text: '', type: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchReports();
        fetchDoctors();
    }, []);

    const fetchReports = async () => {
        try {
            const [appRes, revRes] = await Promise.all([
                adminService.getAppointmentsReport(),
                adminService.getRevenueReport()
            ]);
            setAppointmentsReport(appRes.data);
            setRevenueReport(revRes.data);
        } catch (err) { console.error(err); }
    };

    const fetchDoctors = async () => {
        try {
            const res = await doctorService.search('');
            setDoctors(res.data);
        } catch (err) { console.error(err); }
    };

    const showToast = (text, type = 'success') => {
        setToast({ text, type });
        setTimeout(() => setToast({ text: '', type: '' }), 3000);
    };

    const openAddModal = () => {
        setEditingDoctor(null);
        setDoctorForm(defaultDoctorForm);
        setShowModal(true);
    };

    const openEditModal = (doc) => {
        setEditingDoctor(doc);
        setDoctorForm({
            name: doc.name || '',
            email: doc.email || '',
            password: '',
            specialization: doc.specialization || '',
            department: doc.department || '',
            fee: doc.fee || '',
            experience: doc.experience || '',
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
    };

    const handleSaveDoctor = async () => {
        try {
            const payload = { ...doctorForm, fee: parseFloat(doctorForm.fee) || 0 };
            if (editingDoctor) {
                await doctorService.update(editingDoctor.id, payload);
                showToast('Doctor updated successfully!');
            } else {
                await doctorService.create(payload);
                showToast('Doctor added successfully!');
            }
            setShowModal(false);
            fetchDoctors();
        } catch (err) {
            showToast('Failed to save doctor.', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await doctorService.delete(id);
            showToast('Doctor deleted successfully.');
            setDeleteConfirm(null);
            fetchDoctors();
        } catch {
            showToast('Failed to delete doctor.', 'error');
        }
    };

    const totalRevenue = Object.values(revenueReport).reduce((a, b) => a + b, 0);

    return (
        <div className="admin-dashboard">
            {/* Toast */}
            {toast.text && (
                <div className={`toast toast-${toast.type}`}>{toast.text}</div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>⚠️ Confirm Delete</h3>
                        <p>Are you sure you want to remove <strong>{deleteConfirm.name}</strong> from the system?</p>
                        <div className="modal-actions">
                            <button className="btn-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn-modal-delete" onClick={() => handleDelete(deleteConfirm.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Doctor Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box modal-large" onClick={e => e.stopPropagation()}>
                        <h3>{editingDoctor ? '✏️ Edit Doctor' : '➕ Add New Doctor'}</h3>
                        <div className="modal-form-grid">
                            {[
                                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Dr. Full Name' },
                                { label: 'Email', name: 'email', type: 'email', placeholder: 'doctor@hms.com' },
                                { label: 'Password', name: 'password', type: 'password', placeholder: editingDoctor ? 'Leave blank to keep current' : 'Password' },
                                { label: 'Specialization', name: 'specialization', type: 'text', placeholder: 'e.g. Cardiology' },
                                { label: 'Department', name: 'department', type: 'text', placeholder: 'e.g. Cardiology Dept' },
                                { label: 'Consultation Fee (₹)', name: 'fee', type: 'number', placeholder: '500' },
                                { label: 'Experience', name: 'experience', type: 'text', placeholder: 'e.g. 10 years' },
                            ].map(f => (
                                <div className="form-group" key={f.name}>
                                    <label>{f.label}</label>
                                    <input
                                        type={f.type}
                                        name={f.name}
                                        placeholder={f.placeholder}
                                        value={doctorForm[f.name]}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-modal-save" onClick={handleSaveDoctor}>
                                {editingDoctor ? 'Save Changes' : 'Add Doctor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="text-muted">Welcome back, {user?.name}</p>
                </div>
                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        📊 Analytics
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctors')}
                    >
                        👨‍⚕️ Doctor Management
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-card" style={{ borderTop: '3px solid #4f46e5' }}>
                    <div className="stat-card-icon" style={{ background: '#eef2ff' }}>📋</div>
                    <div>
                        <p className="stat-card-label">Total Doctors</p>
                        <h2 className="stat-card-value">{doctors.length}</h2>
                    </div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid #22c55e' }}>
                    <div className="stat-card-icon" style={{ background: '#dcfce7' }}>💰</div>
                    <div>
                        <p className="stat-card-label">Est. Revenue</p>
                        <h2 className="stat-card-value">₹{totalRevenue.toFixed(0)}</h2>
                    </div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
                    <div className="stat-card-icon" style={{ background: '#fef3c7' }}>📈</div>
                    <div>
                        <p className="stat-card-label">Productivity</p>
                        <h2 className="stat-card-value">94.2%</h2>
                    </div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid #ec4899' }}>
                    <div className="stat-card-icon" style={{ background: '#fce7f3' }}>🏥</div>
                    <div>
                        <p className="stat-card-label">Appointments</p>
                        <h2 className="stat-card-value">{Object.values(appointmentsReport).reduce((a, b) => a + b, 0)}</h2>
                    </div>
                </div>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="analytics-grid">
                    <div className="admin-card">
                        <h3 className="card-section-title">📋 Appointments Per Doctor</h3>
                        {Object.keys(appointmentsReport).length === 0 ? (
                            <p className="empty-state">No appointment data yet.</p>
                        ) : Object.entries(appointmentsReport).map(([name, count]) => (
                            <div key={name} className="report-row">
                                <span>{name}</span>
                                <div className="report-bar-wrap">
                                    <div className="report-bar" style={{ width: `${Math.min(100, count * 20)}%` }} />
                                </div>
                                <span className="report-count">{count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="admin-card">
                        <h3 className="card-section-title">💰 Revenue Per Department</h3>
                        {Object.keys(revenueReport).length === 0 ? (
                            <p className="empty-state">No revenue data yet.</p>
                        ) : Object.entries(revenueReport).map(([dept, rev]) => (
                            <div key={dept} className="report-row">
                                <span>{dept}</span>
                                <span className="revenue-amount">₹{rev.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Doctor Management Tab */}
            {activeTab === 'doctors' && (
                <div className="admin-card">
                    <div className="card-header-row">
                        <h3 className="card-section-title">👨‍⚕️ All Doctors</h3>
                        <button className="btn-add-doctor" onClick={openAddModal}>
                            ➕ Add Doctor
                        </button>
                    </div>
                    <div className="doctors-table-wrap">
                        <table className="doctors-table">
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Department</th>
                                    <th>Experience</th>
                                    <th>Fee</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doc => {
                                    const style = getSpecialtyStyle(doc.specialization);
                                    return (
                                        <tr key={doc.id}>
                                            <td>
                                                <div className="table-doctor-name">
                                                    <div className="table-doc-avatar" style={{ background: style.bg }}>
                                                        {style.icon}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{doc.name}</div>
                                                        <div className="text-sm text-muted">{doc.email || '—'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="spec-pill" style={{ background: style.bg, color: style.color }}>
                                                    {doc.specialization}
                                                </span>
                                            </td>
                                            <td className="text-muted">{doc.department}</td>
                                            <td>{doc.experience || '—'}</td>
                                            <td className="font-semibold">₹{doc.fee}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="btn-edit" onClick={() => openEditModal(doc)}>✏️ Edit</button>
                                                    <button className="btn-delete" onClick={() => setDeleteConfirm(doc)}>🗑️ Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
