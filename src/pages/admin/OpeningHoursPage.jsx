import React, { useState, useEffect } from 'react';
import { openingHourService } from '../../api/services';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { Clock, Plus, RefreshCw, Trash2, Edit, Search } from 'lucide-react';
import { TEST_DATA_PREFIX } from '../../utils/constants';

export function OpeningHoursPage() {
  const toast = useToast();
  const [hours, setHours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    DayRange: '',
    TimeRange: '',
    IsClosed: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHours = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await openingHourService.getOpeningHours();
      setHours(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve opening hours.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHours();
  }, []);

  const openCreateModal = () => {
    setEditingSlot(null);
    setFormData({
      DayRange: '',
      TimeRange: '08:00 – 16:00',
      IsClosed: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setFormData({
      DayRange: slot.DayRange || '',
      TimeRange: slot.TimeRange || '',
      IsClosed: Boolean(slot.IsClosed),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.DayRange.trim()) errs.DayRange = 'Day range is required';
    if (!formData.TimeRange.trim() && !formData.IsClosed) {
      errs.TimeRange = 'Time range is required unless closed';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        DayRange: formData.DayRange.trim(),
        TimeRange: formData.TimeRange.trim(),
        IsClosed: Boolean(formData.IsClosed),
      };

      if (editingSlot) {
        await openingHourService.updateOpeningHour({
          Id: editingSlot.Id,
          ...payload,
        });
        toast.success(`Schedule slot "${payload.DayRange}" updated.`);
      } else {
        await openingHourService.insertOpeningHour(payload);
        toast.success(`Schedule slot "${payload.DayRange}" created.`);
      }

      setIsModalOpen(false);
      fetchHours();
    } catch (err) {
      toast.error(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await openingHourService.deleteOpeningHour(deleteTarget.Id);
      toast.success(`Schedule slot "${deleteTarget.DayRange}" deleted.`);
      setDeleteTarget(null);
      fetchHours();
    } catch (err) {
      toast.error(err.message || 'Failed to delete opening hour slot.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredHours = hours.filter((h) =>
    h.DayRange.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Service Hours Schedule</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Manage weekly operating schedules, weekend hours, and holiday closure notices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search schedule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-52"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchHours} icon={RefreshCw}>
            Refresh
          </Button>

          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            New Slot
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching service schedules..." />}
      {error && <ErrorState message={error} onRetry={fetchHours} />}

      {!loading && !error && filteredHours.length === 0 && (
        <EmptyState
          icon={Clock}
          title={searchTerm ? 'No Matching Slots' : 'Schedule Empty'}
          description={
            searchTerm
              ? `No hours match query "${searchTerm}".`
              : 'Add your first opening hours slot to inform visitors.'
          }
          actionLabel={searchTerm ? undefined : 'Add Slot'}
          onAction={searchTerm ? undefined : openCreateModal}
        />
      )}

      {!loading && !error && filteredHours.length > 0 && (
        <div className="bg-white border border-[#E2DCCE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[550px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Day Range</th>
                  <th className="py-3.5 px-6">Time Range</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCCE]/60">
                {filteredHours.map((slot) => (
                  <tr key={slot.Id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-[#24251F]/40">
                      #{slot.Id}
                    </td>
                    <td className="py-4 px-6 font-medium text-[#24251F]">
                      {slot.DayRange}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/70 font-mono">
                      {slot.TimeRange}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant={slot.IsClosed ? 'neutral' : 'primary'}>
                        {slot.IsClosed ? 'Closed' : 'Open'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(slot)}
                        className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                        title="Edit Slot"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(slot)}
                        className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Slot"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlot ? 'Edit Schedule Slot' : 'New Schedule Slot'}
        subtitle={
          editingSlot
            ? `Updating schedule ID #${editingSlot.Id}`
            : 'Specify operating days and service hours.'
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Day Range"
            name="DayRange"
            placeholder="e.g. Monday – Friday or Weekends"
            value={formData.DayRange}
            onChange={(e) => setFormData({ ...formData, DayRange: e.target.value })}
            error={formErrors.DayRange}
            helperText={`Prefix with "${TEST_DATA_PREFIX}" for test entries`}
            required
          />

          <Input
            label="Time Range"
            name="TimeRange"
            placeholder="e.g. 07:00 – 16:30"
            value={formData.TimeRange}
            onChange={(e) => setFormData({ ...formData, TimeRange: e.target.value })}
            error={formErrors.TimeRange}
            disabled={formData.IsClosed}
          />

          <div className="flex items-center gap-3 pt-2">
            <input
              id="IsClosed"
              type="checkbox"
              checked={formData.IsClosed}
              onChange={(e) => setFormData({ ...formData, IsClosed: e.target.checked })}
              className="w-4 h-4 text-[#435640] rounded border-[#DED9CE] focus:ring-[#435640]"
            />
            <label htmlFor="IsClosed" className="text-xs uppercase tracking-[0.12em] text-[#24251F] font-medium cursor-pointer">
              Mark as Closed (e.g. Public Holidays)
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2DCCE] flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
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
              {editingSlot ? 'Save Changes' : 'Create Slot'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Schedule Slot"
        message={`Are you sure you want to delete the schedule slot for "${deleteTarget?.DayRange}"?`}
        confirmLabel="Confirm Delete"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default OpeningHoursPage;
