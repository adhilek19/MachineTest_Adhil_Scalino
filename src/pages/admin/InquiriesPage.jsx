import React, { useState, useEffect } from 'react';
import { contactService } from '../../api/services';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { MessageSquare, RefreshCw, Trash2, Eye, Search, Mail, Calendar, User, ExternalLink } from 'lucide-react';

export function InquiriesPage() {
  const toast = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View Message Modal State
  const [viewingMessage, setViewingMessage] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getContactUs();
      setInquiries(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await contactService.deleteContactUs(deleteTarget.Id);
      toast.success(`Message from "${deleteTarget.Name}" removed.`);
      setDeleteTarget(null);
      fetchInquiries();
    } catch (err) {
      toast.error(err.message || 'Failed to delete message.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredInquiries = inquiries.filter(
    (m) =>
      m.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.Message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Customer Inquiries</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Inquiries, questions, and feedback submitted via the public Contact Us form.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sender or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-56"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchInquiries} icon={RefreshCw}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching customer messages..." />}
      {error && <ErrorState message={error} onRetry={fetchInquiries} />}

      {!loading && !error && filteredInquiries.length === 0 && (
        <EmptyState
          icon={MessageSquare}
          title={searchTerm ? 'No Matching Inquiries' : 'Inbox Empty'}
          description={
            searchTerm
              ? `No inquiries match query "${searchTerm}".`
              : 'Messages sent via the Contact page will appear in this inbox.'
          }
        />
      )}

      {!loading && !error && filteredInquiries.length > 0 && (
        <div className="bg-white border border-[#E2DCCE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[650px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                  <th className="py-3.5 px-6">Sender</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Message Preview</th>
                  <th className="py-3.5 px-6">Received</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCCE]/60">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.Id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-medium text-[#24251F]">
                      {inq.Name}
                      <span className="block font-mono text-[10px] text-[#24251F]/40 mt-0.5">
                        ID #{inq.Id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`mailto:${inq.Email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#435640] hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{inq.Email}</span>
                      </a>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/70 max-w-sm">
                      <p className="line-clamp-2 font-light leading-relaxed">
                        {inq.Message}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/50 whitespace-nowrap">
                      {formatDate(inq.CreatedOn)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setViewingMessage(inq)}
                        className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                        title="Read Full Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(inq)}
                        className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Message"
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

      {/* View Message Modal */}
      <Modal
        isOpen={!!viewingMessage}
        onClose={() => setViewingMessage(null)}
        title="Customer Inquiry"
        subtitle={`Message Reference #${viewingMessage?.Id}`}
      >
        {viewingMessage && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E2DCCE]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">From</span>
                <span className="font-serif text-xl text-[#24251F] block mt-1">{viewingMessage.Name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block">Email Contact</span>
                <a
                  href={`mailto:${viewingMessage.Email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#435640] font-medium hover:underline mt-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{viewingMessage.Email}</span>
                  <ExternalLink className="w-3 h-3 text-[#435640]/50" />
                </a>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/50 block mb-2">
                Message Body
              </span>
              <div className="p-5 bg-[#FAF8F5] border border-[#E2DCCE] text-sm text-[#24251F] leading-relaxed whitespace-pre-wrap font-light">
                {viewingMessage.Message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2DCCE]">
              <span className="text-xs text-[#24251F]/40 font-mono">
                Received: {formatDate(viewingMessage.CreatedOn)}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${viewingMessage.Email}?subject=Re: Inquiry with MORROW`}
                  className="bg-[#435640] hover:bg-[#364634] text-[#F6F3EC] px-4 py-2 text-xs uppercase tracking-[0.12em] font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <Button variant="outline" size="sm" onClick={() => setViewingMessage(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Customer Inquiry"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.Name}" (${deleteTarget?.Email})?`}
        confirmLabel="Confirm Delete"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default InquiriesPage;
