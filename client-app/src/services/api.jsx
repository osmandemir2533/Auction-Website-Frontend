import axios from 'axios';

const BASE_URL = 'https://localhost:7282/api'; // Backend'in yeni adresi

export const api = {
  getVehicles: async () => {
    const response = await axios.get(`${BASE_URL}/Vehicle/GetVehicles`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await axios.get(`${BASE_URL}/Vehicle/${id}`); // Backend'de ID ile çekme endpointi farklı olabilir, kontrol et
    return response.data;
  },

  placeBid: async (bid) => {
    const response = await axios.post(`${BASE_URL}/PlaceBid`, bid); // Eğer teklif verme için farklı bir endpoint varsa değiştir
    return response.data;
  },

  updateVehiclePrice: async (vehicleId, newPrice) => {
    const response = await axios.patch(`${BASE_URL}/UpdateVehiclePrice/${vehicleId}`, {
      currentPrice: newPrice
    });
    return response.data;
  }
};

export default api;
