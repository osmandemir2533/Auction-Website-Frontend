import React, { useState } from 'react';
import vehicleApi from '../../services/vehicleApi';
import { showSuccessToast, showErrorToast } from '../../Helpers/Toaster';

function CreateBid({ vehicleId }) {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateBid = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const userData = JSON.parse(atob(token.split('.')[1]));
      const bidData = {
        bidAmount: parseInt(bidAmount),
        userId: userData.nameid,
        vehicleId: vehicleId,
        bidDate: new Date().toISOString(),
        bidStatus: 'Active'
      };

      const response = await vehicleApi.createBid(bidData);
      
      if (response.isSuccess) {
        showSuccessToast('Teklifiniz başarıyla oluşturuldu');
        setBidAmount('');
        // Sayfayı yenile
        window.location.reload();
      } else {
        showErrorToast(response.errorMessages[0]);
      }
    } catch (error) {
      console.error('Teklif oluşturulurken hata:', error);
      showErrorToast('Teklif oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form>
        <div className="form-group">
          <label htmlFor="bidAmount">Teklif Tutarı:</label>
          <input
            type="number"
            className="form-control"
            id="bidAmount"
            name="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min="0"
            required
          />
        </div>
        <div className="text-center mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateBid}
            disabled={loading || !bidAmount}
          >
            {loading ? 'Teklif Veriliyor...' : 'Teklif Ver'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBid;