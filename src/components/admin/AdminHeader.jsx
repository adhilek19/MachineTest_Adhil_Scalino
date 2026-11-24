import React from 'react';
import { Menu, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CANDIDATE_NAME } from '../../utils/constants';

export function AdminHeader({ title = 'Administration', onOpenSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2DCCE] h-16 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-[#24251F] hover:bg-[#F6F3EC] focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>
        <div className="min-w-0">
          <h1 className="font-serif text-lg sm:text-2xl text-[#24251F] truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
        {/* Candidate Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#EBF0EA] border border-[#D2DEC1] text-[#435640] text-[10px] uppercase tracking-[0.14em] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Assessed by {CANDIDATE_NAME}</span>
        </div>

        {/* Public Site Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#24251F]/60 hover:text-[#24251F] transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-[#E2DCCE]">
          <span className="text-xs font-medium text-[#24251F] max-w-[100px] truncate hidden xs:inline">
            {user?.displayName || 'Admin'}
          </span>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-[#24251F]/50 hover:text-rose-600 transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
