import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/website/Navbar';
import Footer from '../components/website/Footer';

export function WebsiteLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default WebsiteLayout;
