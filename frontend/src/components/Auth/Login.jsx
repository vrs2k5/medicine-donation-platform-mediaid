import React, { useState } from 'react';
import API from '../../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const submit=async(e)=>{
    e.preventDefault();
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
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg">
          <div className="card-header text-center bg-primary text-white">
            <h4 className="mb-0"><i className="fas fa-sign-in-alt me-2"></i>Login</h4>
          </div>
          <div className="card-body">
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <div className="d-grid">
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Logging in...</> : <><i className="fas fa-sign-in-alt me-2"></i>Login</>}
                </button>
              </div>
            </form>
            <div className="text-center mt-3">
              <p className="mb-1"><Link to="/forgot-password" className="text-primary">Forgot Password?</Link></p>
              <p className="mb-0">Don't have an account? <Link to="/register" className="text-primary">Register here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
