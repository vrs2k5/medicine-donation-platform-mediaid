import React, { useState } from 'react';
import API from '../../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [err,setErr]=useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const submit=async(e)=>{
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
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
              <i className="fas fa-sign-in-alt fs-4"></i>
            </div>
            <h4 className="mb-0 fw-semibold">Welcome Back</h4>
            <p className="mb-0 small opacity-75">Log in to continue to MediAid</p>
          </div>
          <div className="card-body p-4 p-md-5">
            {err && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="fas fa-triangle-exclamation"></i>
                <span>{err}</span>
              </div>
            )}
            <form onSubmit={submit} noValidate>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-envelope text-muted"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="fas fa-lock text-muted"></i></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light"
                    onClick={() => setShowPassword(s => !s)}
                    tabIndex={-1}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                  </button>
                </div>
              </div>
              <div className="d-grid mt-4">
                <button className="btn btn-primary btn-lg rounded-3" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>
            </form>
            <div className="text-center mt-4">
              <p className="mb-1"><Link to="/forgot-password">Forgot Password?</Link></p>
              <p className="mb-0 text-muted small">Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
