import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function NGOStock(){
  const [stock, setStock] = useState([]);

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const res = await API.get('/medicines/ngo/stock');
      setStock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">
      <h4 className="mb-4">NGO Stock</h4>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Donated By</th>
                </tr>
              </thead>
              <tbody>
                {stock.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : '-'}</td>
                    <td>{s.quantity}</td>
                    <td>{s.donatedBy ? s.donatedBy.name : '-'}</td>
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
