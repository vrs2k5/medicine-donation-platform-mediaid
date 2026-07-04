import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function NGOStock(){
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/medicines/ngo/stock');
      setStock(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalQty = stock.reduce((sum, s) => sum + (s.quantity || 0), 0);

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <p className="section-label mb-1">NGO</p>
          <h4 className="mb-0 fw-semibold">Your Stock</h4>
        </div>
        {!loading && (
          <span className="badge bg-secondary fs-6">
            <i className="fas fa-boxes me-1"></i>{stock.length} items · {totalQty} units
          </span>
        )}
      </div>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Donated By</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center text-muted py-4">
                    <span className="spinner-border spinner-border-sm me-2"></span>Loading stock...
                  </td></tr>
                ) : stock.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted py-4">
                    No stock yet — assign a pending donation to add it here.
                  </td></tr>
                ) : stock.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td className="text-muted small">{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : '-'}</td>
                    <td>{s.quantity}</td>
                    <td className="text-muted small">{s.donatedBy ? s.donatedBy.name : '-'}</td>
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
