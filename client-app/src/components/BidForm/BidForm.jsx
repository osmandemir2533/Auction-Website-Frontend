import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './BidForm.css';

const BidForm = ({ itemId, currentPrice, itemType }) => {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Teklif vermek için giriş yapmalısınız');
      return;
    }

    const amount = parseInt(bidAmount);
    if (amount <= currentPrice) {
      setError('Teklif mevcut fiyattan yüksek olmalıdır');
      return;
    }

    try {
      const bid = {
        itemId,
        userId: user.nameid,
        bidAmount: amount,
        bidDate: new Date().toISOString(),
        itemType
      };

      await api.placeBid(itemId, amount, itemType);
      
      // Update the item's price based on type
      switch (itemType) {
        case 'Vehicle':
          await api.updateVehiclePrice(itemId, amount);
          break;
        case 'Dress':
          await api.updateDressPrice(itemId, amount);
          break;
        case 'Electronic':
          await api.updateElectronicPrice(itemId, amount);
          break;
        case 'Estate':
          await api.updateEstatePrice(itemId, amount);
          break;
        case 'Music':
          await api.updateMusicPrice(itemId, amount);
          break;
        default:
          console.error('Unknown item type:', itemType);
      }
      
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