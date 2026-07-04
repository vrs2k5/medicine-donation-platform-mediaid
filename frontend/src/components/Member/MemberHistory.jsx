import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function MemberHistory(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/medicines/member');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="mb-4">
            <p className="section-label mb-1">Member</p>
            <h4 className="mb-0 fw-semibold"><i className="fas fa-list me-2 text-muted"></i>Your Donations</h4>
          </div>
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
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          <span className="spinner-border spinner-border-sm me-2"></span>Loading your donations...
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          You haven't donated anything yet — <a href="/donate">make your first donation</a>.
                        </td>
                      </tr>
                    ) : (
                      items.map(it => (
                        <tr key={it._id}>
                          <td>{it.name}</td>
                          <td className="text-muted small">{it.manufacturer}</td>
                          <td className="text-muted small">{it.expiryDate ? new Date(it.expiryDate).toLocaleDateString() : '-'}</td>
                          <td>{it.quantity}</td>
                          <td>
                            <span className={`badge ${it.status === 'approved' ? 'bg-success' : it.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                              {it.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
