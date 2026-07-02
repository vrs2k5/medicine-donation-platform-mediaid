import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Medicine Donation</Link>
        <button className="navbar-toggler" type="button" onClick={() => setExpanded(!expanded)} aria-controls="navbarNav" aria-expanded={expanded} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${expanded ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && user.role === 'member' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/member" onClick={() => setExpanded(false)}><i className="fas fa-home me-1"></i>Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/donate" onClick={() => setExpanded(false)}><i className="fas fa-plus-circle me-1"></i>Donate</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/member/history" onClick={() => setExpanded(false)}><i className="fas fa-history me-1"></i>History</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile" onClick={() => setExpanded(false)}><i className="fas fa-key me-1"></i>Change Password</Link></li>
              </>
            )}
            {user && user.role === 'ngo' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/ngo" onClick={() => setExpanded(false)}><i className="fas fa-building me-1"></i>Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/ngo/stock" onClick={() => setExpanded(false)}><i className="fas fa-boxes me-1"></i>Stock</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/ngo/request-appointment" onClick={() => setExpanded(false)}><i className="fas fa-calendar-plus me-1"></i>Request Appointment</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile" onClick={() => setExpanded(false)}><i className="fas fa-key me-1"></i>Change Password</Link></li>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin" onClick={() => setExpanded(false)}><i className="fas fa-cog me-1"></i>Admin</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile" onClick={() => setExpanded(false)}><i className="fas fa-key me-1"></i>Change Password</Link></li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!user && <>
              <li className="nav-item"><Link className="nav-link" to="/login" onClick={() => setExpanded(false)}>Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register" onClick={() => setExpanded(false)}>Register</Link></li>
            </>}
            {user && <>
              <li className="nav-item"><span className="nav-link">Hi, {user.name}</span></li>
              <li className="nav-item"><button className="btn btn-sm btn-outline-light" onClick={() => { handleLogout(); setExpanded(false); }}>Logout</button></li>
            </>}
          </ul>
        </div>
      </div>
    </nav>
  );
}
