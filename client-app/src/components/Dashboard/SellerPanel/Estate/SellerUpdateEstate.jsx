import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import './SellerUpdateEstate.css';

const SellerUpdateEstate = ({ estate, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    estateId: 0,
    title: '',
    description: '',
    address: '',
    roomCount: 0,
    squareMeters: 0,
    price: 0,
    auctionPrice: 0,
    startTime: '',
    endTime: '',
    isActive: true,
    image: '',
    sellerId: user?.nameid || ''
  });

  useEffect(() => {
    if (estate) {
      setFormData({
        estateId: estate.estateId || 0,
        title: estate.title || '',
        description: estate.description || '',
        address: estate.address || '',
        roomCount: estate.roomCount || 0,
        squareMeters: estate.squareMeters || 0,
        price: estate.price || 0,
        auctionPrice: estate.auctionPrice || 0,
        startTime: estate.startTime || '',
        endTime: estate.endTime || '',
        isActive: estate.isActive ?? true,
        image: estate.image || '',
        sellerId: estate.sellerId || user?.nameid || ''
      });
      setImage(estate.image);
    }
  }, [estate, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Resim boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && image) {
          formDataToSend.append('File', image);
        } else {
          formDataToSend.append(key.charAt(0).toUpperCase() + key.slice(1), formData[key]);
        }
      });

      const response = await api.updateEstate(formData.estateId, formDataToSend);
      
      if (response.isSuccess) {
        toast.success('Emlak başarıyla güncellendi!');
        onUpdate(response.result);
        onClose();
      } else {
        setError(response.error || 'Emlak güncellenirken bir hata oluştu.');
        toast.error(response.error || 'Emlak güncellenirken bir hata oluştu.');
      }
    } catch (err) {
      setError(err.message || 'Emlak güncellenirken bir hata oluştu.');
      toast.error(err.message || 'Emlak güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="update-estate-container">
      <h2>Emlak Güncelle</h2>
      <form className="estate-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Başlık</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Adres</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomCount">Oda Sayısı</label>
            <input
              type="number"
              id="roomCount"
              name="roomCount"
              value={formData.roomCount}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="squareMeters">Metrekare</label>
            <input
              type="number"
              id="squareMeters"
              name="squareMeters"
              value={formData.squareMeters}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Fiyat</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="auctionPrice">Açık Artırma Fiyatı</label>
            <input
              type="number"
              id="auctionPrice"
              name="auctionPrice"
              value={formData.auctionPrice}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Başlangıç Tarihi</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">Bitiş Tarihi</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="isActive">Durum</label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              required
            >
              <option value={true}>Aktif</option>
              <option value={false}>Pasif</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="image">Resim</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {image && (
              <img
                src={image}
                alt="Önizleme"
                className="image-preview"
              />
            )}
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerUpdateEstate; 