import React from 'react';
import { Link } from 'react-router-dom';

export default function MemberDashboard(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="container-fluid py-2">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-5">
            <p className="section-label mb-1">Member</p>
            <h2 className="fw-semibold mb-2">Welcome back, {user?.name}!</h2>
            <p className="lead text-muted mb-0">Ready to make a difference? Donate medicines or check your history.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body text-center py-5">
                  <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle mx-auto" style={{ width: 72, height: 72, background: '#e8f4f2' }}>
                    <i className="fas fa-hand-holding-heart fa-2x" style={{ color: '#128a7d' }}></i>
                  </div>
                  <h5 className="card-title">Make a Donation</h5>
                  <p className="card-text text-muted">Help others by donating your unused medicines. Every contribution counts!</p>
                  <Link to="/donate" className="btn btn-primary btn-lg mt-2">
                    <i className="fas fa-plus-circle me-2"></i>Donate Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body text-center py-5">
                  <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle mx-auto" style={{ width: 72, height: 72, background: '#eaf1fe' }}>
                    <i className="fas fa-history fa-2x" style={{ color: '#2f6fed' }}></i>
                  </div>
                  <h5 className="card-title">Your Donation History</h5>
                  <p className="card-text text-muted">View your past donations and track the impact you've made.</p>
                  <Link to="/member/history" className="btn btn-outline-primary btn-lg mt-2">
                    <i className="fas fa-eye me-2"></i>View History
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3"><i className="fas fa-circle-info me-2 text-muted"></i>Quick Tips</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 d-flex align-items-start gap-2">
                      <i className="fas fa-check-circle mt-1" style={{ color: '#1e9e6b' }}></i>
                      <span>Ensure medicines are unexpired and in original packaging.</span>
                    </li>
                    <li className="mb-2 d-flex align-items-start gap-2">
                      <i className="fas fa-check-circle mt-1" style={{ color: '#1e9e6b' }}></i>
                      <span>Include prescription details for controlled medications.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <i className="fas fa-check-circle mt-1" style={{ color: '#1e9e6b' }}></i>
                      <span>Contact NGOs directly for pickup arrangements.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
