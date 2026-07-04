import React, { useState } from 'react';
import API from '../../api';

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      await API.post('/auth/change-password', { currentPassword, newPassword });
      setMsg('Password changed successfully.');
      setIsError(false);
      setCurrentPassword('');
      setNewPassword('');
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
        <div className="col-lg-5">
          <div className="mb-4">
            <p className="section-label mb-1">Account</p>
            <h3 className="mb-0 fw-semibold">Change Password</h3>
          </div>

          {msg && (
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} d-flex align-items-center gap-2`}>
              <i className={`fas ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}></i>
              <span>{msg}</span>
            </div>
          )}

          <div className="card">
            <div className="card-body p-4">
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>
                  ) : ('Change Password')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
