import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function NGODashboard(){
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/medicines/pending');
      setDonations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donations');
    }
    setLoading(false);
  };

  const assignDonation = async (medicineId) => {
    setAssigningId(medicineId);
    try {
      await API.post('/medicines/assign', { medicineId, ngoId: JSON.parse(localStorage.getItem('user')).id });
      await fetchDonations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign donation');
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <p className="section-label mb-1">NGO</p>
          <h3 className="mb-0 fw-semibold">Pending Donations</h3>
        </div>
        <button className="btn btn-outline-primary" onClick={fetchDonations} disabled={loading}>
          <i className={`fas fa-rotate me-2 ${loading ? 'fa-spin' : ''}`}></i>Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="fas fa-triangle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Manufacturer</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Address</th>
                  <th>Pickup Date</th>
                  <th>Pickup Time</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      <span className="spinner-border spinner-border-sm me-2"></span>Loading pending donations...
                    </td>
                  </tr>
                ) : donations.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      No pending donations right now — check back soon.
                    </td>
                  </tr>
                ) : donations.map(d => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td className="text-muted small">{d.manufacturer}</td>
                    <td className="text-muted small">{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : '-'}</td>
                    <td>{d.quantity}</td>
                    <td className="text-muted small">{d.address || '-'}</td>
                    <td className="text-muted small">{d.pickupDate ? new Date(d.pickupDate).toLocaleDateString() : '-'}</td>
                    <td className="text-muted small">{d.pickupTime || '-'}</td>
                    <td><span className="badge bg-warning">{d.status}</span></td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => assignDonation(d._id)}
                        disabled={assigningId === d._id}
                      >
                        {assigningId === d._id ? (
                          <><span className="spinner-border spinner-border-sm me-1"></span>Assigning...</>
                        ) : ('Assign to Me')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
