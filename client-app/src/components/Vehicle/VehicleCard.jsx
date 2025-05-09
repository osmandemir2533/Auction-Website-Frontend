import React from 'react';
import { Link } from 'react-router-dom';
import './VehicleCard.css';

function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <div className="vehicle-image">
        <img 
          src={vehicle.image?.startsWith('http') 
            ? vehicle.image 
            : vehicle.image?.startsWith('data:image')
              ? vehicle.image
              : vehicle.image 
                ? `https://localhost:7282/Images/${vehicle.image}`
                : "https://via.placeholder.com/300x200?text=Resim+Yok"} 
          alt={vehicle.brandAndModel} 
        />
      </div>
      <div className="vehicle-info">
        <h3>{vehicle.brandAndModel}</h3>
        <p>Yıl: {vehicle.manufacturingYear || "Bilinmiyor"}</p>
        <p>Kilometre: {vehicle.millage?.toLocaleString()} km</p>
        <p>Fiyat: {vehicle.price?.toLocaleString()} TL</p>
        <Link to={`/vehicle/${vehicle.id}`} className="btn btn-primary">
          Detayları Gör
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard; 