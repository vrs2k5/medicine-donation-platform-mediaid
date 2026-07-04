import React, { useState } from 'react';
import API from '../../api';

export default function RequestAppointment() {
  const [requestedDate, setRequestedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      await API.post('/appointments/request', { requestedDate, notes });
      setMsg('Appointment requested successfully.');
      setIsError(false);
      setRequestedDate('');
      setNotes('');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="mb-4">
            <p className="section-label mb-1">NGO</p>
            <h3 className="mb-0 fw-semibold">Request Appointment</h3>
          </div>

          {msg && (
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} d-flex align-items-center gap-2`} role="alert">
              <i className={`fas ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}></i>
              <span>{msg}</span>
            </div>
          )}

          <div className="card">
            <div className="card-body p-4">
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
                <div className="mb-4">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Anything the admin should know about this pickup"
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                  ) : (
                    <><i className="fas fa-calendar-plus me-2"></i>Request Appointment</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
