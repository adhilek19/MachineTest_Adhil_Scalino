import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import WebsiteLayout from '../layouts/WebsiteLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Website Pages
import HomePage from '../pages/website/HomePage';
import AboutPage from '../pages/website/AboutPage';
import MenuPage from '../pages/website/MenuPage';
import ReservationPage from '../pages/website/ReservationPage';
import ContactPage from '../pages/website/ContactPage';

// Admin Portal Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import MenuCategoriesPage from '../pages/admin/MenuCategoriesPage';
import MenuItemsPage from '../pages/admin/MenuItemsPage';
import ReservationsPage from '../pages/admin/ReservationsPage';
import InquiriesPage from '../pages/admin/InquiriesPage';
import TeamPage from '../pages/admin/TeamPage';
import TestimonialsPage from '../pages/admin/TestimonialsPage';
import OpeningHoursPage from '../pages/admin/OpeningHoursPage';

// 404
import NotFoundPage from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes with WebsiteLayout */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Public Route (Login) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Routes with ProtectedRoute & AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="menu-categories" element={<MenuCategoriesPage />} />
        <Route path="menu-items" element={<MenuItemsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="contact-inquiries" element={<InquiriesPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="opening-hours" element={<OpeningHoursPage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
