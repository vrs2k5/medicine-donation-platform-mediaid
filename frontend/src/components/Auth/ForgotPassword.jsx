import React, { useState } from 'react';
import API from '../../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/check-security-question', { email });
      setSecurityQuestion(res.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error fetching security question');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/reset-password-security-question', { email, securityAnswer, newPassword });
      setMessage('Password reset successfully');
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="container mt-5">
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <h3>Forgot Password</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetSubmit}>
          <h3>Answer Security Question</h3>
          <div className="mb-3">
            <label>{securityQuestion}</label>
            <input type="text" className="form-control" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Reset Password</button>
        </form>
      )}

      {step === 3 && (
        <div>
          <h3>{message}</h3>
          <a href="/login">Go to Login</a>
        </div>
      )}

      {message && step !== 3 && <div className="alert alert-danger mt-3">{message}</div>}
    </div>
  );
}
