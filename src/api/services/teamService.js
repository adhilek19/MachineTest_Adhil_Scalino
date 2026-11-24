import axiosClient from '../axiosClient.js';

export const teamService = {
  async getTeams() {
    const res = await axiosClient.get('/cafe/getTeams');
    return res.Response || [];
  },
  async getTeamById(id) {
    const res = await axiosClient.get(`/cafe/getTeamById?id=${id}`);
    return res.Response;
  },
  async insertTeam(model) {
    const res = await axiosClient.post('/cafe/insertTeam', model);
    return res;
  },
  async updateTeam(model) {
    const res = await axiosClient.put('/cafe/updateTeam', model);
    return res;
  },
  async deleteTeam(id) {
    const res = await axiosClient.delete(`/cafe/deleteTeam/${id}`);
    return res;
  },
};

export default teamService;
