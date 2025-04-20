import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './SellerInstrumentPanel.css';

const SellerInstrumentPanel = () => {
  const { user } = useAuth();
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    auctionPrice: 0,
    startTime: '',
    endTime: '',
    isActive: true,
    image: ''
  });

  useEffect(() => {
    const fetchSellerInstruments = async () => {
      try {
        const allInstrumentsResponse = await api.getMusicalInstruments();
        if (allInstrumentsResponse.isSuccess) {
          const sellerInstrumentIds = allInstrumentsResponse.result
            .filter(instrument => String(instrument.sellerId) === String(user.nameid))
            .map(instrument => instrument.musicalInstrumentId);

          if (sellerInstrumentIds.length === 0) {
            setInstruments([]);
            return;
          }

          const instrumentDetails = await Promise.all(
            sellerInstrumentIds.map(async (instrumentId) => {
              const instrumentResponse = await api.getInstrumentDetail(instrumentId);
              return instrumentResponse.isSuccess ? instrumentResponse.result : null;
            })
          );

          const validInstruments = instrumentDetails.filter(instrument => instrument !== null);
          setInstruments(validInstruments);
        } else {
          setError('Enstrümanlar yüklenirken bir hata oluştu');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.nameid) {
      fetchSellerInstruments();
    }
  }, [user.nameid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing) {
        response = await api.updateInstrument(editingInstrument.musicalInstrumentId, formData);
      } else {
        response = await api.addInstrument(formData);
      }

      if (response.isSuccess) {
        await fetchSellerInstruments();
        resetForm();
      } else {
        setError('İşlem başarısız oldu');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu enstrümanı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await api.deleteInstrument(id);
        if (response.isSuccess) {
          setInstruments(instruments.filter(instrument => instrument.musicalInstrumentId !== id));
        } else {
          setError('Enstrüman silinemedi');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      }
    }
  };

  const handleEdit = (instrument) => {
    setEditingInstrument(instrument);
    setFormData({
      name: instrument.name,
      brand: instrument.brand,
      description: instrument.description,
      price: instrument.price,
      auctionPrice: instrument.auctionPrice,
      startTime: instrument.startTime,
      endTime: instrument.endTime,
      isActive: instrument.isActive,
      image: instrument.image
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      auctionPrice: 0,
      startTime: '',
      endTime: '',
      isActive: true,
      image: ''
    });
    setIsEditing(false);
    setEditingInstrument(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seller-instrument-panel">
      <h2>İlan Verdiğim Enstrümanlar</h2>

      {(isEditing) && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enstrüman Adı</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Marka</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fiyat</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Başlangıç Tarihi</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime ? formData.startTime : ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Bitiş Tarihi</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime ? formData.endTime : ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Durum</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleInputChange}
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm}>İptal</button>
            <button type="submit">{isEditing ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </form>
      )}

      <div className="instrument-grid">
        {instruments.length > 0 ? (
          instruments.map(instrument => (
            <div key={instrument.musicalInstrumentId} className="instrument-card">
              <div className="instrument-image">
                <img src={instrument.image} alt={instrument.name} />
              </div>
              <div className="instrument-info">
                <h3>{instrument.name}</h3>
                <p>Marka: {instrument.brand}</p>
                <p>Açıklama: {instrument.description}</p>
                <p>Fiyat: {instrument.price}₺</p>
                <p>Başlangıç Fiyatı: {instrument.auctionPrice}₺</p>
                <p>Başlangıç: {new Date(instrument.startTime).toLocaleString()}</p>
                <p>Bitiş: {new Date(instrument.endTime).toLocaleString()}</p>
                <p>Durum: {instrument.isActive ? 'Aktif' : 'Pasif'}</p>
              </div>

              <div className="instrument-actions">
                <button onClick={() => handleEdit(instrument)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(instrument.musicalInstrumentId)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-instruments">Henüz hiç enstrüman ilanı vermediniz.</div>
        )}
      </div>
    </div>
  );
};

export default SellerInstrumentPanel;
