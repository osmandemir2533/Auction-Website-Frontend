import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './BidForm.css';

const BidForm = ({ itemId, currentPrice, itemType, auctionPrice }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);

  const handleParticipate = async () => {
    if (!user) {
      setError('Açık artırmaya katılmak için giriş yapmalısınız');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      // Burada auction price ödemesi için gerekli API çağrısı yapılacak
      // await api.payAuctionPrice(itemId, auctionPrice, itemType);
      setIsParticipating(true);
      setSuccess('Açık artırmaya başarıyla katıldınız!');
    } catch (error) {
      setError('Açık artırmaya katılırken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Teklif vermek için giriş yapmalısınız');
      return;
    }

    if (!isParticipating) {
      setError('Önce açık artırmaya katılmalısınız');
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
      <h3>Açık Artırmaya Katıl</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {!isParticipating ? (
        <div className="participation-section">
          <p className="auction-price-info">
            Açık artırmaya katılım ücreti: {currentPrice.toLocaleString()} TL
          </p>
          <button onClick={handleParticipate} className="participate-button">
            Açık Artırmaya Katıl
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default BidForm; 