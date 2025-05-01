import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BidForm from '../BidForm/BidForm';
import api from '../../services/api';
import './VehicleDetail.css';
import Container from '../Container/Container';

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await api.getVehicleById(id);
        setVehicle(data.result);
      } catch (error) {
        console.error('Araç detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!vehicle) {
    return <div className="error">Araç bulunamadı</div>;
  }

  const {
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

  // Kalan süre hesaplama
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <Container>
      <div className="vehicle-detail">
        <div className="vehicle-detail-content">
          <div className="vehicle-images">
            <img 
              src={image?.startsWith('http') 
                ? image 
                : image?.startsWith('data:image')
                  ? image
                  : image 
                    ? `https://localhost:7282/Images/${image}`
                    : "https://via.placeholder.com/600x400?text=Resim+Yok"} 
              alt={brandAndModel} 
            />
          </div>
          <div className="vehicle-info-detail">
            <h1>{brandAndModel}</h1>
            <p className="year">Model Yılı: {manufacturingYear || "Bilinmiyor"}</p>
            <p className="color">Renk: {color}</p>
            <p className="engine">Motor Hacmi: {engineCapacity} L</p>
            <p className="millage">Kilometre: {millage.toLocaleString()} km</p>
            <p className="plate">Plaka: {plateNumber}</p>
            <p className="description">{additionalInformation}</p>

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

            <BidForm vehicleId={id} currentPrice={price} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VehicleDetail;
