import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api.js';
import { CheckCircle, Clock, Calendar, User } from '../components/Icons.js';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Fixed doctor ID for demo (Dr. Smith from DataInitializer)
  const DOCTOR_ID = 2;

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await appointmentService.getDoctorSchedule(DOCTOR_ID);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await appointmentService.confirm(id, DOCTOR_ID);
      setMsg({ text: 'Appointment confirmed!', type: 'success' });
      fetchSchedule();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: 'Failed to confirm', type: 'error' });
    }
  };

  const handleComplete = async (id) => {
    try {
      await appointmentService.complete(id, DOCTOR_ID);
      setMsg({ text: 'Appointment completed!', type: 'success' });
      fetchSchedule();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: 'Failed to complete', type: 'error' });
    }
  };

  return (
    <div className="doctor-dashboard">
      <header className="mb-4">
        <h1>Doctor's Schedule</h1>
        <p className="text-muted">Manage your daily appointments and patient confirmations.</p>
      </header>

      {msg.text && (
        <div className={`badge badge-${msg.type} mb-4`} style={{display: 'block', padding: '1rem', textAlign: 'center'}}>
          {msg.text}
        </div>
      )}

      <div className="grid">
        {appointments.length === 0 && <p>No appointments scheduled yet.</p>}
        {appointments.map(app => (
          <div key={app.id} className="card">
            <div className="d-flex justify-between align-center mb-3">
              <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
              <span className="text-muted small">ID: #{app.id}</span>
            </div>
            
            <div className="d-flex align-center mb-3">
              <div style={{background: '#f1f5f9', padding: '10px', borderRadius: '10px', marginRight: '1rem'}}>
                <User size={20} color="#64748b" />
              </div>
              <div>
                <h4 className="mb-0">Patient ID: {app.patientId}</h4>
                <p className="small text-muted">Awaiting consultation</p>
              </div>
            </div>

            <div className="d-flex gap-4 mb-4">
              <div className="d-flex align-center gap-1 small">
                <Calendar size={14} /> {app.appointmentDate}
              </div>
              <div className="d-flex align-center gap-1 small">
                <Clock size={14} /> {app.startTime} - {app.endTime}
              </div>
            </div>

            {app.status === 'BOOKED' && (
              <button 
                className="btn btn-primary w-100"
                onClick={() => handleConfirm(app.id)}
              >
                <CheckCircle size={16} /> Confirm Appointment
              </button>
            )}

            {app.status === 'CONFIRMED' && (
              <button 
                className="btn btn-primary w-100"
                onClick={() => handleComplete(app.id)}
                style={{background: 'var(--success)'}}
              >
                <CheckCircle size={16} /> Mark Completed
              </button>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .justify-between { justify-content: space-between; }
        .gap-4 { gap: 1rem; }
        .gap-1 { gap: 0.25rem; }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
