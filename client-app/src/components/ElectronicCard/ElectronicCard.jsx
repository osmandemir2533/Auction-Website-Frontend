import React from 'react';
import { Link } from 'react-router-dom';
import './ElectronicCard.css';
import api from '../../services/api';

const ElectronicCard = ({ electronic }) => {
  if (!electronic) {
    return <div className="electronic-card error">Ürün bilgisi bulunamadı.</div>;
  }

  const {
    electronicId,
    brand = "Bilinmeyen",
    model = "Model",
    manufacturingYear,
    price = 0,
    auctionPrice = 0,
    endTime,
    startTime,
    image,
  } = electronic;

  console.log("ElectronicCard - Gelen veri:", JSON.stringify(electronic, null, 2));
  console.log("Model ismi:", model);
  console.log("Brand:", brand);

  // Kalan gün hesaplama (Geçmiş tarihlerde hata olmaması için koruma)
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <div className="electronic-card">
      <img 
        src={image || "https://via.placeholder.com/300x200?text=Resim+Yok"} 
        alt={`${brand} ${model}`} 
        className="electronic-image" 
      />
      <div className="electronic-info">
        {/* Brand ve model ismi */}
        <h3>{`${brand} ${model}`}</h3>
        
        <div className="price-info">
          <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
          <p>Müzayede Başlangıç Fiyatı: {auctionPrice.toLocaleString()} TL</p>
        </div>

        <div className="time-info">
          {startTime && (
            <p className="start-time">
              Başlangıç: {new Date(startTime).toLocaleString('tr-TR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
          {endTime && (
            <p className="end-time">
              Bitiş: {new Date(endTime).toLocaleString('tr-TR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
          {daysRemaining !== null && (
            <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
          )}
        </div>

        <Link to={`/electronic/${electronicId}`} className="bid-button">
          Teklif Ver
        </Link>
      </div>
    </div>
  );
};

export default ElectronicCard;
