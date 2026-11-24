import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { APP_NAME, TAGLINE, ROUTES } from '../../utils/constants';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Story', anchor: '#story', route: '/about' },
    { label: 'Menu', anchor: '#menu', route: '/menu' },
    { label: 'Team', anchor: '#team', route: '/about' },
    { label: 'Reviews', anchor: '#testimonials', route: '/' },
    { label: 'Hours', anchor: '#hours', route: '/' },
    { label: 'Contact', anchor: '#contact', route: '/contact' },
  ];

  const handleNavClick = (item, e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(item.anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/${item.anchor}`);
    }
  };

  const handleReservationClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector('#reservation');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/reservation');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#E2DCCE] shadow-sm py-3.5 sm:py-4'
          : 'bg-[#F6F3EC] border-b border-[#E2DCCE]/60 py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link to="/" className="group flex flex-col focus:outline-none">
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.06em] text-[#24251F] leading-none">
            {APP_NAME}
          </span>
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mt-1">
            {TAGLINE}
          </span>
        </Link>

        {/* Desktop Editorial Navigation (visible on lg+) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.anchor}
              onClick={(e) => handleNavClick(item, e)}
              className="text-xs uppercase tracking-[0.14em] font-medium text-[#24251F]/80 hover:text-[#435640] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#435640] hover:after:w-full after:transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Staff Portal */}
        <div className="hidden sm:flex items-center gap-5">
          <Link
            to={ROUTES.ADMIN.DASHBOARD}
            className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#24251F]/50 hover:text-[#24251F] transition-colors"
          >
            Staff Portal
          </Link>
          <button
            type="button"
            onClick={handleReservationClick}
            className="bg-[#435640] hover:bg-[#364634] text-[#F6F3EC] px-5 sm:px-6 py-2.5 text-xs uppercase tracking-[0.14em] font-medium transition-colors"
          >
            Book a Table
          </button>
        </div>

        {/* Responsive menu trigger (visible on mobile and tablet: lg:hidden) */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-[#24251F] hover:bg-[#E2DCCE]/40 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Full Screen Overlay (lg:hidden) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] sm:top-[73px] z-50 lg:hidden flex flex-col">
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[65px] sm:top-[73px] bg-[#24251F]/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div className="relative z-10 bg-[#F6F3EC] border-b border-[#E2DCCE] px-6 py-8 space-y-6 max-h-[calc(100vh-73px)] overflow-y-auto shadow-2xl">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.anchor}
                  onClick={(e) => handleNavClick(item, e)}
                  className="font-serif text-2xl text-[#24251F] hover:text-[#435640] transition-colors flex items-center justify-between py-2 border-b border-[#E2DCCE]/50"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#BD8856]" />
                </a>
              ))}
            </nav>
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleReservationClick}
                className="w-full bg-[#435640] text-[#F6F3EC] py-3.5 text-xs uppercase tracking-[0.14em] font-medium text-center"
              >
                Book a Table
              </button>
              <Link
                to={ROUTES.ADMIN.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs uppercase tracking-[0.14em] text-[#24251F]/70 py-2.5 hover:text-[#24251F]"
              >
                Staff Portal Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
