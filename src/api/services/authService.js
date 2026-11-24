import axiosClient from '../axiosClient.js';

export const authService = {
  async getNames() {
    const res = await axiosClient.get('/auth/getNames');
    return res.Response || [];
  },
  async getUnits() {
    const res = await axiosClient.get('/auth/getUnits');
    return res.Response || [];
  },
};

export default authService;
