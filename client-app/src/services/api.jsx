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
  },

  // Dress endpoints
  getDresses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Dress/GetDresses`);
      return { isSuccess: true, result: response.data };
    } catch (error) {
      console.error('Dress API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
    }
  },

  addDress: async (dressData) => {
    try {
      const response = await fetch(`${BASE_URL}/Dress/AddDress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dressData),
      });
      const data = await response.json();
      return { isSuccess: true, result: data };
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateDress: async (id, dressData) => {
    try {
      const response = await fetch(`${BASE_URL}/Dress/UpdateDress/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dressData),
      });
      const data = await response.json();
      return { isSuccess: true, result: data };
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteDress: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/Dress/DeleteDress/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return { isSuccess: true, result: data };
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  // Musical Instrument endpoints
  getInstruments: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/MusicalInstrument/GetInstruments`);
      return response.data;
    } catch (error) {
      console.error('Musical Instrument API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
    }
  },

  addInstrument: async (instrumentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/MusicalInstrument/AddInstrument`, instrumentData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  updateInstrument: async (id, instrumentData) => {
    try {
      const response = await axios.put(`${BASE_URL}/MusicalInstrument/UpdateInstrument/${id}`, instrumentData);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  deleteInstrument: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/MusicalInstrument/DeleteInstrument/${id}`);
      return response.data;
    } catch (error) {
      return { isSuccess: false, error: error.message };
    }
  },

  // Electronic endpoints
  getElectronics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Electronic/GetElectronics`);
      return response.data;
    } catch (error) {
      console.error('Electronic API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
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

  // Estate endpoints
  getEstates: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Estate/GetEstates`);
      return response.data;
    } catch (error) {
      console.error('Estate API hatası:', error);
      return { isSuccess: false, error: error.message, result: [] };
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

  createVehicle: async (vehicleData) => {
    try {
      console.log('API çağrısı yapılıyor:', `${BASE_URL}/Vehicle/CreateVehicle`);
      console.log('Gönderilen veri:', JSON.stringify(vehicleData, null, 2));
      
      // Veri doğrulama
      const requiredFields = {
        File: 'Araç resmi',
        Color: 'Renk',
        Image: 'Resim URL',
        SellerId: 'Satıcı ID',
        PlateNumber: 'Plaka',
        BrandAndModel: 'Marka ve Model',
        AdditionalInformation: 'Ek Bilgiler'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !vehicleData[field]?.trim())
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Eksik alanlar: ${missingFields.join(', ')}`);
      }

      const response = await axios.post(`${BASE_URL}/Vehicle/CreateVehicle`, vehicleData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('API yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('API hatası:', error);
      if (error.response) {
        console.error('Hata durumu:', error.response.status);
        console.error('Hata detayı:', error.response.data);
        
        if (error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          console.error('Detaylı hata mesajları:', errorMessages);
          throw new Error(errorMessages);
        }
      }
      throw error;
    }
  },
};

export default api;
