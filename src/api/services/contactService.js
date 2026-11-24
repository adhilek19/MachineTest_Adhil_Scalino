import axiosClient from '../axiosClient.js';

/**
 * Service handling Contact Us submissions and inquiry inbox
 */
export const contactService = {
  /**
   * Fetch all contact inquiries (Admin)
   */
  async getContactUs() {
    const res = await axiosClient.get('/cafe/getContactUs');
    const list = res.Response || [];
    return list.map((item) => ({
      ...item,
      IsViewed: Boolean(item.IsViewed),
    }));
  },

  /**
   * Fetch single contact inquiry by ID
   */
  async getContactUsById(id) {
    const res = await axiosClient.get(`/cafe/getContactUsById?id=${id}`);
    if (res.Response) {
      return {
        ...res.Response,
        IsViewed: Boolean(res.Response.IsViewed),
      };
    }
    return null;
  },

  /**
   * Submit new contact inquiry (Public)
   * Formats CreatedOn to prevent SQL Server datetime2 conversion error
   * @param {Object} model { Name, Email, Message }
   */
  async insertContactUs(model) {
    const now = new Date();
    const createdOn = now.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss

    const res = await axiosClient.post('/cafe/insertContactUs', {
      Name: model.Name,
      Email: model.Email,
      Message: model.Message,
      IsViewed: false,
      CreatedOn: createdOn,
    });
    return res;
  },

  /**
   * Delete contact inquiry by ID (Admin)
   */
  async deleteContactUs(id) {
    const res = await axiosClient.delete(`/cafe/deleteContactUs/${id}`);
    return res;
  },
};

export default contactService;
