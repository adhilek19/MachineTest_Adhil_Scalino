import axiosClient from '../axiosClient.js';

/**
 * Service handling Table Reservation bookings
 */
export const reservationService = {
  /**
   * Fetch all reservations (Admin)
   */
  async getReservations() {
    const res = await axiosClient.get('/cafe/getReservation');
    return res.Response || [];
  },

  /**
   * Fetch single reservation by ID
   */
  async getReservationById(id) {
    const res = await axiosClient.get(`/cafe/getReservationById?id=${id}`);
    return res.Response;
  },

  /**
   * Submit new table reservation (Public)
   * Sanitizes Date, Time and CreatedOn to match SQL Server datetime specifications
   * @param {Object} model { FullName, PhoneNo, Time, Date, BookingCount, Comment }
   */
  async insertReservation(model) {
    const now = new Date();
    const createdOn = now.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss

    let formattedDate = model.Date;
    if (formattedDate) {
      if (formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0] + 'T00:00:00';
      } else {
        formattedDate = `${formattedDate}T00:00:00`;
      }
    } else {
      formattedDate = now.toISOString().split('T')[0] + 'T00:00:00';
    }

    let formattedTime = model.Time || '10:00:00';
    if (formattedTime.length === 5) {
      formattedTime = `${formattedTime}:00`;
    }

    const payload = {
      FullName: model.FullName,
      PhoneNo: model.PhoneNo,
      Date: formattedDate,
      Time: formattedTime,
      BookingCount: Number(model.BookingCount) || 1,
      Comment: model.Comment || 'Table booking',
      CreatedOn: createdOn,
    };

    const res = await axiosClient.post('/cafe/insertReservation', payload);
    return res;
  },

  /**
   * Cancel / delete reservation by ID (Admin)
   */
  async deleteReservation(id) {
    const res = await axiosClient.delete(`/cafe/deleteReservation/${id}`);
    return res;
  },
};

export default reservationService;
