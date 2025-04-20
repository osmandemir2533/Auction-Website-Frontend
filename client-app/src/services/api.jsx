import axios from 'axios';

const BASE_URL = 'https://localhost:7282/api';

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

  getVehicleById: async (vehicleId) => {
    const response = await axios.get(`${BASE_URL}/Vehicle/${vehicleId}`);
    return response.data;
  },

  deleteVehicle: async (vehicleId) => {
    const response = await axios.delete(`${BASE_URL}/Vehicle/Remove/Vehicle/${vehicleId}`);
    return response.data;
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const response = await axios.put(`${BASE_URL}/Vehicle/${vehicleId}`, vehicleData);
    return response.data;
  },

  placeBid: async (itemId, amount, itemType) => {
    try {
      const response = await axios.post(`${BASE_URL}/Bid/PlaceBid`, {
        itemId,
        amount,
        itemType
      });
      return response.data;
    } catch (error) {
      console.error('Bid API hatası:', error);
      return { isSuccess: false, error: error.message };
    }
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
  },

  // Dress endpoints
  getDresses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Dress/GetDresses`);
      return {
        isSuccess: response.data.isSuccess,
        result: response.data.result || [],
        error: response.data.errorMessages?.join(', ')
      };
    } catch (error) {
      console.error('Dress API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
    }
  },

  getDressById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/Dress/${id}`);
      return {
        isSuccess: response.data.isSuccess,
        result: response.data.result,
        error: response.data.errorMessages?.join(', ')
      };
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  addDress: async (dressData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Dress/CreateDress`, dressData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateDress: async (id, dressData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Dress/UpdateDress`, dressData, {
        params: { dressId: id }
      });
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteDress: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Dress/Remove/Dress/${id}`);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  // Musical Instrument endpoints
  getMusicalInstruments: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/MusicalInstrument/GetInstruments`);
      return {
        isSuccess: response.data.isSuccess,
        result: response.data.result || [],
        error: response.data.errorMessages?.join(', ')
      };
    } catch (error) {
      console.error('Musical Instrument API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
    }
  },

  getInstrumentDetail: async (instrumentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/MusicalInstrument/${instrumentId}`);
      return response.data;
    } catch (error) {
      console.error('Musical Instrument Detail API hatası:', error);
      return { isSuccess: false, error: error.message, result: null };
    }
  },

  addMusicalInstrument: async (instrumentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/MusicalInstrument/CreateInstrument`, instrumentData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateMusicalInstrument: async (id, instrumentData) => {
    try {
      const response = await axios.put(`${BASE_URL}/MusicalInstrument/UpdateInstrument`, instrumentData, {
        params: { instrumentId: id }
      });
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteMusicalInstrument: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/MusicalInstrument/Remove/Instrument/${id}`);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  // Electronic endpoints (from api1.jsx)
  getElectronics: async () => {
    try {
      console.log('Fetching electronics from API...');
      const response = await axios.get(`${BASE_URL}/Electronic/GetElectronics`);
      console.log('Raw API Response:', response);
      
      if (Array.isArray(response.data)) {
        return {
          isSuccess: true,
          result: response.data
        };
      }
      
      if (response.data && response.data.result) {
        return {
          isSuccess: true,
          result: response.data.result
        };
      }
      
      return {
        isSuccess: false,
        error: 'Invalid response format',
        result: []
      };
    } catch (error) {
      console.error('Electronic API hatası:', error);
      return {
        isSuccess: false,
        error: error.message,
        result: []
      };
    }
  },

  getElectronicById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/Electronic/GetElectronic/${id}`);
      return response.data;
    } catch (error) {
      console.error('Electronic API hatası:', error);
      return { isSuccess: false, error: error.message };
    }
  },

  addElectronic: async (electronicData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Electronic/AddElectronic`, electronicData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateElectronic: async (id, electronicData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Electronic/UpdateElectronic/${id}`, electronicData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteElectronic: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Electronic/DeleteElectronic/${id}`);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  // Estate endpoints (from api1.jsx)
  getEstates: async () => {
    try {
      console.log('Fetching estates from API...');
      const response = await axios.get(`${BASE_URL}/Estate/GetEstates`);
      console.log('Raw Estate API Response:', response);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Estates data is array:', response.data);
        return {
          isSuccess: true,
          result: response.data
        };
      }
      
      if (response.data && response.data.result && Array.isArray(response.data.result)) {
        console.log('Estates data in result field:', response.data.result);
        return {
          isSuccess: true,
          result: response.data.result
        };
      }
      
      console.error('Invalid estates data format:', response.data);
      return {
        isSuccess: false,
        error: 'Invalid response format',
        result: []
      };
    } catch (error) {
      console.error('Estate API hatası:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      return {
        isSuccess: false,
        error: error.message,
        result: []
      };
    }
  },

  getEstateById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/Estate/${id}`);
      return response.data;
    } catch (error) {
      console.error('Estate API hatası:', error);
      return { isSuccess: false, error: error.message };
    }
  },

  addEstate: async (estateData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Estate/AddEstate`, estateData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateEstate: async (id, estateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Estate/UpdateEstate/${id}`, estateData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteEstate: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Estate/DeleteEstate/${id}`);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateEstatePrice: async (estateId, newPrice) => {
    try {
      const response = await axios.patch(`${BASE_URL}/Estate/UpdatePrice/${estateId}`, {
        currentPrice: newPrice
      });
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  placeEstateBid: async (bid) => {
    try {
      const response = await axios.post(`${BASE_URL}/Estate/PlaceBid`, bid);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  createVehicle: async (formData) => {
    try {
      // FormData içeriğini detaylı logla
      const formDataObj = {};
      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }
      console.log('API\'ye gönderilen FormData içeriği:', formDataObj);
      
      const response = await axios.post(`${BASE_URL}/Vehicle/CreateVehicle`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data) {
        return { isSuccess: true, result: response.data };
      } else {
        return { isSuccess: false, error: 'Beklenmeyen bir hata oluştu' };
      }
    } catch (error) {
      console.error('Vehicle API hatası:', error.response?.data);
      
      // Backend'den gelen validasyon hatalarını detaylı göster
      if (error.response?.data?.errors) {
        const validationErrors = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        console.error('Validasyon Hataları:', validationErrors);
        return { 
          isSuccess: false, 
          error: validationErrors 
        };
      }
      
      return { 
        isSuccess: false, 
        error: error.response?.data?.title || error.message 
      };
    }
  },
};

export default api; 