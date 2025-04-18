import React from 'react';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  if (!vehicle) {
    return <div className="vehicle-card error">Araç bilgisi bulunamadı.</div>;
  }

  const {
    vehicleId,
    brandAndModel = "Bilinmeyen Araç",
    manufacturingYear,
    color = "Renk Bilinmiyor",
    engineCapacity,
    millage,
    plateNumber = "Plaka Yok",
    price = 0,
    auctionPrice = 0,
    additionalInformation = "Ek bilgi bulunmuyor",
    endTime,
    startTime,
    image,
  } = vehicle;

  const isAuctionActive = endTime && new Date(endTime) > new Date();

  return (
    <Link to={`/vehicles/${vehicleId}`} className="vehicle-card">
      <div className="vehicle-image">
        <img 
          src={image || "https://via.placeholder.com/300x200?text=Resim+Yok"} 
          alt={brandAndModel}
        />
        {isAuctionActive && <span className="auction-badge">Açık Artırma Aktif</span>}
      </div>
      <div className="vehicle-info">
        <h3>{brandAndModel}</h3>
        <p className="vehicle-year">Model Yılı: {manufacturingYear || "Bilinmiyor"}</p>
        <p className="vehicle-color">Renk: {color}</p>
        <p className="vehicle-engine">Motor Hacmi: {engineCapacity} L</p>
        <p className="vehicle-millage">Kilometre: {millage.toLocaleString()} km</p>
        <p className="vehicle-plate">Plaka: {plateNumber}</p>
        <p className="vehicle-description">{additionalInformation}</p>
        
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

export default VehicleCard;
