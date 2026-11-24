import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  UtensilsCrossed,
  Users,
  Quote,
  Clock,
  CalendarDays,
  MessageSquare,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { ROUTES, APP_NAME, TAGLINE } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

export function AdminSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN.LOGIN);
  };

  const navItems = [
    { name: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { name: 'Menu Categories', path: ROUTES.ADMIN.CATEGORIES, icon: Layers },
    { name: 'Menu Items', path: ROUTES.ADMIN.MENU_ITEMS, icon: UtensilsCrossed },
    { name: 'Team Members', path: ROUTES.ADMIN.TEAM, icon: Users },
    { name: 'Testimonials', path: ROUTES.ADMIN.TESTIMONIALS, icon: Quote },
    { name: 'Opening Hours', path: ROUTES.ADMIN.OPENING_HOURS, icon: Clock },
    { name: 'Reservations', path: ROUTES.ADMIN.RESERVATIONS, icon: CalendarDays },
    { name: 'Contact Messages', path: ROUTES.ADMIN.INQUIRIES, icon: MessageSquare },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#1F201B] text-[#F6F3EC] border-r border-[#2D2E28]">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 h-20 border-b border-[#2D2E28]">
        <Link to={ROUTES.ADMIN.DASHBOARD} className="flex flex-col">
          <span className="font-serif text-2xl tracking-[0.06em] text-[#F6F3EC] leading-none">
            {APP_NAME}
          </span>
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mt-1">
            Admin Console
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#F6F3EC]/60 hover:text-[#F6F3EC]"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
        <p className="px-3 text-[10px] uppercase tracking-[0.2em] font-medium text-[#F6F3EC]/40 mb-3">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.ADMIN.DASHBOARD}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-[0.12em] font-medium transition-all ${
                  isActive
                    ? 'bg-[#435640] text-[#F6F3EC] shadow-sm font-semibold'
                    : 'text-[#F6F3EC]/70 hover:text-[#F6F3EC] hover:bg-[#2A2B24]'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-[#2D2E28] space-y-3">
        {/* User Card */}
        <div className="p-3 bg-[#2A2B24] border border-[#383931] flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#F6F3EC] truncate">
              {user?.displayName || 'Administrator'}
            </p>
            <p className="text-[10px] text-[#BD8856] uppercase tracking-[0.12em] truncate mt-0.5">
              Authenticated Session
            </p>
          </div>
        </div>

        {/* View Website */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#F6F3EC]/60 hover:text-[#F6F3EC] hover:bg-[#2A2B24] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </span>
        </Link>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs uppercase tracking-[0.12em] text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#24251F]/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
