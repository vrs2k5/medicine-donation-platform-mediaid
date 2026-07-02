import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function MemberHistory(){
  const [items, setItems] = useState([]);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const res = await API.get('/medicines/member');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h4 className="mb-4 text-center"><i className="fas fa-list me-2"></i>Your Donations</h4>
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th><i className="fas fa-tag me-1"></i>Name</th>
                      <th><i className="fas fa-industry me-1"></i>Manufacturer</th>
                      <th><i className="fas fa-calendar-alt me-1"></i>Expiry</th>
                      <th><i className="fas fa-hashtag me-1"></i>Qty</th>
                      <th><i className="fas fa-info-circle me-1"></i>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">No donations found.</td>
                      </tr>
                    ) : (
                      items.map(it => (
                        <tr key={it._id}>
                          <td>{it.name}</td>
                          <td>{it.manufacturer}</td>
                          <td>{it.expiryDate ? new Date(it.expiryDate).toLocaleDateString() : '-'}</td>
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
