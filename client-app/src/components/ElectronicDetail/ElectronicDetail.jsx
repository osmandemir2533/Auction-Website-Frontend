import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './ElectronicDetail.css';

const ElectronicDetail = () => {
  const { id } = useParams();
  const [electronic, setElectronic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchElectronic();
  }, [id]);

  const fetchElectronic = async () => {
    try {
      setLoading(true);
      const response = await api.getElectronicById(id);
      if (response.isSuccess) {
        setElectronic(response.result);
      } else {
        setError('Elektronik ürün bulunamadı.');
      }
    } catch (err) {
      setError('Elektronik ürün yüklenirken bir hata oluştu.');
      console.error('Error fetching electronic:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!electronic) {
    return <div className="not-found">Elektronik ürün bulunamadı.</div>;
  }

  return (
    <div className="electronic-detail">
      <div className="electronic-image">
        <img src={electronic.image} alt={`${electronic.brand} ${electronic.model}`} />
      </div>
      <div className="electronic-info">
        <h1>{electronic.brand} {electronic.model}</h1>
        <p className="year">Üretim Yılı: {electronic.manufacturingYear}</p>
        <p className="price">{electronic.price.toLocaleString('tr-TR')} TL</p>
        <div className="features">
          <h3>Özellikler</h3>
          <ul>
            {electronic.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <p className="description">{electronic.description}</p>
        <div className="auction-info">
          <p>Bitiş Tarihi: {new Date(electronic.endDate).toLocaleString('tr-TR')}</p>
          <p>Durum: {electronic.status === 'active' ? 'Aktif' : 'Pasif'}</p>
        </div>
      </div>
    </div>
  );
};

export default ElectronicDetail; 