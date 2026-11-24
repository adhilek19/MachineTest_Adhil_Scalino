import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.includes('menu-categories')) return 'Menu Categories';
    if (path.includes('menu-items')) return 'Menu Items Catalog';
    if (path.includes('reservations')) return 'Table Reservations';
    if (path.includes('contact-inquiries')) return 'Customer Inquiries';
    if (path.includes('team')) return 'Culinary Team Roster';
    if (path.includes('testimonials')) return 'Customer Testimonials';
    if (path.includes('opening-hours')) return 'Service Schedule';
    return 'Console Overview';
  };

  return (
    <div className="flex min-h-screen bg-[#F6F5F2] font-sans text-[#24251F]">
      {/* Sidebar Navigation */}
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Surface */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={getPageTitle(location.pathname)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
