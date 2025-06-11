import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 
import NavbarAdmin from '../components/NavbarAdmin';
import '../styles/pages/AdminPage.css';
import { useUser } from '../context/UserContext';

const AdminPage = () => {
  const { user } = useUser();

  // If no user or not admin, redirect
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

   // Otherwise, render nested routes (Outlet)
  return (
    <div>
      <NavbarAdmin />
      <main className="admin-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminPage;
