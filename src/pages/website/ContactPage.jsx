import React, { useState } from 'react';
import { contactService } from '../../api/services';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Send, CheckCircle2 } from 'lucide-react';
import { APP_NAME, TEST_DATA_PREFIX } from '../../utils/constants';

export function ContactPage() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Message: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.Name.trim()) errs.Name = 'Name is required';
    if (!formData.Email.trim()) {
      errs.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      errs.Email = 'Please provide a valid email address';
    }
    if (!formData.Message.trim()) errs.Message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await contactService.insertContactUs({
        Name: formData.Name.trim(),
        Email: formData.Email.trim(),
        Message: formData.Message.trim(),
      });
      setSent(true);
      toast.success('Your message was received by our team.');
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 bg-[#F6F3EC] space-y-12 sm:space-y-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#BD8856] font-medium border-b border-[#BD8856]/30 pb-1 mb-4">
          <span>Enquiries & Notes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#24251F] leading-tight">
          Get in Touch
        </h1>
        <p className="mt-3 text-xs sm:text-base text-[#24251F]/70 font-light leading-relaxed">
          Questions regarding wholesale coffee, event bookings, or seasonal ingredients? Drop our team a note.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl text-[#24251F]">The Roastery Studio</h3>
            <p className="text-xs sm:text-sm text-[#24251F]/70 font-light leading-relaxed">
              42 Franklin Promenade, Heritage Quarter<br />
              Melbourne, VIC 3000
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E2DCCE] text-xs uppercase tracking-[0.12em] font-medium text-[#24251F]/70">
            <div className="flex justify-between pb-2 border-b border-[#E2DCCE]/60 gap-4">
              <span className="flex-shrink-0">General Inquiries</span>
              <span className="font-serif lowercase tracking-normal text-xs sm:text-sm text-[#24251F] truncate text-right">hello@morrowcoffee.com</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#E2DCCE]/60 gap-4">
              <span className="flex-shrink-0">Direct Phone</span>
              <span className="font-mono text-xs text-[#24251F] truncate text-right">+61 (03) 9482 1100</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white/80 border border-[#E2DCCE] p-6 sm:p-10 lg:p-12">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#435640]/10 text-[#435640] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl text-[#24251F]">Message Sent</h3>
              <p className="text-sm text-[#24251F]/70 max-w-sm mx-auto font-light leading-relaxed">
                Thank you for reaching out. A team member from {APP_NAME} will respond to your email promptly.
              </p>
              <div className="pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    setFormData({ Name: '', Email: '', Message: '' });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  name="Name"
                  placeholder={`e.g. ${TEST_DATA_PREFIX} David`}
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  error={errors.Name}
                  required
                />

                <Input
                  label="Email Address"
                  name="Email"
                  type="email"
                  placeholder="e.g. david@example.com"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  error={errors.Email}
                  required
                />

                <div className="sm:col-span-2">
                  <Textarea
                    label="Message Content"
                    name="Message"
                    rows={5}
                    placeholder="Tell us how we can assist you..."
                    value={formData.Message}
                    onChange={(e) => setFormData({ ...formData, Message: e.target.value })}
                    error={errors.Message}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  icon={Send}
                  className="w-full sm:w-auto"
                >
                  Send Enquiry
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
