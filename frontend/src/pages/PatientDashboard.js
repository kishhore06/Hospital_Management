import React, { useState, useEffect } from 'react';
import { doctorService, appointmentService } from '../services/api.js';
import { Search, Calendar, Clock, User, CheckCircle } from '../components/Icons.js';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Fixed patient ID for demo (John Doe from DataInitializer)
  const PATIENT_ID = 4;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (spec = '') => {
    try {
      const res = await doctorService.search(spec);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(search);
  };

  const handleBook = async () => {
    if (!bookingSlot || !selectedDoctor) return;
    try {
      const appointment = {
        patientId: PATIENT_ID,
        doctorId: selectedDoctor.id,
        appointmentDate: bookingSlot.date,
        startTime: bookingSlot.startTime,
        endTime: bookingSlot.endTime,
      };
      await appointmentService.book(appointment);
      setMsg({ text: 'Appointment booked successfully!', type: 'success' });
      setBookingSlot(null);
      setSelectedDoctor(null);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Booking failed (Overlap or Unavailable)', type: 'error' });
    }
  };

  return (
    <div className="patient-dashboard">
      <header className="mb-4">
        <h1 className="mb-2">Find a Specialist</h1>
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="flex-grow-1 position-relative">
            <Search className="position-absolute" style={{left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b'}} size={18} />
            <input 
              type="text" 
              className="input pl-10" 
              placeholder="Search by specialization (e.g. Cardiology)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{paddingLeft: '40px'}}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </header>

      {msg.text && (
        <div className={`badge badge-${msg.type} mb-4`} style={{display: 'block', padding: '1rem', textAlign: 'center'}}>
          {msg.text}
        </div>
      )}

      <div className="grid">
        {doctors.map(doc => (
          <div key={doc.id} className="card">
            <div className="d-flex align-center mb-3">
              <div style={{background: '#eef2ff', padding: '12px', borderRadius: '12px', marginRight: '1rem'}}>
                <User size={24} color="#4f46e5" />
              </div>
              <div>
                <h3 className="mb-0">{doc.name}</h3>
                <span className="badge badge-booked" style={{fontSize: '0.7rem'}}>{doc.specialization}</span>
              </div>
            </div>
            <p className="text-muted mb-4 small">{doc.department} • Fee: ${doc.fee}</p>
            
            <div className="slots">
              <h5 className="mb-2">Available Slots</h5>
              {doc.availableSlots.map((slot, i) => (
                <button 
                  key={i} 
                  className={`btn btn-outline mb-2 w-100 ${bookingSlot === slot ? 'active-slot' : ''}`}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setBookingSlot(slot);
                  }}
                  style={bookingSlot === slot ? {borderColor: '#4f46e5', background: '#eef2ff'} : {}}
                >
                  <Calendar size={14} /> {slot.date} • <Clock size={14} /> {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>

            {selectedDoctor?.id === doc.id && bookingSlot && (
              <button className="btn btn-primary w-100 mt-4" onClick={handleBook}>
                Confirm Booking
              </button>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mr-2 { margin-right: 0.5rem; }
        .w-100 { width: 100%; }
        .text-muted { color: #64748b; }
        .small { font-size: 0.875rem; }
        .d-flex { display: flex; }
        .align-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .flex-grow-1 { flex-grow: 1; }
        .position-relative { position: relative; }
        .position-absolute { position: absolute; }
      `}</style>
    </div>
  );
};

export default PatientDashboard;
