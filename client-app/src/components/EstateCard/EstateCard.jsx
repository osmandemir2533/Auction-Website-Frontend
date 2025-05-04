import React from 'react';
import './EstateCard.css';

const EstateCard = ({ estate }) => {
  if (!estate) {
    return <div className="estate-card error">Emlak bilgisi bulunamadı.</div>;
  }

  const {
    estateId,
    title,
    address,
    description,
    roomCount,
    squareMeters,
    price,
    image,
    isActive,
    startTime,
    endTime
  } = estate;

  // Calculate remaining days
  const calculateRemainingDays = () => {
    if (!endTime) return null;
    const end = new Date(endTime);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateRemainingDays();

  return (
    <div className="estate-card">
      <div className="estate-image">
        <img 
          src={image} 
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <div className="estate-info">
        <h3>{title || "İsimsiz Emlak"}</h3>
        <p className="estate-address">{address || "Adres bilgisi yok"}</p>
        <p className="estate-rooms">Oda Sayısı: {roomCount || "Belirtilmemiş"}</p>
        <p className="estate-size">Metrekare: {squareMeters || "Belirtilmemiş"}m²</p>
        <p className="estate-description">{description || "Açıklama yok"}</p>
        
        <div className="price-info">
          <p className="estate-price">Fiyat: {price?.toLocaleString('tr-TR') || "Belirtilmemiş"} TL</p>
        </div>

        {daysRemaining !== null && (
          <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
        )}

        <div className="estate-status">
          <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Aktif' : 'Pasif'}
          </span>
        </div>

        <div className="button-container">
          <div 
            className="bid-button"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/estate/${estate.estateId}`;
            }}
          >
            Teklif Ver
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateCard; 