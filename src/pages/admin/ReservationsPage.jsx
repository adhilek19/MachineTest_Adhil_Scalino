import React, { useState, useEffect } from 'react';
import { reservationService } from '../../api/services';
import { formatDate, formatTime } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Badge from '../../components/common/Badge';
import { CalendarDays, Plus, RefreshCw, Trash2, Eye, Search, Phone, Calendar, Clock, Users } from 'lucide-react';
import { TEST_DATA_PREFIX } from '../../utils/constants';

export function ReservationsPage() {
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View Detail Modal State
  const [viewingReservation, setViewingReservation] = useState(null);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    PhoneNo: '',
    Date: new Date().toISOString().split('T')[0],
    Time: '10:00',
    BookingCount: 2,
    Comment: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve table reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const openCreateModal = () => {
    setFormData({
      FullName: '',
      PhoneNo: '',
      Date: new Date().toISOString().split('T')[0],
      Time: '10:00',
      BookingCount: 2,
      Comment: '',
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.FullName.trim()) errs.FullName = 'Guest name is required';
    if (!formData.PhoneNo.trim()) errs.PhoneNo = 'Contact phone number is required';
    if (!formData.Date) errs.Date = 'Reservation date is required';
    if (!formData.Time) errs.Time = 'Reservation time is required';
    if (!formData.BookingCount || Number(formData.BookingCount) < 1) {
      errs.BookingCount = 'Guest count must be at least 1';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await reservationService.insertReservation(formData);
      toast.success(`Reservation for "${formData.FullName}" created successfully.`);
      setIsCreateOpen(false);
      fetchReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to register reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await reservationService.deleteReservation(deleteTarget.Id);
      toast.success(`Reservation for "${deleteTarget.FullName}" cancelled.`);
      setDeleteTarget(null);
      fetchReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to delete reservation.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredReservations = reservations.filter(
    (r) =>
      r.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.PhoneNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Table Reservations</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Review guest bookings, party sizes, seating times, and special dietary requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search guest or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-52"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchReservations} icon={RefreshCw}>
            Refresh
          </Button>

          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            New Booking
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching reservation records..." />}
      {error && <ErrorState message={error} onRetry={fetchReservations} />}

      {!loading && !error && filteredReservations.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={searchTerm ? 'No Matching Bookings' : 'No Reservations Found'}
          description={
            searchTerm
              ? `No reservations match query "${searchTerm}".`
              : 'Reservations created via the website or manual entry will appear here.'
          }
          actionLabel={searchTerm ? undefined : 'Add Reservation'}
          onAction={searchTerm ? undefined : openCreateModal}
        />
      )}

      {!loading && !error && filteredReservations.length > 0 && (
        <div className="bg-white border border-[#E2DCCE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                  <th className="py-3.5 px-6">Guest Name</th>
                  <th className="py-3.5 px-6">Contact Phone</th>
                  <th className="py-3.5 px-6">Reserved Date & Time</th>
                  <th className="py-3.5 px-6 text-center">Party Size</th>
                  <th className="py-3.5 px-6">Notes / Requests</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCCE]/60">
                {filteredReservations.map((r) => (
                  <tr key={r.Id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#24251F]">
                      {r.FullName}
                      <span className="block font-mono text-[10px] text-[#24251F]/40 mt-0.5">
                        ID #{r.Id}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[#24251F]/80">
                      {r.PhoneNo}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/70">
                      <span className="font-medium text-[#24251F] block">{formatDate(r.Date)}</span>
                      <span className="font-mono text-[11px] text-[#24251F]/50">{formatTime(r.Time)}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant="primary" size="xs">
                        {r.BookingCount} {r.BookingCount === 1 ? 'Guest' : 'Guests'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/60 max-w-xs truncate font-light">
                      {r.Comment || '—'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setViewingReservation(r)}
                        className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                        title="View Full Booking"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(r)}
                        className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Cancel Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Booking Details Modal */}
      <Modal
        isOpen={!!viewingReservation}
        onClose={() => setViewingReservation(null)}
        title="Reservation Details"
        subtitle={`Booking Reference #${viewingReservation?.Id}`}
      >
        {viewingReservation && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E2DCCE]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">Guest Name</span>
                <span className="font-serif text-xl text-[#24251F] block mt-1">{viewingReservation.FullName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">Phone Contact</span>
                <span className="font-mono text-sm text-[#24251F] block mt-1">{viewingReservation.PhoneNo}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#E2DCCE] text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">Date</span>
                <span className="font-medium text-[#24251F] block mt-1">{formatDate(viewingReservation.Date)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">Time</span>
                <span className="font-medium text-[#24251F] block mt-1">{formatTime(viewingReservation.Time)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">Party Size</span>
                <span className="font-medium text-[#435640] block mt-1">{viewingReservation.BookingCount} Guests</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block mb-1">
                Guest Notes & Comments
              </span>
              <p className="text-xs text-[#24251F]/80 p-3 bg-[#FAF8F5] border border-[#E2DCCE] leading-relaxed">
                {viewingReservation.Comment || 'No special dietary requirements or notes attached.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2DCCE] text-[11px] text-[#24251F]/40 font-mono">
              <span>Submitted: {formatDate(viewingReservation.CreatedOn)}</span>
              <Button variant="outline" size="sm" onClick={() => setViewingReservation(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Booking Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Register Reservation"
        subtitle="Record a phone or walk-in reservation request."
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <Input
            label="Guest Full Name"
            name="FullName"
            placeholder="e.g. David Williams"
            value={formData.FullName}
            onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
            error={formErrors.FullName}
            helperText={`Prefix with "${TEST_DATA_PREFIX}" for test entries`}
            required
          />

          <Input
            label="Phone Number"
            name="PhoneNo"
            type="tel"
            placeholder="e.g. +61 412 000 111"
            value={formData.PhoneNo}
            onChange={(e) => setFormData({ ...formData, PhoneNo: e.target.value })}
            error={formErrors.PhoneNo}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              name="Date"
              type="date"
              value={formData.Date}
              onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
              error={formErrors.Date}
              required
            />
            <Input
              label="Time"
              name="Time"
              type="time"
              value={formData.Time}
              onChange={(e) => setFormData({ ...formData, Time: e.target.value })}
              error={formErrors.Time}
              required
            />
          </div>

          <Input
            label="Party Size (Number of Guests)"
            name="BookingCount"
            type="number"
            min="1"
            max="20"
            value={formData.BookingCount}
            onChange={(e) => setFormData({ ...formData, BookingCount: e.target.value })}
            error={formErrors.BookingCount}
            required
          />

          <Textarea
            label="Special Requests / Table Preferences"
            name="Comment"
            rows={3}
            placeholder="Dietary notes or seating preference..."
            value={formData.Comment}
            onChange={(e) => setFormData({ ...formData, Comment: e.target.value })}
          />

          <div className="pt-4 border-t border-[#E2DCCE] flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
            >
              Save Reservation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Cancel Table Reservation"
        message={`Are you sure you want to cancel the reservation for ${deleteTarget?.FullName} (${deleteTarget?.BookingCount} guests on ${formatDate(deleteTarget?.Date)})?`}
        confirmLabel="Confirm Cancellation"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default ReservationsPage;
