import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BidForm from '../BidForm/BidForm';
import api from '../../services/api';
import './MusicDetail.css';
import Container from '../Container/Container';

const MusicDetail = () => {
  const { id } = useParams();  // URL'den id parametresini al
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const data = await api.getInstrumentDetail(id); // API'den enstrüman detayını al
        setInstrument(data.result);
      } catch (error) {
        console.error('Enstrüman detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstrument();
  }, [id]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!instrument) {
    return <div className="error">Enstrüman bulunamadı</div>;
  }

  const {
    name = "Bilinmeyen Enstrüman",
    brand = "Bilinmiyor",
    description = "Açıklama bulunmuyor",
    price = 0,
    auctionPrice = 0,
    endTime,
    startTime,
    image,
  } = instrument;

  // Kalan süre hesaplama
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <Container>
      <div className="music-detail">
        <div className="music-detail-content">
          {/* Görsel Üstte */}
          <div className="music-image">
            <img 
              src={image?.startsWith('http') 
                ? image 
                : image?.startsWith('data:image')
                  ? image
                  : image 
                    ? `https://localhost:7282/Images/${image}`
                    : "https://via.placeholder.com/600x400?text=Resim+Yok"} 
              alt={name} 
              className="music-detail-image" 
            />
          </div>

          {/* Diğer Bilgiler Altında */}
          <div className="music-info-detail">
            <h1>{name}</h1>
            <p className="brand">Marka: {brand}</p>
            <p className="description">{description}</p>

            <div className="price-details">
              <p>Fiyat: {price.toLocaleString()} TL</p>
              <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
            </div>

            {daysRemaining !== null && (
              <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
            )}

            <div className="auction-dates">
              <p>Başlangıç Tarihi: {new Date(startTime).toLocaleString()}</p>
              <p>Bitiş Tarihi: {new Date(endTime).toLocaleString()}</p>
            </div>

            <BidForm itemId={id} currentPrice={price} itemType="Music" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MusicDetail;
