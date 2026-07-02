import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function AdminDashboard(){
  const [users,setUsers]=useState([]);
  const [appointments,setAppts] = useState([]);
  const [report,setReport] = useState(null);

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    try {
      const u = await API.get('/admin/users'); setUsers(u.data);
      const a = await API.get('/appointments/all'); setAppts(a.data);
    } catch (err) {
      console.error(err);
    }
  };

  const blockUser = async (id, block) => {
    await API.post('/admin/block', { userId: id, block });
    load();
  };

  const approve = async (id) => {
    await API.post('/appointments/approve', { appointmentId: id, scheduledDate: new Date() });
    load();
  };

  const getReport = async () => {
    const res = await API.get('/admin/report/monthly');
    setReport(res.data);
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Admin Dashboard</h3>
      <div className="card mb-4">
        <div className="card-body">
          <button className="btn btn-info" onClick={getReport}>Get Monthly Report</button>
        </div>
      </div>

      {report && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Report ({new Date(report.start).toLocaleDateString()} - {new Date(report.end).toLocaleDateString()})</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="text-center">
                  <h4 className="text-primary">{report.count}</h4>
                  <p className="mb-0">Total Donations</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h4 className="text-success">{report.donations.reduce((sum, d) => sum + (d.quantity || 1), 0)}</h4>
                  <p className="mb-0">Total Quantity</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h4 className="text-warning">{report.donations.filter(d => d.status === 'pending').length}</h4>
                  <p className="mb-0">Pending</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h4 className="text-info">{report.donations.filter(d => d.status === 'approved').length}</h4>
                  <p className="mb-0">Approved</p>
                </div>
              </div>
            </div>
            <h6>Donation Details:</h6>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.donations.map(donation => (
                    <tr key={donation._id}>
                      <td>{donation.donatedBy?.name || 'Unknown'}</td>
                      <td>{donation.name}</td>
                      <td>{donation.category || '-'}</td>
                      <td>{donation.quantity || 1}</td>
                      <td>
                        <span className={`badge ${donation.status === 'approved' ? 'bg-success' : donation.status === 'collected' ? 'bg-info' : 'bg-warning'}`}>
                          {donation.status}
                        </span>
                      </td>
                      <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Users</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Blocked</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.blocked ? 'Yes' : 'No'}</td>
                        <td>
                          <button className="btn btn-sm btn-warning" onClick={() => blockUser(u._id, !u.blocked)}>
                            {u.blocked ? 'Unblock' : 'Block'}
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

        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Appointments</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>NGO</th>
                      <th>Requested</th>
                      <th>Approved</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td>{a.ngo?.name || a.ngo}</td>
                        <td>{a.requestedDate ? new Date(a.requestedDate).toLocaleString() : '-'}</td>
                        <td>{a.approved ? 'Yes' : 'No'}</td>
                        <td>
                          {!a.approved && (
                            <button className="btn btn-sm btn-success" onClick={() => approve(a._id)}>
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
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
