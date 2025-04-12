import axios from 'axios';

const BASE_URL = 'https://localhost:7282/api'; // API URL'sini doğru şekilde yaz

export const api = {
  registerUser: async (registerData) => {
    const response = await axios.post(`${BASE_URL}/User/Register`, registerData);
    return response.data;
  },
  
  loginUser: async (loginData) => {
    const response = await axios.post(`${BASE_URL}/User/Login`, loginData);
    return response.data;
  },

  // Diğer API fonksiyonları
  getVehicles: async () => {
    const response = await axios.get(`${BASE_URL}/Vehicle/GetVehicles`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await axios.get(`${BASE_URL}/Vehicle/${id}`);
    return response.data;
  },

  placeBid: async (bid) => {
    const response = await axios.post(`${BASE_URL}/PlaceBid`, bid);
    return response.data;
  },

  updateVehiclePrice: async (vehicleId, newPrice) => {
    const response = await axios.patch(`${BASE_URL}/UpdateVehiclePrice/${vehicleId}`, {
      currentPrice: newPrice
    });
    return response.data;
  },

  getVehiclesBySellerId: async (sellerId) => {
    const res = await axios.get(`${BASE_URL}/Vehicle/GetBySeller/${sellerId}`);
    return res.data;
  },
  
  getVehiclesUserBidOn: async (userId) => {
    const res = await axios.get(`${BASE_URL}/Vehicle/GetByBidder/${userId}`);
    return res.data;
  }  
};

export default api;
