import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './DressDetail.css';

const DressDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const fetchDressDetails = async () => {
      try {
        const response = await api.getDressById(id);
        if (response.isSuccess) {
          setDress(response.result);
        } else {
          setError('Elbise detayları yüklenirken bir hata oluştu');
        }
      } catch (err) {
        console.error('Hata oluştu:', err);
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDressDetails();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Teklif vermek için giriş yapmalısınız');
      return;
    }

    const bid = parseFloat(bidAmount);
    if (isNaN(bid) || bid <= dress.auctionPrice) {
      setError('Teklif mevcut tekliften yüksek olmalıdır');
      return;
    }

    try {
      const response = await api.placeBid(id, bid, 'Dress');
      if (response.isSuccess) {
        setDress(response.result);
        setBidAmount('');
        setError('');
      } else {
        setError(response.error || 'Teklif verme işlemi başarısız oldu');
      }
    } catch (err) {
      console.error('Hata oluştu:', err);
      setError('Bir hata oluştu');
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dress) return <div className="error">Elbise bulunamadı</div>;

  return (
    <div className="dress-detail">
      <div className="dress-detail-container">
        <div className="dress-image">
          <img 
            src={dress.image?.startsWith('http') 
              ? dress.image 
              : dress.image?.startsWith('data:image')
                ? dress.image
                : dress.image 
                  ? `https://localhost:7282/Images/${dress.image}`
                  : "https://via.placeholder.com/600x400?text=Resim+Yok"} 
            alt={dress.brand} 
          />
        </div>
        <div className="dress-info">
          <h2>{dress.brand} - {dress.type}</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Renk</span>
              <span className="value">{dress.color}</span>
            </div>
            <div className="info-item">
              <span className="label">Beden</span>
              <span className="value">{dress.size}</span>
            </div>
            <div className="info-item">
              <span className="label">Materyal</span>
              <span className="value">{dress.material}</span>
            </div>
            <div className="info-item">
              <span className="label">Fiyat</span>
              <span className="value">{dress.price} TL</span>
            </div>
            <div className="info-item">
              <span className="label">Güncel Teklif</span>
              <span className="value">{dress.auctionPrice} TL</span>
            </div>
            <div className="info-item">
              <span className="label">Başlangıç</span>
              <span className="value">{new Date(dress.startTime).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Bitiş</span>
              <span className="value">{new Date(dress.endTime).toLocaleString()}</span>
            </div>
          </div>
          {dress.isActive && (
            <form onSubmit={handleBidSubmit} className="bid-form">
              <div className="bid-input">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Teklifinizi girin"
                  min={dress.auctionPrice + 1}
                  step="0.01"
                  required
                />
                <button type="submit" className="bid-button">Teklif Ver</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DressDetail; 