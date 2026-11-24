import axiosClient from '../axiosClient.js';

export const menuService = {
  // Categories
  async getCategories() {
    const res = await axiosClient.get('/menu/getMenuCategories');
    return res.Response || [];
  },
  async getCategoryById(id) {
    const res = await axiosClient.get(`/menu/getMenuCategoryById?id=${id}`);
    return res.Response;
  },
  async insertCategory(model) {
    const res = await axiosClient.post('/menu/insertMenuCategory', model);
    return res;
  },
  async updateCategory(model) {
    const res = await axiosClient.put('/menu/updateMenuCategory', model);
    return res;
  },
  async deleteCategory(id) {
    const res = await axiosClient.delete(`/menu/deleteMenuCategory/${id}`);
    return res;
  },

  // Menu Items
  async getMenuItems() {
    const res = await axiosClient.get('/menu/getMenus');
    const list = res.Response || [];
    return list.map((item) => ({
      ...item,
      IsActive: Boolean(item.IsActive),
    }));
  },
  async getMenuItemById(id) {
    const res = await axiosClient.get(`/menu/getMenuById?id=${id}`);
    if (res.Response) {
      return {
        ...res.Response,
        IsActive: Boolean(res.Response.IsActive),
      };
    }
    return null;
  },
  async insertMenuItem(model) {
    const res = await axiosClient.post('/menu/insertMenu', {
      ...model,
      IsActive: Boolean(model.IsActive),
    });
    return res;
  },
  async updateMenuItem(model) {
    const res = await axiosClient.put('/menu/updateMenu', {
      ...model,
      IsActive: Boolean(model.IsActive),
    });
    return res;
  },
  async deleteMenuItem(id) {
    const res = await axiosClient.delete(`/menu/deleteMenu/${id}`);
    return res;
  },
};

export default menuService;
