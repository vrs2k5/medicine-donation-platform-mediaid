import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setErr('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center py-5">
      <div className="w-100" style={{ maxWidth: '440px' }}>
        <div className="card auth-card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="auth-card-header text-center text-white py-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 mb-2" style={{ width: 56, height: 56 }}>
              <i className="fas fa-lock fs-4"></i>
            </div>
            <h4 className="mb-0 fw-semibold">Set a New Password</h4>
            <p className="mb-0 small opacity-75">Choose something you haven't used before</p>
          </div>
          <div className="card-body p-4 p-md-5">
            {err && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="fas fa-triangle-exclamation"></i>
                <span>{err}</span>
              </div>
            )}
            {message && (
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <i className="fas fa-circle-check"></i>
                <span>{message}</span>
              </div>
            )}
            <form onSubmit={submit} noValidate>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    minLength="6"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    minLength="6"
                  />
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary btn-lg rounded-3" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Resetting...
                    </>
                  ) : ('Reset Password')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
