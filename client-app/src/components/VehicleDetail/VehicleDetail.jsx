import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import vehicleApi from '../../services/vehicleApi';
import './VehicleDetail.css';
import BidsDetail from '../Bid/BidsDetail';
import Loader from '../../Helpers/Loader';

function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highBid, setHighBid] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await vehicleApi.getVehicleById(id);
        setVehicle(data.result);
        
        // En yüksek teklifi bul
        if (data.result.bids && data.result.bids.length > 0) {
          const sortedBids = [...data.result.bids].sort((a, b) => b.bidAmount - a.bidAmount);
          setHighBid(sortedBids[0].bidAmount);
        }
      } catch (error) {
        console.error('Araç detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <Loader size="large" />;
  }

  if (!vehicle) {
    return <div className="error">Araç bulunamadı</div>;
  }

  return (
    <div className="vehicle-detail">
      <div className="vehicle-detail-content">
        <div className="vehicle-images">
          <img 
            src={vehicle.image?.startsWith('http') 
              ? vehicle.image 
              : vehicle.image?.startsWith('data:image')
                ? vehicle.image
                : vehicle.image 
                  ? `https://localhost:7282/Images/${vehicle.image}`
                  : "https://via.placeholder.com/600x400?text=Resim+Yok"} 
            alt={vehicle.brandAndModel} 
          />
        </div>
        <div className="vehicle-info-detail">
          <h1>{vehicle.brandAndModel}</h1>
          <p className="year">Model Yılı: {vehicle.manufacturingYear || "Bilinmiyor"}</p>
          <p className="color">Renk: {vehicle.color}</p>
          <p className="engine">Motor Hacmi: {vehicle.engineCapacity} L</p>
          <p className="millage">Kilometre: {vehicle.millage?.toLocaleString()} km</p>
          <p className="plate">Plaka: {vehicle.plateNumber}</p>
          <p className="description">{vehicle.additionalInformation}</p>

          <div className="price-details">
            <p>Satış Fiyatı: {vehicle.price?.toLocaleString()} TL</p>
            <p>En Yüksek Teklif: {highBid?.toLocaleString()} TL</p>
          </div>

          {vehicle.endTime && (
            <p className="time-remaining">
              Kalan Süre: {Math.floor((new Date(vehicle.endTime) - new Date()) / (1000 * 60 * 60 * 24))} gün
            </p>
          )}

          <div className="auction-dates">
            <p>Başlangıç Tarihi: {new Date(vehicle.startTime).toLocaleString()}</p>
            <p>Bitiş Tarihi: {new Date(vehicle.endTime).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <BidsDetail vehicleId={id} />
    </div>
  );
}

export default VehicleDetail;