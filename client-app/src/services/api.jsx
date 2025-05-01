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

  updateVehicle: async (vehicleId, formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Vehicle/UpdateVehicle/${vehicleId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      return response.data;
    } catch (error) {
      console.error('Vehicle Update API hatası:', error);
      return { isSuccess: false, error: error.message };
    }
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
      console.log('Gönderilen veri:', instrumentData);
      const response = await axios.post(`${BASE_URL}/MusicalInstrument/CreateInstrument`, instrumentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      console.log('API Yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Müzik Aleti API Hatası Detayları:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      // Validation hatalarını daha detaylı göster
      if (error.response?.data?.errors) {
        console.error('Validation Hataları:', error.response.data.errors);
      }
      
      return { 
        isSuccess: false, 
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
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

  // Electronic endpoints
  getElectronics: async () => {
    try {
      console.log('Fetching electronics from API...');
      const response = await axios.get(`${BASE_URL}/Electronic/GetElectronics`);
      console.log('Raw API Response:', response);
      
      if (response.data && response.data.result) {
        return {
          isSuccess: true,
          result: response.data.result
        };
      } else if (Array.isArray(response.data)) {
        return {
          isSuccess: true,
          result: response.data
        };
      } else {
        console.error('Unexpected API response format:', response.data);
        return {
          isSuccess: false,
          result: [],
          error: 'Unexpected API response format'
        };
      }
    } catch (error) {
      console.error('Electronic API hatası:', error);
      return { isSuccess: false, result: [], error: error.message };
    }
  },


  getElectronicById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/Electronic/${id}`);


      return {
        isSuccess: response.data.isSuccess,
        result: response.data.result,
        error: response.data.errorMessages?.join(', ')
      };


      if (response.data.isSuccess) {
        return response.data;
      } else {
        console.error('Electronic API hatası:', response.data.errorMessages);
        return { isSuccess: false, error: response.data.errorMessages?.join(', ') };
      }

    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  addElectronic: async (electronicData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Electronic/CreateElectronic`, electronicData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateElectronic: async (id, electronicData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Electronic/${id}`, electronicData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteElectronic: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Electronic/Remove/Electronic/${id}`);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  getElectronicsBySeller: async (sellerId) => {
    try {
      const response = await axios.get(`${BASE_URL}/Electronic/GetElectronics`);
      if (response.data.isSuccess) {
        const sellerElectronics = response.data.result.filter(electronic => 
          String(electronic.sellerId) === String(sellerId)
        );
        return {
          isSuccess: true,
          result: sellerElectronics,
          error: null
        };
      }
      return {
        isSuccess: false,
        result: [],
        error: response.data.errorMessages?.join(', ')
      };
    } catch (error) {
      console.error('Electronic API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
    }
  },

  // Estate endpoints
  getEstates: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Estate/GetEstates`);
      return {
        isSuccess: response.data.isSuccess,
        result: response.data.result || [],
        error: response.data.errorMessages?.join(', ')
      };
    } catch (error) {
      console.error('Estate API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
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
      console.log('Gönderilen veri:', estateData);
      const response = await axios.post(`${BASE_URL}/Estate/CreateEstate`, estateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      console.log('API Yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Emlak API Hatası Detayları:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      if (error.response?.data?.errors) {
        console.error('Validation Hataları:', error.response.data.errors);
      }
      
      return { 
        isSuccess: false, 
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  },

  updateEstate: async (id, estateData) => {
    try {
      console.log('Güncellenecek emlak verisi:', estateData);
      const response = await axios.put(`${BASE_URL}/Estate/UpdateEstate/${id}`, estateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      console.log('API Güncelleme Yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Emlak Güncelleme API Hatası:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      if (error.response?.data?.errors) {
        console.error('Validation Hataları:', error.response.data.errors);
      }
      
      return { 
        isSuccess: false, 
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  },

  deleteEstate: async (id) => {
    try {
      console.log('Silinecek emlak ID:', id);
      const response = await axios.delete(`${BASE_URL}/Estate/DeleteEstate/${id}`);
      console.log('API Silme Yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Emlak Silme API Hatası:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      
      if (error.response?.data?.errors) {
        console.error('Validation Hataları:', error.response.data.errors);
      }
      
      return { 
        isSuccess: false, 
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
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
      const response = await axios.post(`${BASE_URL}/Vehicle/CreateVehicle`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      return response.data;
    } catch (error) {
      console.error('Vehicle API hatası:', error);
      return { isSuccess: false, error: error.message };
    }
  },

  updateVehicleStatus: async (vehicleId, isActive) => {
    try {
      const response = await axios.patch(`${BASE_URL}/Vehicle/UpdateStatus/${vehicleId}`, {
        isActive: isActive
      });
      return response.data;
    } catch (error) {
      console.error('Vehicle Status API hatası:', error);
      return { isSuccess: false, error: error.message };
    }
  },

  getEstatesBySeller: async (sellerId) => {
    try {
      console.log('Satıcı ID:', sellerId);
      const response = await axios.get(`${BASE_URL}/Estate/GetBySeller/${sellerId}`);
      console.log('Emlak API Yanıtı:', response.data);
      return {
        isSuccess: response.data.isSuccess,
        result: response.data.result || [],
        error: response.data.errorMessages?.join(', ')
      };
    } catch (error) {
      console.error('Emlak API Hatası:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
      return { 
        isSuccess: false, 
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      };
    }
  },
};

export default api; 