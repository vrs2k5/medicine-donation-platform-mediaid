import React, { useState } from 'react';
import API from '../../api';

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/change-password', { currentPassword, newPassword });
      setMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Change Password</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Change Password</button>
      </form>
    </div>
  );
}
