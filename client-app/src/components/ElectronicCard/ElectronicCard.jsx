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
    modelismi = "Model",
    manufacturingYear,
    condition = "Durum Bilinmiyor",
    category,
    warranty,
    serialNumber = "Seri No Yok",
    price = 0,
    auctionPrice = 0,
    additionalInformation = "Ek bilgi bulunmuyor",
    endTime,
    startTime,
    image,
  } = electronic;

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
        alt={`${brand} ${modelismi}`} 
        className="electronic-image" 
      />
      <div className="electronic-info">
        <h3>{`${brand} ${modelismi}`}</h3>
        <p className="electronic-year">Üretim Yılı: {manufacturingYear || "Bilinmiyor"}</p>
        <p className="electronic-condition">Durum: {condition}</p>
        <p className="electronic-category">Kategori: {category}</p>
        <p className="electronic-warranty">Garanti: {warranty ? "Var" : "Yok"}</p>
        <p className="electronic-serial">Seri No: {serialNumber}</p>
        <p className="electronic-description">{additionalInformation}</p>
        
        <div className="price-info">
          <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
          <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
        </div>

        {daysRemaining !== null && (
          <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
        )}

        <Link to={`/electronic/${electronicId}`} className="bid-button">
          Teklif Ver
        </Link>
      </div>
    </div>
  );
};

export default ElectronicCard;
