import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function NGODashboard(){
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    try {
      await API.post('/medicines/assign', { medicineId, ngoId: JSON.parse(localStorage.getItem('user')).id });
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign donation');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="container-fluid">
      <img src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png" alt="NGO Logo" className="img-fluid mb-4 rounded animate-fade-in" style={{ maxWidth: '150px' }} />
      <h3 className="mb-4">NGO Dashboard - Pending Donations</h3>
      {loading && <div>Loading donations...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && donations.length === 0 && <div>No pending donations available.</div>}
      {!loading && donations.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Expiry</th>
              <th>Quantity</th>
              <th>Address</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.manufacturer}</td>
                <td>{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : '-'}</td>
                <td>{d.quantity}</td>
                <td>{d.address || '-'}</td>
                <td>{d.pickupDate ? new Date(d.pickupDate).toLocaleDateString() : '-'}</td>
                <td>{d.pickupTime || '-'}</td>
                <td>{d.status}</td>
                <td><button className="btn btn-sm btn-primary pulse-on-hover" onClick={() => assignDonation(d._id)}>Assign to Me</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
