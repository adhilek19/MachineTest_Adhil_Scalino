import axiosClient from '../axiosClient.js';

export const testimonialService = {
  async getTestimonials() {
    const res = await axiosClient.get('/cafe/getTestimonials');
    return res.Response || [];
  },
  async getTestimonialById(id) {
    const res = await axiosClient.get(`/cafe/getTestimonialById?id=${id}`);
    return res.Response;
  },
  async insertTestimonial(model) {
    const res = await axiosClient.post('/cafe/insertTestimonial', model);
    return res;
  },
  async updateTestimonial(model) {
    const res = await axiosClient.put('/cafe/updateTestimonial', model);
    return res;
  },
  async deleteTestimonial(id) {
    const res = await axiosClient.delete(`/cafe/deleteTestimonial/${id}`);
    return res;
  },
};

export default testimonialService;
