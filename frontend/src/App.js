import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import AdminDashboard from './components/Admin/AdminDashboard';
import NGODashboard from './components/NGO/NGODashboard';
import MemberDashboard from './components/Member/MemberDashboard';
import DonateForm from './components/Donate/DonateForm';
import NGOStock from './components/NGO/NGOStock';
import MemberHistory from './components/Member/MemberHistory';
import RequestAppointment from './components/NGO/RequestAppointment';
import Profile from './components/Common/Profile';
import Home from './components/Common/Home';
import ForgotPassword from './components/Auth/ForgotPassword';

function App(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin" element={<Protected routeRole="admin" component={<AdminDashboard/>} />} />
          <Route path="/ngo" element={<Protected routeRole="ngo" component={<NGODashboard/>} />} />
          <Route path="/ngo/stock" element={<Protected routeRole="ngo" component={<NGOStock/>} />} />
          <Route path="/ngo/request-appointment" element={<Protected routeRole="ngo" component={<RequestAppointment/>} />} />
          <Route path="/member" element={<Protected routeRole="member" component={<MemberDashboard/>} />} />
          <Route path="/member/history" element={<Protected routeRole="member" component={<MemberHistory/>} />} />
          <Route path="/donate" element={<Protected routeRole="member" component={<DonateForm/>} />} />
          <Route path="/profile" element={<Protected routeRole={user?.role} component={<Profile/>} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const Protected = ({ routeRole, component }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (user.role !== routeRole) return <Navigate to="/" />;
  return component;
};

export default App;
