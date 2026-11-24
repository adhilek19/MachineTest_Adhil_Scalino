import React, { useState, useEffect } from 'react';
import { testimonialService } from '../../api/services';
import { resolveImageUrl, fileToBase64 } from '../../utils/imageUtils';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { Quote, Plus, RefreshCw, Trash2, Edit, Search, Star, Upload } from 'lucide-react';
import { TEST_DATA_PREFIX } from '../../utils/constants';

export function TestimonialsPage() {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    CustomerName: '',
    Description: '',
    Rating: 10,
    Base64CustomerImage: '',
    CustomerImageFileName: '',
    CustomerExistingImagePath: '',
    previewUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testimonialService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve customer reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      CustomerName: '',
      Description: '',
      Rating: 10,
      Base64CustomerImage: '',
      CustomerImageFileName: '',
      CustomerExistingImagePath: '',
      previewUrl: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (test) => {
    setEditingTestimonial(test);
    setFormData({
      CustomerName: test.CustomerName || '',
      Description: test.Description || '',
      Rating: test.Rating ?? 10,
      Base64CustomerImage: '',
      CustomerImageFileName: '',
      CustomerExistingImagePath: test.CustomerImagePath || '',
      previewUrl: test.CustomerImagePath ? resolveImageUrl(test.CustomerImagePath) : '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { base64, dataUrl, fileName } = await fileToBase64(file);
        setFormData((prev) => ({
          ...prev,
          Base64CustomerImage: base64,
          CustomerImageFileName: fileName,
          previewUrl: dataUrl,
        }));
      } catch {
        toast.error('Failed to process image file');
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.CustomerName.trim()) errs.CustomerName = 'Customer name is required';
    if (!formData.Description.trim()) errs.Description = 'Review text is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        CustomerName: formData.CustomerName.trim(),
        Description: formData.Description.trim(),
        Rating: Number(formData.Rating) || 10,
        Base64CustomerImage: formData.Base64CustomerImage,
        CustomerImageFileName: formData.CustomerImageFileName,
        CustomerExistingImagePath: formData.CustomerExistingImagePath,
      };

      if (editingTestimonial) {
        await testimonialService.updateTestimonial({
          Id: editingTestimonial.Id,
          ...payload,
        });
        toast.success(`Review from "${payload.CustomerName}" updated.`);
      } else {
        await testimonialService.insertTestimonial(payload);
        toast.success(`Review from "${payload.CustomerName}" published.`);
      }

      setIsModalOpen(false);
      fetchTestimonials();
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
      await testimonialService.deleteTestimonial(deleteTarget.Id);
      toast.success(`Review from "${deleteTarget.CustomerName}" deleted.`);
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.message || 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Customer Testimonials</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Manage customer quotes and verified ratings displayed on the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reviewer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-52"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchTestimonials} icon={RefreshCw}>
            Refresh
          </Button>

          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            New Review
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching reviews from API..." />}
      {error && <ErrorState message={error} onRetry={fetchTestimonials} />}

      {!loading && !error && filteredTestimonials.length === 0 && (
        <EmptyState
          icon={Quote}
          title={searchTerm ? 'No Matching Reviews' : 'No Reviews Found'}
          description={
            searchTerm
              ? `No testimonials match query "${searchTerm}".`
              : 'Add customer feedback to showcase guest sentiment on the website.'
          }
          actionLabel={searchTerm ? undefined : 'Add Review'}
          onAction={searchTerm ? undefined : openCreateModal}
        />
      )}

      {!loading && !error && filteredTestimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((test) => (
            <div
              key={test.Id}
              className="bg-white border border-[#E2DCCE] p-6 flex flex-col justify-between hover:border-[#435640] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EFEBE1] border border-[#E2DCCE] flex-shrink-0">
                      <img
                        src={resolveImageUrl(test.CustomerImagePath)}
                        alt={test.CustomerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-[#24251F]">
                        {test.CustomerName}
                      </h4>
                      <div className="flex items-center gap-1 text-[#BD8856] text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#BD8856]" />
                        <span className="font-mono text-xs">{test.Rating}/10</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#24251F]/40">
                    ID #{test.Id}
                  </span>
                </div>

                <p className="font-serif text-sm sm:text-base text-[#24251F]/80 italic leading-relaxed">
                  "{test.Description}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2DCCE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(test)}
                  className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                  title="Edit Review"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(test)}
                  className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Review' : 'New Customer Review'}
        subtitle={
          editingTestimonial
            ? `Updating testimonial ID #${editingTestimonial.Id}`
            : 'Add verified guest testimonial and rating.'
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Customer Name"
            name="CustomerName"
            placeholder="e.g. Sandra Thorne"
            value={formData.CustomerName}
            onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}
            error={formErrors.CustomerName}
            helperText={`Prefix with "${TEST_DATA_PREFIX}" for test entries`}
            required
          />

          <Select
            label="Rating Score"
            name="Rating"
            value={formData.Rating}
            onChange={(e) => setFormData({ ...formData, Rating: e.target.value })}
            options={[
              { value: 10, label: '10 / 10 — Exceptional Experience' },
              { value: 9, label: '9 / 10 — Superb' },
              { value: 8, label: '8 / 10 — Very Good' },
              { value: 7, label: '7 / 10 — Good' },
              { value: 6, label: '6 / 10 — Satisfactory' },
              { value: 5, label: '5 / 10 — Average' },
            ]}
          />

          <Textarea
            label="Review Text"
            name="Description"
            rows={4}
            placeholder="Write the customer's comment or quote..."
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
            error={formErrors.Description}
            required
          />

          {/* Photo Upload */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#24251F]/80 block">
              Customer Photograph
            </span>

            {formData.previewUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E2DCCE] mb-2 bg-[#EFEBE1]">
                <img
                  src={formData.previewUrl}
                  alt="Customer Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer border border-[#DED9CE] px-4 py-2.5 bg-[#FAF8F5] hover:bg-white text-xs uppercase tracking-[0.12em] font-medium text-[#24251F] w-fit">
              <Upload className="w-3.5 h-3.5 text-[#435640]" />
              <span>{formData.previewUrl ? 'Change Photo' : 'Select Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-[#24251F]/50">
              Payload automatically formatted to Base64 schema.
            </p>
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
              {editingTestimonial ? 'Save Changes' : 'Publish Review'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Customer Review"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.CustomerName}"?`}
        confirmLabel="Confirm Delete"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default TestimonialsPage;
