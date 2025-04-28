import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellerUpdateMusicalInstrument.css';

const SellerUpdateMusicalInstrument = ({ instrument, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageToStore, setImageToStore] = useState(null);
  const [imageToDisplay, setImageToDisplay] = useState(null);
  const [formData, setFormData] = useState({
    brandAndModel: instrument?.brandAndModel || '',
    manufacturingYear: instrument?.manufacturingYear || '',
    type: instrument?.type || '',
    condition: instrument?.condition || '',
    price: instrument?.price || '',
    startTime: instrument?.startTime || '',
    endTime: instrument?.endTime || '',
    isActive: instrument?.isActive || true,
    image: instrument?.image || '',
    sellerId: user?.nameid || ''
  });

  useEffect(() => {
    if (instrument) {
      setFormData({
        brandAndModel: instrument.brandAndModel,
        manufacturingYear: instrument.manufacturingYear,
        type: instrument.type,
        condition: instrument.condition,
        price: instrument.price,
        startTime: instrument.startTime,
        endTime: instrument.endTime,
        isActive: instrument.isActive,
        image: instrument.image,
        sellerId: user?.nameid
      });

      // Mevcut resmi göster
      if (instrument.image) {
        if (instrument.image.startsWith('http')) {
          setImageToDisplay(instrument.image);
        } else if (instrument.image.startsWith('data:image')) {
          setImageToDisplay(instrument.image);
        } else {
          setImageToDisplay(`https://localhost:7282/Images/${instrument.image}`);
        }
      }
    }
  }, [instrument, user]);

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
      
      // Form verilerini ekle
      formDataToSend.append("BrandAndModel", formData.brandAndModel);
      formDataToSend.append("ManufacturingYear", formData.manufacturingYear.toString());
      formDataToSend.append("Type", formData.type);
      formDataToSend.append("Condition", formData.condition);
      formDataToSend.append("Price", formData.price.toString());
      formDataToSend.append("StartTime", formData.startTime);
      formDataToSend.append("EndTime", formData.endTime);
      formDataToSend.append("IsActive", formData.isActive.toString());
      formDataToSend.append("SellerId", formData.sellerId);

      // Resim işlemleri
      if (imageToStore) {
        // Yeni seçilen resim
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
      } else if (instrument && instrument.image) {
        // Mevcut resmi kullan
        if (instrument.image.startsWith('data:image')) {
          // Base64 formatındaki resim
          formDataToSend.append("Image", instrument.image);
          try {
            const base64Data = instrument.image.split(',')[1];
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
          // URL formatındaki resim
          try {
            // Resmi doğrudan base64 olarak gönder
            formDataToSend.append("Image", instrument.image);
            
            // Resmi File olarak da gönder
            const response = await fetch(instrument.image);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            formDataToSend.append("File", file);
          } catch (error) {
            console.error('Resim yükleme hatası:', error);
            setError('Resim yüklenirken bir hata oluştu. Lütfen resmi tekrar yükleyin.');
            setLoading(false);
            return;
          }
        }
      }

      // FormData içeriğini logla
      console.log('Gönderilen FormData:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.updateMusicalInstrument(instrument.instrumentId, formDataToSend);
      if (response.isSuccess) {
        toast.success('Müzik aleti başarıyla güncellendi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSuccess();
      } else {
        setError(response.error || 'Müzik aleti güncellenirken bir hata oluştu');
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
    <div className="update-instrument-container">
      <h2>Müzik Aleti Güncelle</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group">
            <label>Marka ve Model</label>
            <input
              type="text"
              name="brandAndModel"
              value={formData.brandAndModel}
              onChange={handleChange}
              required
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
            <label>Tür</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Durum</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
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
            <label>Müzik Aleti Resmi</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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
            className="update-button"
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerUpdateMusicalInstrument; 