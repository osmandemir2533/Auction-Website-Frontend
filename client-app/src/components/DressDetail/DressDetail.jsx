import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import BidForm from '../BidForm/BidForm';
import './DressDetail.css';

const DressDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!dress) return <div className="error">Elbise bulunamadı</div>;

  const {
    brand = "Bilinmeyen",
    type = "Bilinmeyen",
    color = "Bilinmeyen",
    size = "Bilinmeyen",
    material = "Bilinmeyen",
    price = 0,
    auctionPrice = 0,
    additionalInformation = "Ek bilgi bulunmuyor",
    endTime,
    startTime,
    imageUrl,
  } = dress;

  // Kalan süre hesaplama
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <div className="dress-detail">
      <div className="dress-detail-container">
        <div className="dress-image">
          <img 
            src={imageUrl || "https://via.placeholder.com/400x600?text=Resim+Yok"} 
            alt={`${brand} ${type}`} 
          />
        </div>
        <div className="dress-info">
          <h2>{brand} - {type}</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Renk</span>
              <span className="value">{color}</span>
            </div>
            <div className="info-item">
              <span className="label">Beden</span>
              <span className="value">{size}</span>
            </div>
            <div className="info-item">
              <span className="label">Materyal</span>
              <span className="value">{material}</span>
            </div>
            <div className="info-item">
              <span className="label">Açıklama</span>
              <span className="value">{additionalInformation}</span>
            </div>
          </div>

          <div className="price-info">
            <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
            <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
          </div>

          {daysRemaining !== null && (
            <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
          )}

          <div className="auction-dates">
            <p>Başlangıç Tarihi: {new Date(startTime).toLocaleString()}</p>
            <p>Bitiş Tarihi: {new Date(endTime).toLocaleString()}</p>
          </div>

          <BidForm itemId={id} currentPrice={price} itemType="Dress" />
        </div>
      </div>
    </div>
  );
};

export default DressDetail; 