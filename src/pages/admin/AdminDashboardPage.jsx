import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  UtensilsCrossed,
  Users,
  Quote,
  Clock,
  CalendarDays,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  menuService,
  teamService,
  testimonialService,
  openingHourService,
  reservationService,
  contactService,
} from '../../api/services';
import { formatDate, formatTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { ROUTES, APP_NAME, CANDIDATE_NAME } from '../../utils/constants';

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    categories: 0,
    menuItems: 0,
    team: 0,
    testimonials: 0,
    openingHours: 0,
    reservations: 0,
    inquiries: 0,
  });

  const [recentReservations, setRecentReservations] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, items, teamList, testList, hoursList, resvs, msgs] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems(),
        teamService.getTeams(),
        testimonialService.getTestimonials(),
        openingHourService.getOpeningHours(),
        reservationService.getReservations(),
        contactService.getContactUs(),
      ]);

      setStats({
        categories: cats.length,
        menuItems: items.length,
        team: teamList.length,
        testimonials: testList.length,
        openingHours: hoursList.length,
        reservations: resvs.length,
        inquiries: msgs.length,
      });

      setRecentReservations(resvs.slice(0, 5));
      setRecentInquiries(msgs.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to aggregate dashboard data from APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metricCards = [
    { title: 'Menu Items', count: stats.menuItems, desc: `${stats.categories} categories`, icon: UtensilsCrossed, link: ROUTES.ADMIN.MENU_ITEMS },
    { title: 'Categories', count: stats.categories, desc: 'Menu groupings', icon: Layers, link: ROUTES.ADMIN.CATEGORIES },
    { title: 'Reservations', count: stats.reservations, desc: 'Table bookings', icon: CalendarDays, link: ROUTES.ADMIN.RESERVATIONS },
    { title: 'Inquiries', count: stats.inquiries, desc: 'Messages received', icon: MessageSquare, link: ROUTES.ADMIN.INQUIRIES },
    { title: 'Staff Roster', count: stats.team, desc: 'Baristas & chefs', icon: Users, link: ROUTES.ADMIN.TEAM },
    { title: 'Reviews', count: stats.testimonials, desc: 'Verified guest ratings', icon: Quote, link: ROUTES.ADMIN.TESTIMONIALS },
    { title: 'Hours Slots', count: stats.openingHours, desc: 'Weekly schedule', icon: Clock, link: ROUTES.ADMIN.OPENING_HOURS },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Editorial Overview Banner */}
      <div className="bg-white border border-[#E2DCCE] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#BD8856] font-medium block mb-1">
            System Operational • Mock API v1
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#24251F]">
            {APP_NAME} Administration Console
          </h2>
          <p className="mt-1 text-xs text-[#24251F]/60 max-w-xl font-light">
            Real-time synchronization with Scalino Technologies mock backend. Candidate: <strong>{CANDIDATE_NAME}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            loading={loading}
            icon={RefreshCw}
          >
            Sync Data
          </Button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchDashboardData} />}

      {/* Metrics Grid */}
      {loading ? (
        <LoadingSpinner message="Aggregating live API metrics..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {metricCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.link}
                  className="bg-white p-5 sm:p-6 border border-[#E2DCCE] hover:border-[#435640] transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-[10px] uppercase tracking-[0.16em] font-medium text-[#24251F]/60">
                        {card.title}
                      </span>
                      <Icon className="w-4 h-4 text-[#435640]" />
                    </div>
                    <span className="font-serif text-3xl sm:text-4xl text-[#24251F] block leading-none">
                      {card.count}
                    </span>
                    <span className="text-xs text-[#24251F]/50 mt-1.5 block font-light">
                      {card.desc}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-5 pt-3 border-t border-[#E2DCCE]/60 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[#435640] font-medium">
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Sub-module Action Bar */}
          <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6">
            <h3 className="text-xs uppercase tracking-[0.16em] font-medium text-[#24251F]/60 mb-3 sm:mb-4">
              Quick Management Shortcuts
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <Link to={ROUTES.ADMIN.MENU_ITEMS}>
                <Button variant="outline" size="sm" icon={Plus}>
                  Add Menu Item
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.CATEGORIES}>
                <Button variant="outline" size="sm" icon={Plus}>
                  Add Category
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.TEAM}>
                <Button variant="outline" size="sm" icon={Plus}>
                  Add Staff Member
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.TESTIMONIALS}>
                <Button variant="outline" size="sm" icon={Plus}>
                  Add Testimonial
                </Button>
              </Link>
              <Link to={ROUTES.ADMIN.OPENING_HOURS}>
                <Button variant="outline" size="sm" icon={Plus}>
                  New Schedule Slot
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Tables Grid: Reservations & Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Recent Reservations Table */}
            <div className="bg-white border border-[#E2DCCE] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#E2DCCE] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#24251F]">Recent Reservations</h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50">
                    Latest guest table requests
                  </span>
                </div>
                <Link
                  to={ROUTES.ADMIN.RESERVATIONS}
                  className="text-xs uppercase tracking-[0.12em] text-[#435640] font-medium hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentReservations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#24251F]/50">
                  No reservations recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                    <thead>
                      <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                        <th className="py-3 px-5">Guest</th>
                        <th className="py-3 px-5">Phone</th>
                        <th className="py-3 px-5">Date & Time</th>
                        <th className="py-3 px-5 text-right">Guests</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DCCE]/60">
                      {recentReservations.map((r) => (
                        <tr key={r.Id} className="hover:bg-[#FAF8F5]/60 transition-colors whitespace-nowrap">
                          <td className="py-3 px-5 font-medium text-[#24251F]">{r.FullName}</td>
                          <td className="py-3 px-5 font-mono text-[#24251F]/70">{r.PhoneNo}</td>
                          <td className="py-3 px-5 text-[#24251F]/60">
                            {formatDate(r.Date)} at {formatTime(r.Time)}
                          </td>
                          <td className="py-3 px-5 text-right font-medium text-[#435640]">
                            {r.BookingCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Contact Messages */}
            <div className="bg-white border border-[#E2DCCE] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#E2DCCE] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#24251F]">Recent Messages</h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50">
                    Latest website inquiries
                  </span>
                </div>
                <Link
                  to={ROUTES.ADMIN.INQUIRIES}
                  className="text-xs uppercase tracking-[0.12em] text-[#435640] font-medium hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentInquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#24251F]/50">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                    <thead>
                      <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                        <th className="py-3 px-5">Sender</th>
                        <th className="py-3 px-5">Email</th>
                        <th className="py-3 px-5">Message</th>
                        <th className="py-3 px-5 text-right">Received</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DCCE]/60">
                      {recentInquiries.map((m) => (
                        <tr key={m.Id} className="hover:bg-[#FAF8F5]/60 transition-colors whitespace-nowrap">
                          <td className="py-3 px-5 font-medium text-[#24251F]">{m.Name}</td>
                          <td className="py-3 px-5 text-[#435640] truncate max-w-[120px]">{m.Email}</td>
                          <td className="py-3 px-5 text-[#24251F]/60 truncate max-w-[150px]">{m.Message}</td>
                          <td className="py-3 px-5 text-right text-[#24251F]/50">{formatDate(m.CreatedOn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;
