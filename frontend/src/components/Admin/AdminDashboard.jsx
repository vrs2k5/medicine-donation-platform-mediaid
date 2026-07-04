import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function AdminDashboard(){
  const [users,setUsers]=useState([]);
  const [appointments,setAppts] = useState([]);
  const [report,setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [blockingId, setBlockingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    setLoading(true);
    try {
      const u = await API.get('/admin/users'); setUsers(u.data);
      const a = await API.get('/appointments/all'); setAppts(a.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (id, block) => {
    setBlockingId(id);
    try {
      await API.post('/admin/block', { userId: id, block });
      await load();
    } finally {
      setBlockingId(null);
    }
  };

  const approve = async (id) => {
    setApprovingId(id);
    try {
      await API.post('/appointments/approve', { appointmentId: id, scheduledDate: new Date() });
      await load();
    } finally {
      setApprovingId(null);
    }
  };

  const getReport = async () => {
    setReportLoading(true);
    try {
      const res = await API.get('/admin/report/monthly');
      setReport(res.data);
    } finally {
      setReportLoading(false);
    }
  };

  const pendingAppointments = appointments.filter(a => !a.approved).length;

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <p className="section-label mb-1">Admin</p>
          <h3 className="mb-0 fw-semibold">Dashboard</h3>
        </div>
        <button className="btn btn-outline-primary" onClick={getReport} disabled={reportLoading}>
          {reportLoading ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Generating...</>
          ) : (
            <><i className="fas fa-chart-column me-2"></i>Get Monthly Report</>
          )}
        </button>
      </div>

      {/* Quick stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#e8f4f2', color: '#128a7d', flexShrink: 0 }}>
                <i className="fas fa-users"></i>
              </div>
              <div>
                <h5 className="mb-0">{loading ? '—' : users.length}</h5>
                <p className="text-muted small mb-0">Total Users</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#eaf1fe', color: '#2f6fed', flexShrink: 0 }}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <div>
                <h5 className="mb-0">{loading ? '—' : appointments.length}</h5>
                <p className="text-muted small mb-0">Appointments</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#fdf3e2', color: '#b9791a', flexShrink: 0 }}>
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div>
                <h5 className="mb-0">{loading ? '—' : pendingAppointments}</h5>
                <p className="text-muted small mb-0">Pending Approval</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: '#fdecee', color: '#d64550', flexShrink: 0 }}>
                <i className="fas fa-user-slash"></i>
              </div>
              <div>
                <h5 className="mb-0">{loading ? '—' : users.filter(u => u.blocked).length}</h5>
                <p className="text-muted small mb-0">Blocked Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {report && (
        <div className="card mb-4">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
            <h5 className="mb-0">
              <i className="fas fa-file-lines me-2 text-muted"></i>
              Monthly Report
            </h5>
            <span className="text-muted small">
              {new Date(report.start).toLocaleDateString()} – {new Date(report.end).toLocaleDateString()}
            </span>
          </div>
          <div className="card-body">
            <div className="row mb-4 g-3">
              <div className="col-md-3">
                <div className="text-center p-3 rounded-3" style={{ background: '#f6f9fb' }}>
                  <h4 className="mb-1" style={{ color: '#128a7d' }}>{report.count}</h4>
                  <p className="mb-0 small text-muted">Total Donations</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-3 rounded-3" style={{ background: '#f6f9fb' }}>
                  <h4 className="mb-1" style={{ color: '#1e9e6b' }}>{report.donations.reduce((sum, d) => sum + (d.quantity || 1), 0)}</h4>
                  <p className="mb-0 small text-muted">Total Quantity</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-3 rounded-3" style={{ background: '#f6f9fb' }}>
                  <h4 className="mb-1" style={{ color: '#b9791a' }}>{report.donations.filter(d => d.status === 'pending').length}</h4>
                  <p className="mb-0 small text-muted">Pending</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-3 rounded-3" style={{ background: '#f6f9fb' }}>
                  <h4 className="mb-1" style={{ color: '#2f6fed' }}>{report.donations.filter(d => d.status === 'approved').length}</h4>
                  <p className="mb-0 small text-muted">Approved</p>
                </div>
              </div>
            </div>
            <p className="section-label mb-2">Donation Details</p>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
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
                  {report.donations.length === 0 ? (
                    <tr><td colSpan="6" className="text-center text-muted py-4">No donations in this period.</td></tr>
                  ) : report.donations.map(donation => (
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

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0"><i className="fas fa-users me-2 text-muted"></i>Users</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center text-muted py-4">
                        <span className="spinner-border spinner-border-sm me-2"></span>Loading users...
                      </td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan="5" className="text-center text-muted py-4">No users found.</td></tr>
                    ) : users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td className="text-muted small">{u.email}</td>
                        <td><span className="badge bg-secondary text-uppercase">{u.role}</span></td>
                        <td>
                          {u.blocked
                            ? <span className="badge bg-danger">Blocked</span>
                            : <span className="badge bg-success">Active</span>}
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${u.blocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                            onClick={() => blockUser(u._id, !u.blocked)}
                            disabled={blockingId === u._id}
                          >
                            {blockingId === u._id ? '...' : (u.blocked ? 'Unblock' : 'Block')}
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

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0"><i className="fas fa-calendar-check me-2 text-muted"></i>Appointments</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>NGO</th>
                      <th>Requested</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center text-muted py-4">
                        <span className="spinner-border spinner-border-sm me-2"></span>Loading appointments...
                      </td></tr>
                    ) : appointments.length === 0 ? (
                      <tr><td colSpan="4" className="text-center text-muted py-4">No appointment requests yet.</td></tr>
                    ) : appointments.map(a => (
                      <tr key={a._id}>
                        <td>{a.ngo?.name || a.ngo}</td>
                        <td className="text-muted small">{a.requestedDate ? new Date(a.requestedDate).toLocaleString() : '-'}</td>
                        <td>
                          {a.approved
                            ? <span className="badge bg-success">Approved</span>
                            : <span className="badge bg-warning">Pending</span>}
                        </td>
                        <td>
                          {!a.approved && (
                            <button className="btn btn-sm btn-outline-success" onClick={() => approve(a._id)} disabled={approvingId === a._id}>
                              {approvingId === a._id ? '...' : 'Approve'}
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
