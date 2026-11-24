import React, { useState, useEffect } from 'react';
import { menuService } from '../../api/services';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { Layers, Plus, RefreshCw, Trash2, Edit, Search } from 'lucide-react';
import { TEST_DATA_PREFIX } from '../../utils/constants';

export function MenuCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    Name: '',
    SubText: '',
    Priority: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve menu categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      Name: '',
      SubText: '',
      Priority: categories.length + 1,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      Name: cat.Name || '',
      SubText: cat.SubText || '',
      Priority: cat.Priority ?? 0,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.Name.trim()) {
      errs.Name = 'Category name is required';
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
        Name: formData.Name.trim(),
        SubText: formData.SubText.trim(),
        Priority: Number(formData.Priority) || 0,
      };

      if (editingCategory) {
        await menuService.updateCategory({
          Id: editingCategory.Id,
          ...payload,
        });
        toast.success(`Category "${payload.Name}" updated successfully.`);
      } else {
        await menuService.insertCategory(payload);
        toast.success(`Category "${payload.Name}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchCategories();
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
      await menuService.deleteCategory(deleteTarget.Id);
      toast.success(`Category "${deleteTarget.Name}" removed.`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Menu Categories</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Manage top-level menu groupings (e.g., Breakfast, Filter Coffee, Kitchen Specials).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-52"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchCategories} icon={RefreshCw}>
            Refresh
          </Button>

          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            New Category
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching categories from API..." />}
      {error && <ErrorState message={error} onRetry={fetchCategories} />}

      {!loading && !error && filteredCategories.length === 0 && (
        <EmptyState
          icon={Layers}
          title={searchTerm ? 'No Matching Categories' : 'No Categories Configured'}
          description={
            searchTerm
              ? `No categories match query "${searchTerm}".`
              : 'Add your first menu category to begin structuring the menu.'
          }
          actionLabel={searchTerm ? undefined : 'Create Category'}
          onAction={searchTerm ? undefined : openCreateModal}
        />
      )}

      {!loading && !error && filteredCategories.length > 0 && (
        <div className="bg-white border border-[#E2DCCE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[600px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Category Name</th>
                  <th className="py-3.5 px-6">Tagline / SubText</th>
                  <th className="py-3.5 px-6 text-center">Display Priority</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCCE]/60">
                {filteredCategories.map((cat) => (
                  <tr key={cat.Id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-[#24251F]/40">
                      #{cat.Id}
                    </td>
                    <td className="py-4 px-6 font-medium text-[#24251F]">
                      {cat.Name}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/60 font-light">
                      {cat.SubText || '—'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant="neutral">{cat.Priority ?? 0}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Category"
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
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        subtitle={
          editingCategory
            ? `Updating category ID #${editingCategory.Id}`
            : 'Add a new section heading for grouping menu items.'
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Category Name"
            name="Name"
            placeholder="e.g. Filter Coffee or All-Day Brunch"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            error={formErrors.Name}
            helperText={`For test submissions, feel free to prefix with "${TEST_DATA_PREFIX}"`}
            required
          />

          <Input
            label="SubText / Tagline"
            name="SubText"
            placeholder="e.g. Single-origin hand pours and batch brews"
            value={formData.SubText}
            onChange={(e) => setFormData({ ...formData, SubText: e.target.value })}
          />

          <Input
            label="Ordering Priority"
            name="Priority"
            type="number"
            value={formData.Priority}
            onChange={(e) => setFormData({ ...formData, Priority: e.target.value })}
            helperText="Lower numbers appear first in the public navigation tabs."
          />

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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Menu Category"
        message={`Are you sure you want to delete category "${deleteTarget?.Name}"? Note: Menu items attached to this category may lose their grouping.`}
        confirmLabel="Confirm Delete"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default MenuCategoriesPage;
