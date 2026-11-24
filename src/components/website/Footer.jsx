import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { APP_NAME, TAGLINE, CANDIDATE_NAME, ROUTES } from '../../utils/constants';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#24251F] text-[#F6F3EC] pt-16 sm:pt-20 pb-10 sm:pb-12 border-t border-[#34352D]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 pb-12 sm:pb-16 border-b border-[#34352D]">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-5 sm:space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-3xl sm:text-4xl tracking-[0.06em] text-[#F6F3EC]">
                {APP_NAME}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#BD8856] font-medium mt-1">
                {TAGLINE}
              </span>
            </div>
            <p className="text-sm text-[#F6F3EC]/70 leading-relaxed font-light max-w-sm">
              A serene neighborhood space where single-origin roasts meet seasonal culinary craft. Designed for slow mornings, thoughtful conversations, and quiet craft.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-[0.16em] text-[#BD8856] font-medium">
                Ethically Sourced • Batch Roasted Daily
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-[#F6F3EC]/40 font-medium">
              Navigation
            </h4>
            <ul className="space-y-3 text-xs uppercase tracking-[0.12em] font-medium">
              <li>
                <a href="#story" className="text-[#F6F3EC]/80 hover:text-[#BD8856] transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#menu" className="text-[#F6F3EC]/80 hover:text-[#BD8856] transition-colors">
                  Signature Menu
                </a>
              </li>
              <li>
                <a href="#team" className="text-[#F6F3EC]/80 hover:text-[#BD8856] transition-colors">
                  Culinary Team
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-[#F6F3EC]/80 hover:text-[#BD8856] transition-colors">
                  Guest Notes
                </a>
              </li>
              <li>
                <a href="#hours" className="text-[#F6F3EC]/80 hover:text-[#BD8856] transition-colors">
                  Hours & Location
                </a>
              </li>
              <li>
                <a href="#reservation" className="text-[#BD8856] hover:underline transition-colors">
                  Book a Table
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] text-[#F6F3EC]/40 font-medium">
              Location & Enquiries
            </h4>
            <div className="space-y-2 text-sm text-[#F6F3EC]/80 font-light">
              <p>42 Franklin Promenade, Heritage Quarter</p>
              <p>Melbourne, VIC 3000</p>
              <p className="pt-2">hello@morrowcoffee.com</p>
              <p>+61 (03) 9482 1100</p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#F6F3EC]/60 hover:text-[#F6F3EC] transition-colors"
              >
                <span>Return to top</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6F3EC]/40 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span>Assessment Submission by <strong className="text-[#F6F3EC]/70">{CANDIDATE_NAME}</strong></span>
            <span>•</span>
            <Link to={ROUTES.ADMIN.DASHBOARD} className="text-[#F6F3EC]/50 hover:text-[#F6F3EC] transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
