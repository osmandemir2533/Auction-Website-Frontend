import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import './Vehicle.css';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    brandAndModel: '',
    manufacturingYear: '',
    color: '',
    engineCapacity: '',
    price: '',
    millage: '',
    plateNumber: '',
    additionalInformation: '',
    image: '',
    startTime: '',
    endTime: '',
    isActive: true
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.getVehicles();
      if (response.isSuccess) {
        setVehicles(response.result);
      } else {
        setError('Araçlar yüklenirken bir hata oluştu');
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
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
        response = await api.updateVehicle(editingVehicle.vehicleId, formData);
      } else {
        response = await api.addVehicle(formData);
      }

      if (response.isSuccess) {
        await fetchVehicles();
        resetForm();
      } else {
        setError('İşlem başarısız oldu');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await api.deleteVehicle(id);
        if (response.isSuccess) {
          await fetchVehicles();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      brandAndModel: vehicle.brandAndModel,
      manufacturingYear: vehicle.manufacturingYear,
      color: vehicle.color,
      engineCapacity: vehicle.engineCapacity,
      price: vehicle.price,
      millage: vehicle.millage,
      plateNumber: vehicle.plateNumber,
      additionalInformation: vehicle.additionalInformation,
      image: vehicle.image,
      startTime: vehicle.startTime,
      endTime: vehicle.endTime,
      isActive: vehicle.isActive
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      brandAndModel: '',
      manufacturingYear: '',
      color: '',
      engineCapacity: '',
      price: '',
      millage: '',
      plateNumber: '',
      additionalInformation: '',
      image: '',
      startTime: '',
      endTime: '',
      isActive: true
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingVehicle(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="vehicle-container">
      <div className="vehicle-header">
        <h2>Araç Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          <FaPlus /> Yeni Araç Ekle
        </button>
      </div>

      {(isAdding || isEditing) && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Marka ve Model</label>
              <input
                type="text"
                name="brandAndModel"
                value={formData.brandAndModel}
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
              <label>Motor Hacmi</label>
              <input
                type="number"
                step="0.1"
                name="engineCapacity"
                value={formData.engineCapacity}
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
              <label>Kilometre</label>
              <input
                type="number"
                name="millage"
                value={formData.millage}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Plaka</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
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

      <div className="vehicle-list">
        {vehicles.map(vehicle => (
          <div key={vehicle.vehicleId} className="vehicle-card">
            <div className="vehicle-image">
              <img src={vehicle.image} alt={vehicle.brandAndModel} />
            </div>
            <div className="vehicle-info">
              <h3>{vehicle.brandAndModel}</h3>
              <p>Yıl: {vehicle.manufacturingYear}</p>
              <p>Renk: {vehicle.color}</p>
              <p>Motor: {vehicle.engineCapacity}L</p>
              <p>Fiyat: {vehicle.price} TL</p>
              <p>Kilometre: {vehicle.millage} km</p>
              <p>Plaka: {vehicle.plateNumber}</p>
              <p>Durum: {vehicle.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>Başlangıç: {new Date(vehicle.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(vehicle.endTime).toLocaleString()}</p>
              <p>{vehicle.additionalInformation}</p>
            </div>
            <div className="vehicle-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit(vehicle)}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(vehicle.vehicleId)}
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

export default Vehicle; 