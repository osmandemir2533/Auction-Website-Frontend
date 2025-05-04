import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { api } from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SellerCreateMusicalInstrument from './SellerCreateMusicalInstrument';
import './SellerMusicalInstruments.css';

const SellerMusicalInstruments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState(null);

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      setLoading(true);
      const response = await api.getMusicalInstruments();
      if (response.isSuccess) {
        // Sadece giriş yapan satıcının ürünlerini filtrele
        const sellerInstruments = response.result.filter(instrument => 
          String(instrument.sellerId) === String(user.nameid)
        ).map(instrument => {
          // Resim URL'sini oluştur
          let imageUrl = '';
          if (instrument.image) {
            if (instrument.image.startsWith('http')) {
              // Tam URL zaten verilmişse
              imageUrl = instrument.image;
            } else if (instrument.image.startsWith('data:image')) {
              // Base64 formatındaysa
              imageUrl = instrument.image;
            } else {
              // Dosya adı verilmişse
              imageUrl = `https://localhost:7282/Images/${instrument.image}`;
            }
          }

          return {
            ...instrument,
            image: imageUrl
          };
        });
        setInstruments(sellerInstruments);
      } else {
        setError('Müzik aletleri yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu müzik aletini silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        const response = await api.deleteMusicalInstrument(id);
        if (response.isSuccess) {
          await fetchInstruments();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (instrument) => {
    setEditingInstrument(instrument);
    setIsAdding(true);
  };

  const handleFormSubmit = async () => {
    await fetchInstruments();
    setIsAdding(false);
    setEditingInstrument(null);
  };

  if (loading && !instruments.length) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="instruments-container">
      <div className="instruments-header">
        <h2>Müzik Aletleri Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          Yeni Müzik Aleti Ekle
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAdding && (
        <SellerCreateMusicalInstrument
          instrument={editingInstrument}
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingInstrument(null);
          }}
        />
      )}

      <div className="instruments-list">
        {instruments.map(instrument => (
          <div key={instrument.musicalInstrumentId} className="instrument-card" onClick={() => navigate(`/music/${instrument.musicalInstrumentId}`)}>
            <div className="instrument-image">
              <img src={instrument.image} alt={instrument.name} />
            </div>
            <div className="instrument-info">
              <h3>{instrument.name}</h3>
              <p>Marka: {instrument.brand}</p>
              <p>Açıklama: {instrument.description}</p>
              <p>Açık Artırma Fiyatı: {instrument.auctionPrice} TL</p>
              <p>Satış Fiyatı: {instrument.price} TL</p>
              <p>Başlangıç: {new Date(instrument.startTime).toLocaleString('tr-TR')}</p>
              <p>Bitiş: {new Date(instrument.endTime).toLocaleString('tr-TR')}</p>
              <p>Durum: {instrument.status === 'active' ? 'Aktif' : 'Pasif'}</p>
            </div>
            <div className="instrument-actions">
              <button 
                className="edit-button"
                onClick={(e) => { e.stopPropagation(); handleEdit(instrument); }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={(e) => { e.stopPropagation(); handleDelete(instrument.musicalInstrumentId); }}
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

export default SellerMusicalInstruments; 