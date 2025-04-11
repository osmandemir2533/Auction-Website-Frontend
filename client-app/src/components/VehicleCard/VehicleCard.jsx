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

  // Kalan gün hesaplama (Geçmiş tarihlerde hata olmaması için koruma)
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <div className="vehicle-card">
      <img 
        src={image || "https://via.placeholder.com/300x200?text=Resim+Yok"} 
        alt={brandAndModel} 
        className="vehicle-image" 
      />
      <div className="vehicle-info">
        <h3>{brandAndModel}</h3>
        <p className="vehicle-year">Model Yılı: {manufacturingYear || "Bilinmiyor"}</p>
        <p className="vehicle-color">Renk: {color}</p>
        <p className="vehicle-engine">Motor Hacmi: {engineCapacity} L</p>
        <p className="vehicle-millage">Kilometre: {millage.toLocaleString()} km</p>
        <p className="vehicle-plate">Plaka: {plateNumber}</p>
        <p className="vehicle-description">{additionalInformation}</p>
        
        <div className="price-info">
          <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
          <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
        </div>

        {daysRemaining !== null && (
          <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
        )}

        <Link to={`/vehicle/${vehicleId}`} className="bid-button">
          Teklif Ver
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
