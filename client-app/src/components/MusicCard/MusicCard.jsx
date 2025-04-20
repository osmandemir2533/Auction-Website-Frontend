import React from 'react';
import { Link } from 'react-router-dom';
import './MusicCard.css';

const MusicCard = ({ instrument }) => {
  if (!instrument) {
    return <div className="music-card error">Müzik aleti bulunamadı.</div>;
  }

  const {
    musicalInstrumentId,
    name,
    brand,
    description,
    auctionPrice,
    price,
    startTime,
    endTime,
    image,
  } = instrument;

  // Kalan gün hesaplama (Geçmiş tarihlerde hata olmaması için koruma)
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <div className="music-card">
      {/* Resim alanı */}
      <div className="music-image-container">
        <img
          src={image || "https://via.placeholder.com/300x200?text=Resim+Yok"}
          alt={name}
          className="music-image"
        />
      </div>
      {/* Müzik aleti bilgileri */}
      <div className="music-info">
        <h3>{name}</h3>
        <p className="music-brand">Marka: {brand}</p>
        <p className="music-description">{description || 'Açıklama bulunmamaktadır.'}</p>
        
        {/* Fiyat ve müzayede bilgileri */}
        <div className="price-info">
          <p className="music-price">Satış Fiyatı: {price.toLocaleString()} TL</p>
          <p className="music-auction-price">Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
        </div>
        
        {/* Kalan süre */}
        {daysRemaining !== null && (
          <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
        )}
        
        {/* Teklif ver butonu */}
        <div className="button-container">
          <Link to={`/music/${musicalInstrumentId}`} className="bid-button">
            Teklif Ver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
