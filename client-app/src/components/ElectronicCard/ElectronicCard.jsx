import React from 'react';
import { Link } from 'react-router-dom';
import './ElectronicCard.css';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const ElectronicCard = ({ electronic }) => {
  if (!electronic) {
    console.error('ElectronicCard: electronic prop is undefined or null');
    return null;
  }

  const {
    electronicId,
    brand,
    model,
    manufacturingYear,
    currentPrice,
    startingPrice,
    description,
    imageUrl,
    status,
    features = [],
    endDate
  } = electronic;

  if (!electronicId || !brand || !model) {
    console.error('ElectronicCard: Missing required fields', {
      electronicId,
      brand,
      model,
      fullData: electronic
    });
    return null;
  }

  const price = currentPrice || startingPrice || 0;
  const isActive = status === 'Active';

  const calculateTimeRemaining = () => {
    if (!endDate) return 'Süre belirtilmemiş';
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'Süre doldu';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}g ${hours}s ${minutes}d`;
  };

  return (
    <div className="electronic-card">
      <div className="electronic-image">
        <img 
          src={imageUrl || '/images/placeholder.jpg'} 
          alt={`${brand} ${model}`} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <div className="electronic-info">
        <h3>{brand} {model}</h3>
        <p className="electronic-brand">{brand}</p>
        <p className="electronic-model">Model: {model}</p>
        <p className="electronic-year">Üretim Yılı: {manufacturingYear || 'Belirtilmemiş'}</p>
        
        <div className="price-info">
          <p className="electronic-price">{price.toLocaleString('tr-TR')} TL</p>
        </div>

        <p className="time-remaining">Kalan Süre: {calculateTimeRemaining()}</p>

        <div className="electronic-status">
          <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Aktif' : 'Pasif'}
          </span>
        </div>

        {features.length > 0 && (
          <div className="features-list">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        )}

        <p className="electronic-description">
          {description || 'Açıklama bulunmuyor'}
        </p>

        <Link to={`/electronics/${electronicId}`} className="bid-button">
          Detayları Gör
        </Link>
      </div>
    </div>
  );
};

export default ElectronicCard; 