import React from 'react';
import { Outlet } from 'react-router-dom'; // 👈
import NavbarAdmin from '../components/NavbarAdmin';
import Footer from '../components/Footer';
import '../styles/pages/AdminPage.css';

const AdminPage = () => {
  return (
    <div>
      <NavbarAdmin />
      <main className="admin-content">
        <Outlet /> {/* 👈 this is where nested routes (like Flights) will render */}
      </main>
    </div>
  );
};

export default AdminPage;
