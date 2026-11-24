import React, { useState } from 'react';
import { reservationService } from '../../api/services';
import { useToast } from '../../hooks/useToast';
import { formatTime } from '../../utils/formatters';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import { APP_NAME, TEST_DATA_PREFIX } from '../../utils/constants';

export function ReservationPage() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    FullName: '',
    PhoneNo: '',
    Date: new Date().toISOString().split('T')[0],
    Time: '10:00',
    BookingCount: 2,
    Comment: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.FullName.trim()) errs.FullName = 'Full guest name is required';
    if (!formData.PhoneNo.trim()) errs.PhoneNo = 'Contact phone number is required';
    if (!formData.Date) errs.Date = 'Reservation date is required';
    if (!formData.Time) errs.Time = 'Reservation time is required';
    if (!formData.BookingCount || formData.BookingCount < 1) {
      errs.BookingCount = 'Guest count must be at least 1';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        FullName: formData.FullName.trim(),
        PhoneNo: formData.PhoneNo.trim(),
        Date: new Date(formData.Date).toISOString(),
        Time: `${formData.Time}:00`,
        BookingCount: Number(formData.BookingCount),
        Comment: formData.Comment.trim() || 'Online reservation booking',
      };

      await reservationService.insertReservation(payload);
      setSubmitted(true);
      toast.success('Your table reservation request was submitted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-14 sm:py-20 lg:py-24 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 bg-[#F6F3EC]">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#BD8856] font-medium border-b border-[#BD8856]/30 pb-1">
          <span>Table Bookings</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#24251F] leading-tight">
          Reserve Your Table
        </h1>
        <p className="text-xs sm:text-base text-[#24251F]/70 font-light leading-relaxed">
          Join us at {APP_NAME} for slow coffee rituals and seasonal dining. For test bookings, please use the prefix "{TEST_DATA_PREFIX}".
        </p>
      </div>

      <div className="bg-white/80 border border-[#E2DCCE] p-6 sm:p-10 lg:p-12">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#435640]/10 text-[#435640] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl text-[#24251F]">
              Reservation Confirmed
            </h2>
            <p className="text-sm text-[#24251F]/70 max-w-md mx-auto leading-relaxed font-light">
              Thank you, <strong className="text-[#24251F] font-semibold">{formData.FullName}</strong>. Your table for <strong className="text-[#24251F] font-semibold">{formData.BookingCount} guests</strong> on <strong className="text-[#24251F] font-semibold">{formData.Date} at {formatTime(formData.Time)}</strong> has been registered.
            </p>
            <div className="pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    FullName: '',
                    PhoneNo: '',
                    Date: new Date().toISOString().split('T')[0],
                    Time: '10:00',
                    BookingCount: 2,
                    Comment: '',
                  });
                }}
              >
                Make Another Reservation
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Full Guest Name"
                name="FullName"
                value={formData.FullName}
                onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                placeholder={`e.g. ${TEST_DATA_PREFIX} Sarah`}
                error={errors.FullName}
                required
              />

              <Input
                label="Phone Number"
                name="PhoneNo"
                type="tel"
                value={formData.PhoneNo}
                onChange={(e) => setFormData({ ...formData, PhoneNo: e.target.value })}
                placeholder="e.g. +61 412 345 678"
                error={errors.PhoneNo}
                required
              />

              <Input
                label="Reservation Date"
                name="Date"
                type="date"
                value={formData.Date}
                onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                error={errors.Date}
                required
              />

              <Input
                label="Time Slot"
                name="Time"
                type="time"
                value={formData.Time}
                onChange={(e) => setFormData({ ...formData, Time: e.target.value })}
                error={errors.Time}
                required
              />

              <Input
                label="Number of Guests"
                name="BookingCount"
                type="number"
                min="1"
                max="20"
                value={formData.BookingCount}
                onChange={(e) => setFormData({ ...formData, BookingCount: e.target.value })}
                error={errors.BookingCount}
                required
              />

              <div className="sm:col-span-2">
                <Textarea
                  label="Special Notes / Seating Requests"
                  name="Comment"
                  rows={4}
                  value={formData.Comment}
                  onChange={(e) => setFormData({ ...formData, Comment: e.target.value })}
                  placeholder="Inform us if celebrating a special occasion or if any guests have dietary preferences..."
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                icon={CalendarCheck}
                className="w-full sm:w-auto"
              >
                Confirm Table Reservation
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReservationPage;
