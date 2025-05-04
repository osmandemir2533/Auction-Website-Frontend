import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SellerCreateEstate from './SellerCreateEstate';
import './SellerEstates.css';

const SellerEstates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingEstate, setEditingEstate] = useState(null);

  useEffect(() => {
    fetchEstates();
  }, []);

  const fetchEstates = async () => {
    try {
      setLoading(true);
      const response = await api.getEstates();
      if (response.isSuccess) {
        const sellerEstates = response.result
          .filter(estate => String(estate.sellerId) === String(user.nameid))
          .map(estate => {
            // Resim URL'sini oluştur
            let imageUrl = '';
            if (estate.image) {
              if (estate.image.startsWith('http')) {
                // Tam URL zaten verilmişse
                imageUrl = estate.image;
              } else if (estate.image.startsWith('data:image')) {
                // Base64 formatındaysa
                imageUrl = estate.image;
              } else {
                // Dosya adı verilmişse
                imageUrl = `https://localhost:7282/Images/${estate.image}`;
              }
            }

            return {
              ...estate,
              image: imageUrl
            };
          });
        setEstates(sellerEstates);
      } else {
        setError('Emlak ilanları yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        const response = await api.deleteEstate(id);
        if (response.isSuccess) {
          await fetchEstates();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (estate) => {
    setEditingEstate(estate);
    setIsAdding(true);
  };

  const handleFormSubmit = async () => {
    await fetchEstates();
    setIsAdding(false);
    setEditingEstate(null);
  };

  if (loading && !estates.length) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="estate-container">
      <div className="estate-header">
        <h2>Emlak İlanları Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          Yeni İlan Ekle
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAdding && (
        <SellerCreateEstate
          estate={editingEstate}
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingEstate(null);
          }}
        />
      )}

      <div className="estate-list">
        {estates.map(estate => (
          <div key={estate.estateId} className="estate-card" onClick={() => navigate(`/estate/${estate.estateId}`)}>
            <div className="estate-image">
              <img src={estate.image} alt={estate.title} />
            </div>
            <div className="estate-info">
              <h3>{estate.title}</h3>
              <p>Adres: {estate.address}</p>
              <p>Açıklama: {estate.description}</p>
              <p>Oda Sayısı: {estate.roomCount}</p>
              <p>Metrekare: {estate.squareMeters}</p>
              <p>Fiyat: {estate.price} TL</p>
              <p>Açık Artırma Fiyatı: {estate.auctionPrice} TL</p>
              <p>Başlangıç: {new Date(estate.startTime).toLocaleString('tr-TR')}</p>
              <p>Bitiş: {new Date(estate.endTime).toLocaleString('tr-TR')}</p>
              <p>Durum: {estate.isActive ? 'Aktif' : 'Pasif'}</p>
            </div>
            <div className="estate-actions">
              <button 
                className="edit-button"
                onClick={(e) => { e.stopPropagation(); handleEdit(estate); }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={(e) => { e.stopPropagation(); handleDelete(estate.estateId); }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerEstates; 