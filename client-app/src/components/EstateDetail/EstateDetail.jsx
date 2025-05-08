import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BidForm from '../BidForm/BidForm';
import api from '../../services/api';
import './EstateDetail.css';
import Container from '../Container/Container';

const EstateDetail = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getEstateById(id);
        if (response.isSuccess && response.result) {
          setEstate(response.result);
        } else {
          setError(response.error || 'Emlak bulunamadı');
        }
      } catch (error) {
        console.error('Emlak detayları yüklenirken hata oluştu:', error);
        setError('Emlak detayları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchEstate();
  }, [id]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!estate) {
    return <div className="error">Emlak bulunamadı</div>;
  }

  const {
    title = "Bilinmeyen Emlak",
    address = "Adres Bilinmiyor",
    description = "Açıklama Yok",
    roomCount,
    squareMeters,
    price = 0,
    auctionPrice = 0,
    endTime,
    startTime,
    image,
    type = "Bilinmeyen Tip",
    floor,
    heatingType = "Bilinmiyor",
    buildingAge,
    hasParking = false,
    hasGarden = false,
    hasPool = false,
    hasSecurity = false
  } = estate;

  // Kalan süre hesaplama
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <Container>
      <div className="estate-detail">
        <div className="estate-detail-content">
          <div className="estate-images">
            <img 
              src={image?.startsWith('http') 
                ? image 
                : image?.startsWith('data:image')
                  ? image
                  : image 
                    ? `https://localhost:7282/Images/${image}`
                    : "https://via.placeholder.com/600x400?text=Resim+Yok"} 
              alt={title} 
            />
          </div>
          <div className="estate-info-detail">
            <h1>{title}</h1>
            <p className="address">{address}</p>
            <p className="type">Emlak Tipi: {type}</p>
            <p className="rooms">Oda Sayısı: {roomCount}</p>
            <p className="size">Metrekare: {squareMeters}m²</p>
            {floor && <p className="floor">Kat: {floor}</p>}
            <p className="heating">Isıtma: {heatingType}</p>
            {buildingAge && <p className="age">Bina Yaşı: {buildingAge}</p>}
            <p className="description">{description}</p>

            <div className="features-section">
              <h3>Özellikler</h3>
              <div className="features-grid">
                {hasParking && <div className="feature-item">🚗 Otopark</div>}
                {hasGarden && <div className="feature-item">🌳 Bahçe</div>}
                {hasPool && <div className="feature-item">🏊‍♂️ Havuz</div>}
                {hasSecurity && <div className="feature-item">🔒 Güvenlik</div>}
              </div>
            </div>

            <div className="price-details">
              <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
              <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
            </div>

            {daysRemaining !== null && (
              <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
            )}

            <div className="auction-dates">
              <p>Başlangıç Tarihi: {new Date(startTime).toLocaleString()}</p>
              <p>Bitiş Tarihi: {new Date(endTime).toLocaleString()}</p>
            </div>

            <BidForm itemId={id} currentPrice={price} itemType="Estate" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EstateDetail; 