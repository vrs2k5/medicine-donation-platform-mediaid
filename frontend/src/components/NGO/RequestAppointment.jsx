import React, { useState } from 'react';
import API from '../../api';

export default function RequestAppointment() {
  const [requestedDate, setRequestedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments/request', { requestedDate, notes });
      setMsg('Appointment requested successfully.');
      setRequestedDate('');
      setNotes('');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Request Appointment</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Requested Date</label>
          <input
            type="date"
            className="form-control"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <button className="btn btn-primary" type="submit">Request Appointment</button>
      </form>
    </div>
  );
}
