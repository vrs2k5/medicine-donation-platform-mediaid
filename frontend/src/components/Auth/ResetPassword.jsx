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
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg">
          <div className="card-header text-center bg-success text-white">
            <h4 className="mb-0">Reset Password</h4>
          </div>
          <div className="card-body">
            {err && <div className="alert alert-danger">{err}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <div className="d-grid">
                <button className="btn btn-success" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
