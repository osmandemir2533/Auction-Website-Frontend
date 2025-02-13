import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const api = {
  getVehicles: async () => {
    const response = await axios.get(`${BASE_URL}/vehicles`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await axios.get(`${BASE_URL}/vehicles/${id}`);
    return response.data;
  },

  placeBid: async (bid) => {
    const response = await axios.post(`${BASE_URL}/bids`, bid);
    return response.data;
  },

  updateVehiclePrice: async (vehicleId, newPrice) => {
    const response = await axios.patch(`${BASE_URL}/vehicles/${vehicleId}`, {
      currentPrice: newPrice
    });
    return response.data;
  }
};

export default api; 