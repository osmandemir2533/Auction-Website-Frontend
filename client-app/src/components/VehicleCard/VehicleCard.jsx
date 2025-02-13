import React from 'react';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

const VehicleCard = ({ vehicle }) => {
  const timeRemaining = new Date(vehicle.endDate) - new Date();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="vehicle-card">
      <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-image" />
      <div className="vehicle-info">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <p className="vehicle-year">{vehicle.year}</p>
        <p className="vehicle-description">{vehicle.description}</p>
        <div className="price-info">
          <p>Güncel Fiyat: {vehicle.currentPrice.toLocaleString()} TL</p>
          <p>Başlangıç: {vehicle.startingPrice.toLocaleString()} TL</p>
        </div>
        <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
        <Link to={`/vehicle/${vehicle.id}`} className="bid-button">
          Teklif Ver
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard; 