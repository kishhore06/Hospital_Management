import React, { useState, useEffect } from 'react';
import { adminService, appointmentService } from '../services/api.js';
import { BarChart3, DollarSign, XCircle, TrendingUp, Users } from '../components/Icons.js';

const AdminDashboard = () => {
  const [appointmentsReport, setAppointmentsReport] = useState({});
  const [revenueReport, setRevenueReport] = useState({});
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Fixed admin ID for demo (Admin One from DataInitializer)
  const ADMIN_ID = 1;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [appRes, revRes] = await Promise.all([
        adminService.getAppointmentsReport(),
        adminService.getRevenueReport()
      ]);
      setAppointmentsReport(appRes.data);
      setRevenueReport(revRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="mb-4">
        <h1>Administrative Analytics</h1>
        <p className="text-muted">Monitor hospital performance and manage critical overrides.</p>
      </header>

      <div className="grid mb-5" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'}}>
        <div className="card" style={{borderLeft: '4px solid var(--primary)'}}>
          <div className="d-flex align-center gap-2 mb-2 text-muted">
            <Users size={18} /> Total Doctors Active
          </div>
          <h2 className="mb-0">{Object.keys(appointmentsReport).length}</h2>
        </div>
        <div className="card" style={{borderLeft: '4px solid var(--success)'}}>
          <div className="d-flex align-center gap-2 mb-2 text-muted">
            <DollarSign size={18} /> Total Revenue (Estimated)
          </div>
          <h2 className="mb-0">${Object.values(revenueReport).reduce((a, b) => a + b, 0).toFixed(2)}</h2>
        </div>
        <div className="card" style={{borderLeft: '4px solid var(--secondary)'}}>
          <div className="d-flex align-center gap-2 mb-2 text-muted">
            <TrendingUp size={18} /> Productivity Ratio
          </div>
          <h2 className="mb-0">94.2%</h2>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="d-flex align-center gap-2 mb-4">
            <BarChart3 size={20} color="#4f46e5" />
            <h3 className="mb-0">Appointments Per Doctor</h3>
          </div>
          <div className="report-list">
            {Object.entries(appointmentsReport).map(([name, count]) => (
              <div key={name} className="d-flex justify-between align-center py-2 border-b">
                <span>{name}</span>
                <span className="badge badge-booked">{count} Appts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="d-flex align-center gap-2 mb-4">
            <DollarSign size={20} color="#22c55e" />
            <h3 className="mb-0">Revenue Per Department</h3>
          </div>
          <div className="report-list">
            {Object.entries(revenueReport).map(([dept, rev]) => (
              <div key={dept} className="d-flex justify-between align-center py-2 border-b">
                <span>{dept}</span>
                <span className="font-bold text-success">${rev.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .mb-5 { margin-bottom: 2rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .border-b { border-bottom: 1px solid var(--border); }
        .font-bold { font-weight: 700; }
        .text-success { color: var(--success); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
