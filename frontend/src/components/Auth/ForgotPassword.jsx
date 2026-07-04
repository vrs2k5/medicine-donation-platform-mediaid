import React, { useState } from 'react';
import API from '../../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/check-security-question', { email });
      setSecurityQuestion(res.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching security question');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/reset-password-security-question', { email, securityAnswer, newPassword });
      setMessage('Your password has been reset successfully.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
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
              <i className="fas fa-key fs-4"></i>
            </div>
            <h4 className="mb-0 fw-semibold">Reset Your Password</h4>
            <p className="mb-0 small opacity-75">
              {step === 1 && "Enter your email to get started"}
              {step === 2 && "Verify your identity"}
              {step === 3 && "All done"}
            </p>
          </div>

          <div className="card-body p-4 p-md-5">
            {/* Step indicator */}
            {step !== 3 && (
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <span className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 1 ? 'text-white' : 'text-muted'}`}
                      style={{ width: 28, height: 28, fontSize: '0.8rem', fontWeight: 600, background: step >= 1 ? '#128a7d' : '#e3e8ed' }}>1</span>
                <span style={{ width: 32, height: 2, background: step >= 2 ? '#128a7d' : '#e3e8ed' }}></span>
                <span className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 2 ? 'text-white' : 'text-muted'}`}
                      style={{ width: 28, height: 28, fontSize: '0.8rem', fontWeight: 600, background: step >= 2 ? '#128a7d' : '#e3e8ed' }}>2</span>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="fas fa-triangle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleEmailSubmit} noValidate>
                <div className="mb-4">
                  <label className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="fas fa-envelope text-muted"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg rounded-3" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Checking...
                      </>
                    ) : ('Continue')}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">{securityQuestion}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={securityAnswer}
                    onChange={e => setSecurityAnswer(e.target.value)}
                    required
                    placeholder="Your answer"
                  />
                </div>
                <div className="mb-4">
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
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg rounded-3" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Resetting...
                      </>
                    ) : ('Reset Password')}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="alert alert-success d-flex align-items-center gap-2 justify-content-center" role="alert">
                  <i className="fas fa-circle-check"></i>
                  <span>{message}</span>
                </div>
                <a href="/login" className="btn btn-primary rounded-3 mt-2">Go to Login</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
