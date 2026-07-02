import React from 'react';
import { Link } from 'react-router-dom';

export default function MemberDashboard(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold" style={{ color: 'white' }}>Welcome back, {user?.name}!</h2>
            <p className="lead">Ready to make a difference? Donate medicines or check your history.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-hand-holding-heart fa-4x text-primary"></i>
                  </div>
                  <h5 className="card-title">Make a Donation</h5>
                  <p className="card-text">Help others by donating your unused medicines. Every contribution counts!</p>
                  <Link to="/donate" className="btn btn-primary btn-lg">
                    <i className="fas fa-plus-circle me-2"></i>Donate Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-history fa-4x text-success"></i>
                  </div>
                  <h5 className="card-title">Your Donation History</h5>
                  <p className="card-text">View your past donations and track the impact you've made.</p>
                  <Link to="/member/history" className="btn btn-success btn-lg">
                    <i className="fas fa-eye me-2"></i>View History
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title"><i className="fas fa-info-circle me-2"></i>Quick Tips</h5>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check-circle text-success me-2"></i>Ensure medicines are unexpired and in original packaging.</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i>Include prescription details for controlled medications.</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i>Contact NGOs directly for pickup arrangements.</li>
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
