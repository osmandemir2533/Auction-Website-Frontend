import React, { useState } from 'react';
import api from '../../services/api';
import './BidForm.css';

const BidForm = ({ vehicleId, currentPrice }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseInt(bidAmount);
    if (amount <= currentPrice) {
      setError('Teklif mevcut fiyattan yüksek olmalıdır');
      return;
    }

    try {
      const bid = {
        vehicleId,
        userId: 1, // Normalde auth sisteminden alınacak
        bidAmount: amount,
        bidDate: new Date().toISOString()
      };

      await api.placeBid(bid);
      await api.updateVehiclePrice(vehicleId, amount);
      
      setSuccess('Teklifiniz başarıyla verildi!');
      setBidAmount('');
    } catch (error) {
      setError('Teklif verilirken bir hata oluştu');
    }
  };

  return (
    <div className="bid-form">
      <h3>Teklif Ver</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Teklif Tutarı (TL)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min={currentPrice + 1}
            required
          />
        </div>
        <button type="submit" className="submit-bid">
          Teklif Ver
        </button>
      </form>
    </div>
  );
};

export default BidForm; 