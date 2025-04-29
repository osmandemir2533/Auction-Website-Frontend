import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BidForm from '../BidForm/BidForm';
import api from '../../services/api';
import './ElectronicDetail.css';
import Container from '../Container/Container';

const ElectronicDetail = () => {
  const { id } = useParams();
  const [electronic, setElectronic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectronic = async () => {
      try {
        const data = await api.getElectronicById(id);
        if (data.isSuccess) {
          setElectronic(data.result);
        } else {
          console.error('Ürün yüklenirken hata:', data.error);
          setElectronic(null);
        }
      } catch (error) {
        console.error('Ürün detayları yüklenirken hata oluştu:', error);
        setElectronic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchElectronic();
  }, [id]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!electronic) {
    return <div className="error">Ürün bulunamadı</div>;
  }

  const {
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
    technicalSpecs = {}
  } = electronic;

  // Kalan süre hesaplama
  let daysRemaining = null;
  if (endTime) {
    const timeRemaining = new Date(endTime) - new Date();
    daysRemaining = timeRemaining > 0 ? Math.floor(timeRemaining / (1000 * 60 * 60 * 24)) : 0;
  }

  return (
    <Container>
      <div className="electronic-detail">
        <div className="electronic-detail-content">
          <div className="electronic-images">
            <img 
              src={image || "https://via.placeholder.com/600x400?text=Resim+Yok"} 
              alt={`${brand} ${modelismi}`} 
            />
          </div>
          <div className="electronic-info-detail">
            <h1>{`${brand} ${modelismi}`}</h1>
            <p className="year">Üretim Yılı: {manufacturingYear || "Bilinmiyor"}</p>
            <p className="condition">Durum: {condition}</p>
            <p className="category">Kategori: {category}</p>
            <p className="warranty">Garanti: {warranty ? "Var" : "Yok"}</p>
            <p className="serial">Seri No: {serialNumber}</p>

            {Object.keys(technicalSpecs).length > 0 && (
              <div className="technical-specs">
                <h3>Teknik Özellikler</h3>
                {Object.entries(technicalSpecs).map(([key, value]) => (
                  <p key={key}>{key}: {value}</p>
                ))}
              </div>
            )}

            <p className="description">{additionalInformation}</p>

            <div className="price-details">
              <p>Satış Fiyatı: {price.toLocaleString()} TL</p>
              <p>Müzayede Başlangıç: {auctionPrice.toLocaleString()} TL</p>
            </div>

            {daysRemaining !== null && (
              <p className="time-remaining">Kalan Süre: {daysRemaining} gün</p>
            )}

            <BidForm electronicId={id} currentPrice={price} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ElectronicDetail;
