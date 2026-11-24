export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'https://mockapi.scalinotechnologies.com/api/v1';
export const MEDIA_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MEDIA_BASE_URL) || 'https://mockapi.scalinotechnologies.com';
export const APP_NAME = 'MORROW';
export const TAGLINE = 'Coffee & Kitchen';
export const CANDIDATE_NAME = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CANDIDATE_NAME) || 'Adhil EK';

// Test record prefix to guarantee rule compliance
export const TEST_DATA_PREFIX = 'Adhil EK Test';

// Storage keys
export const ADMIN_AUTH_KEY = 'morrow_cafe_admin_session';

// Route Paths
export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    MENU: '/menu',
    RESERVATION: '/reservation',
    CONTACT: '/contact',
  },
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
    CATEGORIES: '/admin/menu-categories',
    MENU_ITEMS: '/admin/menu-items',
    RESERVATIONS: '/admin/reservations',
    INQUIRIES: '/admin/contact-inquiries',
    TEAM: '/admin/team',
    TESTIMONIALS: '/admin/testimonials',
    OPENING_HOURS: '/admin/opening-hours',
  },
};
