import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Estate.css';

const Estate = () => {
  const navigate = useNavigate();
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEstate, setEditingEstate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    roomCount: '',
    squareMeters: '',
    price: '',
    isActive: true,
    image: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchEstates();
  }, []);

  const fetchEstates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEstates();
      
      if (response.isSuccess && response.result) {
        setEstates(response.result);
      } else {
        setError('Gayrimenkuller yüklenirken bir hata oluştu');
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
        response = await api.updateEstate(editingEstate.estateId, formData);
      } else {
        response = await api.addEstate(formData);
      }

      if (response.isSuccess) {
        await fetchEstates();
        resetForm();
      } else {
        setError('İşlem başarısız oldu');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu gayrimenkulü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await api.deleteEstate(id);
        if (response.isSuccess) {
          await fetchEstates();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (estate) => {
    setEditingEstate(estate);
    setFormData({
      title: estate.title,
      description: estate.description,
      address: estate.address,
      roomCount: estate.roomCount,
      squareMeters: estate.squareMeters,
      price: estate.price,
      isActive: estate.isActive,
      image: estate.image,
      startTime: estate.startTime,
      endTime: estate.endTime
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      roomCount: '',
      squareMeters: '',
      price: '',
      isActive: true,
      image: '',
      startTime: '',
      endTime: ''
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingEstate(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="estate-container">
      <div className="estate-header">
        <h2>Gayrimenkul Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus /> Yeni İlan Ekle
        </button>
      </div>

      {(isAdding || isEditing) && (
        <form className="estate-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Başlık</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Adres</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Oda Sayısı</label>
              <input
                type="number"
                name="roomCount"
                value={formData.roomCount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Metrekare</label>
              <input
                type="number"
                name="squareMeters"
                value={formData.squareMeters}
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
              <label>Açıklama</label>
              <textarea
                name="description"
                value={formData.description}
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

      <div className="estate-list">
        {estates && estates.map(estate => (
          <div key={estate.estateId} className="estate-card" onClick={() => navigate(`/estate/${estate.estateId}`)}>
            <div className="estate-image">
              <img src={estate.image} alt={estate.title} />
            </div>
            <div className="estate-info">
              <h3>{estate.title}</h3>
              <p>Adres: {estate.address}</p>
              <p>Oda Sayısı: {estate.roomCount}</p>
              <p>Metrekare: {estate.squareMeters} m²</p>
              <p>Fiyat: {estate.price} TL</p>
              <p>Mevcut Teklif: {estate.auctionPrice} TL</p>
              <p>Durum: {estate.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>Başlangıç: {new Date(estate.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(estate.endTime).toLocaleString()}</p>
              <p>{estate.description}</p>
            </div>
            <div className="estate-actions">
              <button 
                className="edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(estate);
                }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(estate.estateId);
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

export default Estate; 