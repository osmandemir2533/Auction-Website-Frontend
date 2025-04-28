import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellerCreateElectronic.css';

const SellerCreateElectronic = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageToStore, setImageToStore] = useState(null);
  const [imageToDisplay, setImageToDisplay] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    manufacturingYear: '',
    price: '',
    auctionPrice: '',
    startTime: '',
    endTime: '',
    isActive: true,
    image: '',
    additionalInformation: '',
    sellerId: user?.nameid || ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setError("Dosya boyutu 1MB'dan küçük olmalıdır");
        setImageToStore("");
        setImageToDisplay("");
        return;
      } else if (isImageTypeValid.length === 0) {
        setError("Dosya türü jpeg, jpg veya png olmalıdır");
        setImageToStore("");
        setImageToDisplay("");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImageToStore(base64String);
        setImageToDisplay(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("manufacturingYear", formData.manufacturingYear.toString());
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("auctionPrice", formData.auctionPrice.toString());
      formDataToSend.append("startTime", formData.startTime);
      formDataToSend.append("endTime", formData.endTime);
      formDataToSend.append("isActive", formData.isActive.toString());
      formDataToSend.append("additionalInformation", formData.additionalInformation);
      formDataToSend.append("sellerId", formData.sellerId);

      if (imageToStore) {
        formDataToSend.append("Image", imageToStore);
        
        try {
          const base64Data = imageToStore.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          
          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          
          const blob = new Blob(byteArrays, { type: 'image/jpeg' });
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          formDataToSend.append("File", file);
        } catch (error) {
          console.error('Resim dönüştürme hatası:', error);
          setError('Resim işlenirken bir hata oluştu');
          setLoading(false);
          return;
        }
      } else {
        setError("Lütfen bir resim seçin");
        setLoading(false);
        return;
      }

      const response = await api.addElectronic(formDataToSend);
      if (response.isSuccess) {
        toast.success('Elektronik ürün başarıyla eklendi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSuccess();
      } else {
        setError(response.error || 'Elektronik ürün eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Hata detayı:', error);
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="seller-create-electronic">
      <h2>Yeni Elektronik Ürün Ekle</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group">
            <label>Marka</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              placeholder="Marka adını giriniz"
            />
          </div>

          <div className="form-group">
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="Model adını giriniz"
            />
          </div>

          <div className="form-group">
            <label>Üretim Yılı</label>
            <input
              type="number"
              name="manufacturingYear"
              value={formData.manufacturingYear}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fiyat</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Müzayede Fiyatı</label>
            <input
              type="number"
              name="auctionPrice"
              value={formData.auctionPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Başlangıç Tarihi</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bitiş Tarihi</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Durum</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
            >
              <option value={true}>Aktif</option>
              <option value={false}>Pasif</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Ek Bilgiler</label>
            <textarea
              name="additionalInformation"
              value={formData.additionalInformation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Ürün Resmi</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {imageToDisplay && (
              <img 
                src={imageToDisplay} 
                alt="Preview" 
                className="image-preview"
              />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            className="cancel-button"
          >
            İptal
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="save-button"
          >
            {loading ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerCreateElectronic; 