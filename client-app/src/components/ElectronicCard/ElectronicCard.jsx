import React from 'react';
import { Link } from 'react-router-dom';
import './ElectronicCard.css';

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
    additionalInformation = "Ek bilgi bulunmuyor",
    endTime,
    image,
  } = electronic;

  // Kalan gün hesaplama
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <Link to={`/electronic/${electronicId}`} className="electronic-card-link">
      <div className="electronic-card">
        <img 
          src={image || "https://via.placeholder.com/300x200?text=Resim+Yok"} 
          alt={`${brand} ${model}`} 
          className="electronic-image" 
        />
        <div className="electronic-info">
          <p className="electronic-brand">Marka: {brand}</p>
          <p>{additionalInformation}</p>
          <p>Üretim Yılı: {manufacturingYear}</p>
          <div className="price-info">
            <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
            <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
          </div>
          {daysRemaining !== null && (
            <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
          )}
          <div className="button-container">
            <div 
              className="bid-button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/electronic/${electronicId}`;
              }}
            >
              Teklif Ver
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ElectronicCard;
