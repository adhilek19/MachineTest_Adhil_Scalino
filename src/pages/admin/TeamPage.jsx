import React, { useState, useEffect } from 'react';
import { teamService } from '../../api/services';
import { resolveImageUrl, fileToBase64 } from '../../utils/imageUtils';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import { Users, Plus, RefreshCw, Trash2, Edit, Search, Upload } from 'lucide-react';
import { TEST_DATA_PREFIX } from '../../utils/constants';

export function TeamPage() {
  const toast = useToast();
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Designation: '',
    SubText: '',
    Base64Image: '',
    ImageFileName: '',
    ExistingImagePath: '',
    previewUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getTeams();
      setTeam(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      Name: '',
      Designation: '',
      SubText: '',
      Base64Image: '',
      ImageFileName: '',
      ExistingImagePath: '',
      previewUrl: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      Name: member.Name || '',
      Designation: member.Designation || '',
      SubText: member.SubText || '',
      Base64Image: '',
      ImageFileName: '',
      ExistingImagePath: member.ImagePath || '',
      previewUrl: member.ImagePath ? resolveImageUrl(member.ImagePath) : '',
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
          Base64Image: base64,
          ImageFileName: fileName,
          previewUrl: dataUrl,
        }));
      } catch (err) {
        toast.error('Failed to process image file');
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.Name.trim()) errs.Name = 'Name is required';
    if (!formData.Designation.trim()) errs.Designation = 'Designation is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        Name: formData.Name.trim(),
        Designation: formData.Designation.trim(),
        SubText: formData.SubText.trim(),
        Base64Image: formData.Base64Image,
        ImageFileName: formData.ImageFileName,
        ExistingImagePath: formData.ExistingImagePath,
      };

      if (editingMember) {
        await teamService.updateTeam({
          Id: editingMember.Id,
          ...payload,
        });
        toast.success(`Staff member "${payload.Name}" updated successfully.`);
      } else {
        await teamService.insertTeam(payload);
        toast.success(`Staff member "${payload.Name}" added to the roster.`);
      }

      setIsModalOpen(false);
      fetchTeam();
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
      await teamService.deleteTeam(deleteTarget.Id);
      toast.success(`Staff member "${deleteTarget.Name}" removed.`);
      setDeleteTarget(null);
      fetchTeam();
    } catch (err) {
      toast.error(err.message || 'Failed to remove staff member.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTeam = team.filter(
    (m) =>
      m.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.Designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Culinary Team Roster</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Manage chefs, master baristas, and kitchen staff featured on the public site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-52"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchTeam} icon={RefreshCw}>
            Refresh
          </Button>

          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            Add Member
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching culinary team roster..." />}
      {error && <ErrorState message={error} onRetry={fetchTeam} />}

      {!loading && !error && filteredTeam.length === 0 && (
        <EmptyState
          icon={Users}
          title={searchTerm ? 'No Matching Staff' : 'Roster Empty'}
          description={
            searchTerm
              ? `No team members match query "${searchTerm}".`
              : 'Add your first barista or chef to showcase on the website.'
          }
          actionLabel={searchTerm ? undefined : 'Add Staff Member'}
          onAction={searchTerm ? undefined : openCreateModal}
        />
      )}

      {!loading && !error && filteredTeam.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <div
              key={member.Id}
              className="bg-white border border-[#E2DCCE] p-5 flex flex-col justify-between hover:border-[#435640] transition-colors"
            >
              <div>
                <div className="aspect-[4/3] bg-[#EFEBE1] border border-[#E2DCCE] overflow-hidden mb-4">
                  <img
                    src={resolveImageUrl(member.ImagePath)}
                    alt={member.Name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#BD8856] font-medium block">
                  {member.Designation}
                </span>
                <h3 className="font-serif text-xl text-[#24251F] mt-1">
                  {member.Name}
                </h3>
                {member.SubText && (
                  <p className="text-xs text-[#24251F]/60 italic mt-2 line-clamp-2 font-light">
                    "{member.SubText}"
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E2DCCE] flex items-center justify-between text-xs">
                <span className="font-mono text-[#24251F]/40 text-[11px]">
                  ID #{member.Id}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                    title="Edit Member"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(member)}
                    className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Staff Member' : 'New Staff Member'}
        subtitle={
          editingMember
            ? `Editing team member ID #${editingMember.Id}`
            : 'Add a new culinary team member with photograph.'
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Full Name"
            name="Name"
            placeholder="e.g. Elena Rostova"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            error={formErrors.Name}
            helperText={`Prefix with "${TEST_DATA_PREFIX}" for test entries`}
            required
          />

          <Input
            label="Designation / Role"
            name="Designation"
            placeholder="e.g. Master Barista & Roaster"
            value={formData.Designation}
            onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
            error={formErrors.Designation}
            required
          />

          <Textarea
            label="SubText / Bio Quote"
            name="SubText"
            rows={3}
            placeholder="Brief bio or favorite culinary statement..."
            value={formData.SubText}
            onChange={(e) => setFormData({ ...formData, SubText: e.target.value })}
          />

          {/* Image Upload Area */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#24251F]/80 block">
              Portrait Photo
            </span>

            {formData.previewUrl && (
              <div className="w-24 h-24 border border-[#E2DCCE] overflow-hidden mb-2 bg-[#EFEBE1]">
                <img
                  src={formData.previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer border border-[#DED9CE] px-4 py-2.5 bg-[#FAF8F5] hover:bg-white text-xs uppercase tracking-[0.12em] font-medium text-[#24251F] w-fit">
              <Upload className="w-3.5 h-3.5 text-[#435640]" />
              <span>{formData.previewUrl ? 'Change Photograph' : 'Choose Photograph'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-[#24251F]/50">
              Image automatically converted to Base64 payload as expected by API.
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
              {editingMember ? 'Save Changes' : 'Add to Roster'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Staff Member"
        message={`Are you sure you want to remove "${deleteTarget?.Name}" from the roster?`}
        confirmLabel="Confirm Remove"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default TeamPage;
