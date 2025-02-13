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
        setVehicle(data);
        setLoading(false);
      } catch (error) {
        console.error('Araç detayları yüklenirken hata oluştu:', error);
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

  return (
    <Container>
      <div className="vehicle-detail">
        <div className="vehicle-detail-content">
          <div className="vehicle-images">
            <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} />
          </div>
          <div className="vehicle-info-detail">
            <h1>{vehicle.brand} {vehicle.model}</h1>
            <p className="year">{vehicle.year}</p>
            <p className="description">{vehicle.description}</p>
            <div className="price-details">
              <p>Başlangıç Fiyatı: {vehicle.startingPrice.toLocaleString()} TL</p>
              <p>Güncel Fiyat: {vehicle.currentPrice.toLocaleString()} TL</p>
            </div>
            <BidForm vehicleId={vehicle.id} currentPrice={vehicle.currentPrice} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VehicleDetail; 