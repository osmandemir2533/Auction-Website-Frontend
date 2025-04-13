import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import './MusicalInstrument.css';

const MusicalInstrument = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    startTime: '',
    endTime: '',
    isActive: true,
    image: ''
  });

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getInstruments();
      
      if (response.isSuccess && response.result) {
        setInstruments(response.result);
      } else {
        setError('Müzik aletleri yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        await fetchInstruments();
        resetForm();
      } else {
        setError('İşlem başarısız oldu');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await api.deleteInstrument(id);
        if (response.isSuccess) {
          await fetchInstruments();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message);
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
      startTime: '',
      endTime: '',
      isActive: true,
      image: ''
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingInstrument(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="instrument-container">
      <div className="instrument-header">
        <h2>Müzik Aletleri Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus /> Yeni Ürün Ekle
        </button>
      </div>

      {(isAdding || isEditing) && (
        <form className="instrument-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>İsim</label>
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
            <div className="form-group full-width">
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
            <div className="form-group full-width">
              <label>Resim URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Başlangıç Tarihi</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Bitiş Tarihi</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
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
                required
              >
                <option value={true}>Aktif</option>
                <option value={false}>Pasif</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={resetForm}>
              <FaTimes /> İptal
            </button>
            <button type="submit" className="save-button">
              <FaSave /> {isEditing ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      )}

      <div className="instrument-list">
        {instruments && instruments.map(instrument => (
          <div key={instrument.musicalInstrumentId} className="instrument-card">
            <div className="instrument-image">
              <img src={instrument.image} alt={instrument.name} />
            </div>
            <div className="instrument-info">
              <h3>{instrument.name}</h3>
              <p>Marka: {instrument.brand}</p>
              <p>Fiyat: {instrument.price} TL</p>
              <p>Mevcut Teklif: {instrument.auctionPrice} TL</p>
              <p>Durum: {instrument.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>Başlangıç: {new Date(instrument.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(instrument.endTime).toLocaleString()}</p>
              <p>{instrument.description}</p>
            </div>
            <div className="instrument-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit(instrument)}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(instrument.musicalInstrumentId)}
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

export default MusicalInstrument; 