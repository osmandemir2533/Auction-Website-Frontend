import axios from 'axios';

const API_URL = 'https://localhost:7282/api';

const vehicleApi = {
  // Araç işlemleri
  getVehicleById: async (id) => {
    const response = await axios.get(`${API_URL}/Vehicle/${id}`);
    return response.data;
  },

  // Teklif işlemleri
  getBidsByVehicle: async (vehicleId) => {
    const response = await axios.get(`${API_URL}/Bid/GetBidsByVehicle/${vehicleId}`);
    return response.data;
  },

  createBid: async (bidData) => {
    const response = await axios.post(`${API_URL}/Bid/Create`, bidData);
    return response.data;
  },

  // Ödeme işlemleri
  doPayment: async (data) => {
    try {
      console.log('Ödeme isteği gönderiliyor:', {
        url: `${API_URL}/Payment/Pay`,
        params: {
          userId: data.userId,
          vehicleId: data.vehicleId
        }
      });

      const response = await axios.post(`${API_URL}/Payment/Pay`, null, {
        params: {
          userId: data.userId,
          vehicleId: data.vehicleId
        }
      });

      console.log('Ödeme yanıtı:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      // Backend'den gelen yanıtı doğrudan döndür
      return {
        success: true,
        clientSecret: response.data.clientSecret,
        id: response.data.id,
        amount: response.data.amount,
        status: response.data.status
      };

    } catch (error) {
      console.error('Ödeme başlatma hatası:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message || "Geçersiz ödeme isteği."
        };
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın."
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Araç bulunamadı."
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Ödeme başlatılırken bir hata oluştu."
      };
    }
  },

  processPayment: async (data) => {
    const response = await axios.post(`${API_URL}/Payment/ProcessPayment`, data);
    return response.data;
  },

  checkAuctionStatus: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/PaymentHistory/CheckStatus`, {
        userId: data.userId,
        vehicleId: data.vehicleId
      });
      return response.data;
    } catch (error) {
      console.error('Açık artırma durumu kontrol edilirken hata:', error);
      return { isSuccess: false, message: error.response?.data?.message || "Durum kontrol edilemedi." };
    }
  },

  createPaymentHistory: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/PaymentHistory/AddHistory`, {
        clientSecret: data.clientSecret,
        stripePaymentIntentId: data.stripePaymentIntentId,
        userId: data.userId,
        vehicleId: data.vehicleId
      });
      return response.data;
    } catch (error) {
      console.error('Ödeme geçmişi oluşturulurken hata:', error);
      return { success: false, message: error.response?.data?.message || "Ödeme geçmişi oluşturulamadı." };
    }
  }
};

export default vehicleApi; 