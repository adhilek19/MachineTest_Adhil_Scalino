import axiosClient from '../axiosClient.js';

export const openingHourService = {
  async getOpeningHours() {
    const res = await axiosClient.get('/cafe/getOpeningHours');
    const list = res.Response || [];
    return list.map((item) => ({
      ...item,
      IsClosed: Boolean(item.IsClosed),
    }));
  },
  async getOpeningHourById(id) {
    const res = await axiosClient.get(`/cafe/getOpeningHourById?id=${id}`);
    if (res.Response) {
      return {
        ...res.Response,
        IsClosed: Boolean(res.Response.IsClosed),
      };
    }
    return null;
  },
  async insertOpeningHour(model) {
    const res = await axiosClient.post('/cafe/insertOpeningHour', {
      ...model,
      IsClosed: Boolean(model.IsClosed),
    });
    return res;
  },
  async updateOpeningHour(model) {
    const res = await axiosClient.put('/cafe/updateOpeningHour', {
      ...model,
      IsClosed: Boolean(model.IsClosed),
    });
    return res;
  },
  async deleteOpeningHour(id) {
    const res = await axiosClient.delete(`/cafe/deleteOpeningHour/${id}`);
    return res;
  },
};

export default openingHourService;
