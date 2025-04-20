import React from 'react';
import { Link } from 'react-router-dom';
import './DressCard.css';

const DressCard = ({ dress }) => {
  if (!dress) {
    return <div className="dress-card error">Elbise bilgisi bulunamadı.</div>;
  }

  const {
    dressId,
    brand,
    type,
    color,
    size,
    material,
    price = 0,
    auctionPrice = 0,
    additionalInformation = "Ek bilgi bulunmuyor",
    endTime,
    startTime,
    image,
  } = dress;

  const isAuctionActive = endTime && new Date(endTime) > new Date();

  return (
    <Link to={`/dress/${dressId}`} className="dress-card">
      <div className="dress-image">
        <img 
          src={image || "https://via.placeholder.com/300x200?text=Resim+Yok"} 
          alt={`${brand} ${type}`}
        />
        {isAuctionActive && <span className="auction-badge">Açık Artırma Aktif</span>}
      </div>
      <div className="dress-info">
        <h3>{brand} - {type}</h3>
        <p className="dress-color">Renk: {color}</p>
        <p className="dress-size">Beden: {size}</p>
        <p className="dress-material">Materyal: {material}</p>
        <p className="dress-description">{additionalInformation}</p>
        
        <div className="price-info">
          <p className="price">Satış Fiyatı: {price.toLocaleString()} TL</p>
          {isAuctionActive && (
            <p className="auction-price">Güncel Teklif: {auctionPrice.toLocaleString()} TL</p>
          )}
        </div>

        {endTime && (
          <p className="time-remaining">
            Kalan Süre: {Math.max(0, Math.floor((new Date(endTime) - new Date()) / (1000 * 60 * 60 * 24)))} gün
          </p>
        )}
      </div>
    </Link>
  );
};

export default DressCard; 