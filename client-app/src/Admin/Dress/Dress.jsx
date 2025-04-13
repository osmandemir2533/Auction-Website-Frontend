import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import './Dress.css';

const Dress = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDress, setEditingDress] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    type: '',
    size: '',
    color: '',
    material: '',
    price: '',
    additionalInformation: '',
    auctionPrice: 0,
    startTime: '',
    endTime: '',
    isActive: true,
    image: ''
  });

  useEffect(() => {
    fetchDresses();
  }, []);

  const fetchDresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDresses();
      console.log('API Response:', response);
      
      if (response.isSuccess && response.result && response.result.result) {
        setDresses(response.result.result);
      } else {
        setError('Giyim ürünleri yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Fetch error:', error);
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
        response = await api.updateDress(editingDress.dressId, formData);
      } else {
        response = await api.addDress(formData);
      }

      if (response.isSuccess) {
        await fetchDresses();
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
        const response = await api.deleteDress(id);
        if (response.isSuccess) {
          await fetchDresses();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (dress) => {
    setEditingDress(dress);
    setFormData({
      brand: dress.brand,
      type: dress.type,
      size: dress.size,
      color: dress.color,
      material: dress.material,
      price: dress.price,
      additionalInformation: dress.additionalInformation,
      auctionPrice: dress.auctionPrice,
      startTime: dress.startTime,
      endTime: dress.endTime,
      isActive: dress.isActive,
      image: dress.image
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      type: '',
      size: '',
      color: '',
      material: '',
      price: '',
      additionalInformation: '',
      auctionPrice: 0,
      startTime: '',
      endTime: '',
      isActive: true,
      image: ''
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingDress(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dress-container">
      <div className="dress-header">
        <h2>Giyim Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus /> Yeni Ürün Ekle
        </button>
      </div>

      {(isAdding || isEditing) && (
        <form className="dress-form" onSubmit={handleSubmit}>
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
              <label>Tür</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Beden</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Renk</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Materyal</label>
              <input
                type="text"
                name="material"
                value={formData.material}
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

      <div className="dress-list">
        {dresses && dresses.map(dress => (
          <div key={dress.dressId} className="dress-card">
            <div className="dress-image">
              <img src={dress.image} alt={dress.brand} />
            </div>
            <div className="dress-info">
              <h3>{dress.brand} - {dress.type}</h3>
              <p>Beden: {dress.size}</p>
              <p>Renk: {dress.color}</p>
              <p>Materyal: {dress.material}</p>
              <p>Fiyat: {dress.price} TL</p>
              <p>Mevcut Teklif: {dress.auctionPrice} TL</p>
              <p>Durum: {dress.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>Başlangıç: {new Date(dress.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(dress.endTime).toLocaleString()}</p>
              <p>{dress.additionalInformation}</p>
            </div>
            <div className="dress-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit(dress)}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(dress.dressId)}
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

export default Dress; 