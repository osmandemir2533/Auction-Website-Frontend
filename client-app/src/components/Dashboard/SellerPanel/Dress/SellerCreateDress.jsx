import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellerCreateDress.css';

const SellerCreateDress = ({ dress, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageToStore, setImageToStore] = useState(null);
  const [imageToDisplay, setImageToDisplay] = useState(null);
  const [formData, setFormData] = useState({
    dressId: 0,
    brand: '',
    type: '',
    size: '',
    color: '',
    material: '',
    price: 0,
    startTime: '',
    endTime: '',
    isActive: true,
    image: '',
    additionalInformation: '',
    sellerId: user?.nameid || ''
  });

  useEffect(() => {
    if (dress) {
      setFormData({
        dressId: dress.dressId || 0,
        brand: dress.brand || '',
        type: dress.type || '',
        size: dress.size || '',
        color: dress.color || '',
        material: dress.material || '',
        price: dress.price || 0,
        startTime: dress.startTime ? new Date(dress.startTime).toISOString().slice(0, 16) : '',
        endTime: dress.endTime ? new Date(dress.endTime).toISOString().slice(0, 16) : '',
        isActive: dress.isActive || true,
        image: dress.image || '',
        additionalInformation: dress.additionalInformation || '',
        sellerId: dress.sellerId || user?.nameid || ''
      });

      // URL kontrolü ve oluşturma
      const imageUrl = dress.image?.startsWith('http') 
        ? dress.image 
        : dress.image 
          ? `https://localhost:7282/Images/${dress.image}`
          : '';
      
      setImageToDisplay(imageUrl);
    }
  }, [dress, user]);

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
      formDataToSend.append("Brand", formData.brand);
      formDataToSend.append("Type", formData.type);
      formDataToSend.append("Size", formData.size);
      formDataToSend.append("Color", formData.color);
      formDataToSend.append("Material", formData.material);
      formDataToSend.append("Price", formData.price.toString());
      formDataToSend.append("StartTime", formData.startTime);
      formDataToSend.append("EndTime", formData.endTime);
      formDataToSend.append("IsActive", formData.isActive.toString());
      formDataToSend.append("AdditionalInformation", formData.additionalInformation);
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
      } else if (dress && dress.image) {
        // Mevcut resmi kullan
        if (dress.image.startsWith('data:image')) {
          // Base64 formatındaki resim
          formDataToSend.append("Image", dress.image);
          try {
            const base64Data = dress.image.split(',')[1];
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
            formDataToSend.append("Image", dress.image);
            
            // Resmi File olarak da gönder
            const response = await fetch(dress.image, {
              mode: 'no-cors',
              headers: {
                'Access-Control-Allow-Origin': '*'
              }
            });
            
            if (!response.ok) {
              throw new Error('Resim yüklenemedi');
            }
            
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
      } else if (!dress) {
        // Yeni kayıt ve resim seçilmediyse
        setError("Lütfen bir resim seçin");
        setLoading(false);
        return;
      }

      // FormData içeriğini logla
      console.log('Gönderilen FormData:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (dress) {
        const response = await api.updateDress(dress.dressId, formDataToSend);
        if (response.isSuccess) {
          toast.success('Giyim ürünü başarıyla güncellendi!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          onSuccess();
        } else {
          setError(response.error);
        }
      } else {
        const response = await api.addDress(formDataToSend);
        if (response.isSuccess) {
          toast.success('Giyim ürünü başarıyla eklendi!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          onSuccess();
        } else {
          setError(response.error);
        }
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
    <div className="create-dress-container">
      <h2>{dress ? 'Giyim Ürünü Düzenle' : 'Yeni Giyim Ürünü Ekle'}</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="dress-form" encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group">
            <label>Marka</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
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
            <label>Beden</label>
            <input
              type="text"
              name="size"
              value={formData.size}
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
            <label>Materyal</label>
            <input
              type="text"
              name="material"
              value={formData.material}
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
              min="0"
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
              required={!dress}
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
            {loading ? 'Kaydediliyor...' : (dress ? 'Güncelle' : 'Kaydet')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerCreateDress; 