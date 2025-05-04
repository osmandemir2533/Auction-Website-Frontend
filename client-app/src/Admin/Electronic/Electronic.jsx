import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Electronic.css';

const Electronic = () => {
  const navigate = useNavigate();
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingElectronic, setEditingElectronic] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    manufacturingYear: '',
    price: '',
    additionalInformation: '',
    isActive: true,
    image: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchElectronics();
  }, []);

  const fetchElectronics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getElectronics();
      
      if (response.isSuccess && response.result) {
        setElectronics(response.result);
      } else {
        setError('Elektronik ürünler yüklenirken bir hata oluştu');
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
        response = await api.updateElectronic(editingElectronic.electronicId, formData);
      } else {
        response = await api.addElectronic(formData);
      }

      if (response.isSuccess) {
        await fetchElectronics();
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
        const response = await api.deleteElectronic(id);
        if (response.isSuccess) {
          await fetchElectronics();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (electronic) => {
    setEditingElectronic(electronic);
    setFormData({
      brand: electronic.brand,
      model: electronic.model,
      manufacturingYear: electronic.manufacturingYear,
      price: electronic.price,
      additionalInformation: electronic.additionalInformation,
      isActive: electronic.isActive,
      image: electronic.image,
      startTime: electronic.startTime,
      endTime: electronic.endTime
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      manufacturingYear: '',
      price: '',
      additionalInformation: '',
      isActive: true,
      image: '',
      startTime: '',
      endTime: ''
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingElectronic(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="electronic-container">
      <div className="electronic-header">
        <h2>Elektronik Ürünler Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus /> Yeni Ürün Ekle
        </button>
      </div>

      {(isAdding || isEditing) && (
        <form className="electronic-form" onSubmit={handleSubmit}>
          <div className="form-grid">
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
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Üretim Yılı</label>
              <input
                type="number"
                name="manufacturingYear"
                value={formData.manufacturingYear}
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
              <label>Ek Bilgiler</label>
              <textarea
                name="additionalInformation"
                value={formData.additionalInformation}
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

      <div className="electronic-list">
        {electronics && electronics.map(electronic => (
          <div key={electronic.electronicId} className="electronic-card" onClick={() => navigate(`/electronic/${electronic.electronicId}`)}>
            <div className="electronic-image">
              <img src={electronic.image} alt={electronic.model} />
            </div>
            <div className="electronic-info">
              <h3>{electronic.brand} {electronic.model}</h3>
              <p>Üretim Yılı: {electronic.manufacturingYear}</p>
              <p>Fiyat: {electronic.price} TL</p>
              <p>Mevcut Teklif: {electronic.auctionPrice} TL</p>
              <p>Durum: {electronic.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>Başlangıç: {new Date(electronic.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(electronic.endTime).toLocaleString()}</p>
              <p>Ek Bilgiler: {electronic.additionalInformation}</p>
            </div>
            <div className="electronic-actions">
              <button 
                className="edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(electronic);
                }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(electronic.electronicId);
                }}
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

export default Electronic; 