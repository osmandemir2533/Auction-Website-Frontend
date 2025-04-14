import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Vehicle.css';

const Vehicle = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    brandAndModel: '',
    manufacturingYear: '',
    color: '',
    engineCapacity: '',
    price: '',
    millage: '',
    plateNumber: '',
    auctionPrice: '',
    additionalInformation: '',
    startTime: '',
    endTime: '',
    isActive: true,
    image: 'https://example.com/placeholder.jpg',
    sellerId: user?.nameid || '',
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
      // Zorunlu alanların kontrolü
      const requiredFields = {
        brandAndModel: 'Marka ve Model',
        color: 'Renk',
        plateNumber: 'Plaka',
        additionalInformation: 'Ek Bilgiler',
        startTime: 'Başlangıç Tarihi',
        endTime: 'Bitiş Tarihi'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !formData[field]?.trim())
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        setError(`Lütfen aşağıdaki alanları doldurun:\n${missingFields.join('\n')}`);
        return;
      }

      if (!selectedFile) {
        setError('Lütfen bir araç resmi seçin');
        return;
      }

      if (!user || !user.nameid) {
        setError('Kullanıcı bilgisi bulunamadı');
        return;
      }

      const base64File = await convertFileToBase64(selectedFile);
      const cleanBase64 = base64File.split(',')[1];

      // Tarih formatını düzelt
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        setError('Geçersiz tarih formatı');
        return;
      }

      const vehicleData = {
        brandAndModel: formData.brandAndModel.trim(),
        manufacturingYear: parseInt(formData.manufacturingYear) || 0,
        color: formData.color.trim(),
        engineCapacity: parseFloat(formData.engineCapacity) || 0,
        price: parseFloat(formData.price) || 0,
        millage: parseInt(formData.millage) || 0,
        plateNumber: formData.plateNumber.trim(),
        auctionPrice: parseFloat(formData.auctionPrice) || 0,
        additionalInformation: formData.additionalInformation.trim(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isActive: true,
        image: 'https://example.com/placeholder.jpg',
        sellerId: user.nameid,
        file: cleanBase64
      };

      console.log('Backend\'e gönderilecek veri:', JSON.stringify(vehicleData, null, 2));

      const response = await api.createVehicle(vehicleData);
      console.log('Backend yanıtı:', response);

      if (response.isSuccess) {
        await fetchVehicles();
        resetForm();
        setError(''); // Başarılı işlem sonrası hata mesajını temizle
      } else {
        setError('İşlem başarısız oldu');
      }
    } catch (error) {
      console.error('Hata detayı:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError(error.message || 'Bir hata oluştu');
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
      auctionPrice: vehicle.auctionPrice,
      additionalInformation: vehicle.additionalInformation,
      image: vehicle.image,
      startTime: vehicle.startTime,
      endTime: vehicle.endTime,
      isActive: vehicle.isActive,
      sellerId: vehicle.sellerId,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    console.log('Form sıfırlanıyor');
    setFormData({
      brandAndModel: '',
      manufacturingYear: '',
      color: '',
      engineCapacity: '',
      price: '',
      millage: '',
      plateNumber: '',
      auctionPrice: '',
      additionalInformation: '',
      startTime: '',
      endTime: '',
      isActive: true,
      image: 'https://example.com/placeholder.jpg',
      sellerId: user?.nameid || '',
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditingVehicle(null);
    setSelectedFile(null);
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
            <div className="form-group">
              <label>Açık Artırma Fiyatı</label>
              <input
                type="number"
                name="auctionPrice"
                value={formData.auctionPrice}
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
            <div className="form-group">
              <label>Başlangıç Tarihi (GG.AA.YYYY SS:DD:SS)</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                placeholder="11.04.2025 15:38:29"
              />
            </div>
            <div className="form-group">
              <label>Bitiş Tarihi (GG.AA.YYYY SS:DD:SS)</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                placeholder="11.04.2025 15:38:29"
              />
            </div>
            <div className="form-group full-width">
              <label>Araç Resmi</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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