import React from 'react';
import { Link } from 'react-router-dom';
import Feedback from './Feedback';

const donationImageBase64 = "data:image/png;base64,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";

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user) {
    // If logged in, redirect to dashboard
    window.location.href = user.role === 'admin' ? '/admin' : user.role === 'ngo' ? '/ngo' : '/member';
    return null;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-5 text-center text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">A SMART PLATFORM FOR HEALTH, HOPE AND HUMANITY</h1>
              <p className="lead mb-4">Connect donors with NGOs to ensure medicines reach those in need. Make a difference today by donating unused medicines or joining as an NGO partner.</p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/register" className="btn btn-light btn-lg">
                  <i className="fas fa-user-plus me-2"></i>Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <img src={donationImageBase64} alt="Medicine Donation" className="img-fluid" style={{ maxHeight: '400px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-hand-holding-heart fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Donate Medicines</h5>
                  <p className="card-text">Members can easily donate their unused medicines through our secure platform.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-building fa-3x text-success"></i>
                  </div>
                  <h5 className="card-title">NGO Management</h5>
                  <p className="card-text">NGOs can manage their stock, request appointments, and distribute medicines efficiently.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-line fa-3x text-info"></i>
                  </div>
                  <h5 className="card-title">Track Impact</h5>
                  <p className="card-text">Admins and users can monitor donation activities and generate reports for better insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 text-white" style={{ background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <h3 className="display-4 fw-bold">1000+</h3>
              <p>Medicines Donated</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold">50+</h3>
              <p>NGO Partners</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold">500+</h3>
              <p>Happy Donors</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold">10k+</h3>
              <p>Lives Impacted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>A SMART PLATFORM FOR HEALTH, HOPE AND HUMANITY</h5>
              <p>Making healthcare accessible through community donations.</p>
              <p><Feedback /></p>
            </div>
            <div className="col-md-6 text-md-end">
              <p>&copy; 2025 A SMART PLATFORM FOR HEALTH, HOPE AND HUMANITY. All rights reserved.</p>
              <div>
                <a href="#" className="text-white me-3"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
