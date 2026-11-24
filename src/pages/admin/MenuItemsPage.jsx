import React, { useState, useEffect } from 'react';
import { menuService } from '../../api/services';
import { formatPrice } from '../../utils/formatters';
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
import Badge from '../../components/common/Badge';
import { UtensilsCrossed, Plus, RefreshCw, Trash2, Edit, Search } from 'lucide-react';
import { TEST_DATA_PREFIX } from '../../utils/constants';

export function MenuItemsPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    Name: '',
    CategoryId: '',
    Price: '',
    OfferPrice: '',
    TagName: '',
    Description: '',
    IsActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const [itemList, catList] = await Promise.all([
        menuService.getMenuItems(),
        menuService.getCategories(),
      ]);
      setItems(itemList);
      setCategories(catList);
    } catch (err) {
      setError(err.message || 'Failed to retrieve menu catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      Name: '',
      CategoryId: categories.length > 0 ? categories[0].Id : '',
      Price: '',
      OfferPrice: '',
      TagName: '',
      Description: '',
      IsActive: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      Name: item.Name || '',
      CategoryId: item.CategoryId || (categories.length > 0 ? categories[0].Id : ''),
      Price: item.Price ?? '',
      OfferPrice: item.OfferPrice ?? '',
      TagName: item.TagName || '',
      Description: item.Description || '',
      IsActive: Boolean(item.IsActive),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.Name.trim()) errs.Name = 'Item name is required';
    if (!formData.CategoryId) errs.CategoryId = 'Category is required';
    if (formData.Price === '' || isNaN(Number(formData.Price)) || Number(formData.Price) < 0) {
      errs.Price = 'Valid price is required';
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
        CategoryId: Number(formData.CategoryId),
        Name: formData.Name.trim(),
        Description: formData.Description.trim(),
        Price: Number(formData.Price),
        OfferPrice: formData.OfferPrice ? Number(formData.OfferPrice) : 0,
        TagName: formData.TagName.trim(),
        IsActive: Boolean(formData.IsActive),
      };

      if (editingItem) {
        await menuService.updateMenuItem({
          Id: editingItem.Id,
          ...payload,
        });
        toast.success(`Menu item "${payload.Name}" updated successfully.`);
      } else {
        await menuService.insertMenuItem(payload);
        toast.success(`Menu item "${payload.Name}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchCatalog();
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
      await menuService.deleteMenuItem(deleteTarget.Id);
      toast.success(`Menu item "${deleteTarget.Name}" removed.`);
      setDeleteTarget(null);
      fetchCatalog();
    } catch (err) {
      toast.error(err.message || 'Failed to delete menu item.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.TagName && item.TagName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat =
      categoryFilter === 'ALL' || item.CategoryId === Number(categoryFilter);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="bg-white border border-[#E2DCCE] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#24251F]">Menu Items Catalog</h2>
          <p className="text-xs text-[#24251F]/60 mt-1 font-light">
            Manage café offerings, prices, offer discounts, active flags, and badges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#24251F]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 border border-[#DED9CE] bg-white focus:outline-none focus:border-[#435640] w-full sm:w-52"
            />
          </div>

          {/* Category Dropdown Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 border border-[#DED9CE] bg-white text-[#24251F] focus:outline-none focus:border-[#435640]"
            >
              <option value="ALL">All Categories ({items.length})</option>
              {categories.map((c) => (
                <option key={c.Id} value={c.Id}>
                  {c.Name}
                </option>
              ))}
            </select>
          )}

          <Button variant="outline" size="sm" onClick={fetchCatalog} icon={RefreshCw}>
            Refresh
          </Button>

          <Button variant="primary" size="sm" onClick={openCreateModal} icon={Plus}>
            New Item
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Fetching menu items..." />}
      {error && <ErrorState message={error} onRetry={fetchCatalog} />}

      {!loading && !error && filteredItems.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title={searchTerm || categoryFilter !== 'ALL' ? 'No Matching Items' : 'Menu Catalog Empty'}
          description={
            searchTerm || categoryFilter !== 'ALL'
              ? 'No items match your active search and category filters.'
              : 'Add your first menu item to display on the public menu.'
          }
          actionLabel={searchTerm || categoryFilter !== 'ALL' ? undefined : 'Add Menu Item'}
          onAction={searchTerm || categoryFilter !== 'ALL' ? undefined : openCreateModal}
        />
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="bg-white border border-[#E2DCCE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[680px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E2DCCE] text-[10px] uppercase tracking-[0.14em] text-[#24251F]/60 whitespace-nowrap">
                  <th className="py-3.5 px-6">Item Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Offer Price</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCCE]/60">
                {filteredItems.map((item) => (
                  <tr key={item.Id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#24251F]">{item.Name}</span>
                        {item.TagName && (
                          <Badge variant="accent" size="xs">
                            {item.TagName}
                          </Badge>
                        )}
                      </div>
                      {item.Description && (
                        <p className="text-xs text-[#24251F]/50 mt-0.5 line-clamp-1 font-light">
                          {item.Description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24251F]/70">
                      {item.CategoryName || `Cat #${item.CategoryId}`}
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-xs text-[#24251F]">
                      {formatPrice(item.Price)}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[#BD8856]">
                      {item.OfferPrice && item.OfferPrice > 0
                        ? formatPrice(item.OfferPrice)
                        : '—'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant={item.IsActive ? 'primary' : 'neutral'}>
                        {item.IsActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-[#24251F]/60 hover:text-[#435640] hover:bg-[#435640]/5 transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-[#24251F]/60 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Item"
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
        title={editingItem ? 'Edit Menu Item' : 'New Menu Item'}
        subtitle={
          editingItem
            ? `Editing item ID #${editingItem.Id}`
            : 'Add a handcrafted beverage or kitchen specialty.'
        }
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Item Name"
            name="Name"
            placeholder="e.g. Sourdough French Toast"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            error={formErrors.Name}
            helperText={`Prefix with "${TEST_DATA_PREFIX}" for test entries`}
            required
          />

          <Select
            label="Menu Category"
            name="CategoryId"
            value={formData.CategoryId}
            onChange={(e) => setFormData({ ...formData, CategoryId: e.target.value })}
            options={categories.map((c) => ({ value: c.Id, label: c.Name }))}
            error={formErrors.CategoryId}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Price ($)"
              name="Price"
              type="number"
              step="0.01"
              placeholder="e.g. 14.50"
              value={formData.Price}
              onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
              error={formErrors.Price}
              required
            />

            <Input
              label="Offer / Discount Price ($)"
              name="OfferPrice"
              type="number"
              step="0.01"
              placeholder="0 or discounted price"
              value={formData.OfferPrice}
              onChange={(e) => setFormData({ ...formData, OfferPrice: e.target.value })}
              helperText="Leave empty or 0 if regular price applies."
            />
          </div>

          <Input
            label="Promotional Tag"
            name="TagName"
            placeholder="e.g. Specialty, Bestseller, Chef Choice"
            value={formData.TagName}
            onChange={(e) => setFormData({ ...formData, TagName: e.target.value })}
          />

          <Textarea
            label="Dish or Drink Description"
            name="Description"
            rows={3}
            placeholder="Describe the flavor profile, roast origin, or culinary ingredients..."
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
          />

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="IsActive"
              type="checkbox"
              checked={formData.IsActive}
              onChange={(e) => setFormData({ ...formData, IsActive: e.target.checked })}
              className="w-4 h-4 text-[#435640] rounded border-[#DED9CE] focus:ring-[#435640]"
            />
            <label htmlFor="IsActive" className="text-xs uppercase tracking-[0.12em] text-[#24251F] font-medium cursor-pointer">
              Visible on Public Menu (Active)
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
              {editingItem ? 'Save Changes' : 'Create Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Menu Item"
        message={`Are you sure you want to permanently delete "${deleteTarget?.Name}"? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default MenuItemsPage;
