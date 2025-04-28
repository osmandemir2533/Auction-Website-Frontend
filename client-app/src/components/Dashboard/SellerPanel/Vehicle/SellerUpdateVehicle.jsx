import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellerUpdateVehicle.css';

const SellerUpdateVehicle = ({ vehicle, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageToStore, setImageToStore] = useState(null);
  const [imageToDisplay, setImageToDisplay] = useState(null);
  const [formData, setFormData] = useState({
    brandAndModel: vehicle?.brandAndModel || '',
    manufacturingYear: vehicle?.manufacturingYear || '',
    color: vehicle?.color || '',
    engineCapacity: vehicle?.engineCapacity || '',
    millage: vehicle?.millage || '',
    plateNumber: vehicle?.plateNumber || '',
    price: vehicle?.price || '',
    startTime: vehicle?.startTime || '',
    endTime: vehicle?.endTime || '',
    isActive: vehicle?.isActive || true,
    image: vehicle?.image || '',
    sellerId: user?.nameid || ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brandAndModel: vehicle.brandAndModel,
        manufacturingYear: vehicle.manufacturingYear,
        color: vehicle.color,
        engineCapacity: vehicle.engineCapacity,
        millage: vehicle.millage,
        plateNumber: vehicle.plateNumber,
        price: vehicle.price,
        startTime: vehicle.startTime,
        endTime: vehicle.endTime,
        isActive: vehicle.isActive,
        image: vehicle.image,
        sellerId: user?.nameid
      });

      // Mevcut resmi göster
      if (vehicle.image) {
        if (vehicle.image.startsWith('http')) {
          setImageToDisplay(vehicle.image);
        } else if (vehicle.image.startsWith('data:image')) {
          setImageToDisplay(vehicle.image);
        } else {
          setImageToDisplay(`https://localhost:7282/Images/${vehicle.image}`);
        }
      }
    }
  }, [vehicle, user]);

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
      formDataToSend.append("Color", formData.color);
      formDataToSend.append("EngineCapacity", formData.engineCapacity.toString());
      formDataToSend.append("Price", formData.price.toString());
      formDataToSend.append("Millage", formData.millage.toString());
      formDataToSend.append("PlateNumber", formData.plateNumber);
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
      } else if (vehicle && vehicle.image) {
        // Mevcut resmi kullan
        if (vehicle.image.startsWith('data:image')) {
          // Base64 formatındaki resim
          formDataToSend.append("Image", vehicle.image);
          try {
            const base64Data = vehicle.image.split(',')[1];
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
            formDataToSend.append("Image", vehicle.image);
            
            // Resmi File olarak da gönder
            const response = await fetch(vehicle.image);
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

      const response = await api.updateVehicle(vehicle.vehicleId, formDataToSend);
      if (response.isSuccess) {
        toast.success('Araç başarıyla güncellendi!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSuccess();
      } else {
        setError(response.error || 'Araç güncellenirken bir hata oluştu');
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
    <div className="seller-update-vehicle">
      <h2>Araç Güncelle</h2>
      
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
            <label>Renk</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Kilometre</label>
            <input
              type="number"
              name="millage"
              value={formData.millage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Plaka</label>
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
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
            <label>Araç Resmi</label>
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
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            İptal
          </button>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerUpdateVehicle; 