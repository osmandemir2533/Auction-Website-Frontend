import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellerCreateEstate.css';

const SellerCreateEstate = ({ estate, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageToStore, setImageToStore] = useState(null);
  const [imageToDisplay, setImageToDisplay] = useState(null);
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
        startTime: estate.startTime ? new Date(estate.startTime).toISOString().slice(0, 16) : '',
        endTime: estate.endTime ? new Date(estate.endTime).toISOString().slice(0, 16) : '',
        isActive: estate.isActive || true,
        image: estate.image || '',
        sellerId: estate.sellerId || user?.nameid || ''
      });

      if (estate.image) {
        const imageUrl = estate.image.startsWith('http') 
          ? estate.image 
          : estate.image.startsWith('data:image')
            ? estate.image
            : `https://localhost:7282/Images/${estate.image}`;
        setImageToDisplay(imageUrl);
      }
    }
  }, [estate, user]);

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
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Address", formData.address);
      formDataToSend.append("RoomCount", formData.roomCount.toString());
      formDataToSend.append("SquareMeters", formData.squareMeters.toString());
      formDataToSend.append("Price", formData.price.toString());
      formDataToSend.append("AuctionPrice", formData.auctionPrice.toString());
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
      } else if (estate && estate.image) {
        // Mevcut resmi kullan
        if (estate.image.startsWith('data:image')) {
          // Base64 formatındaki resim
          formDataToSend.append("Image", estate.image);
          try {
            const base64Data = estate.image.split(',')[1];
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
            formDataToSend.append("Image", estate.image);
            
            // Resmi File olarak da gönder
            const response = await fetch(estate.image);
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
      } else if (!estate) {
        // Yeni kayıt ve resim seçilmediyse
        setError("Lütfen bir resim seçin");
        setLoading(false);
        return;
      }

      if (estate) {
        const response = await api.updateEstate(estate.estateId, formDataToSend);
        if (response.isSuccess) {
          toast.success('Emlak başarıyla güncellendi!');
          onSuccess();
        } else {
          setError(response.error);
        }
      } else {
        const response = await api.addEstate(formDataToSend);
        if (response.isSuccess) {
          toast.success('Emlak başarıyla eklendi!');
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
    <div className="create-estate-container">
      <h2>{estate ? 'Emlak Düzenle' : 'Yeni Emlak Ekle'}</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="estate-form">
        <div className="form-group">
          <label>Başlık</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Adres</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Oda Sayısı</label>
            <input
              type="number"
              name="roomCount"
              value={formData.roomCount}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Metrekare</label>
            <input
              type="number"
              name="squareMeters"
              value={formData.squareMeters}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
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
            <label>Açık Artırma Fiyatı</label>
            <input
              type="number"
              name="auctionPrice"
              value={formData.auctionPrice}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
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

        <div className="form-group">
          <label>Resim</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!estate}
          />
          {imageToDisplay && (
            <img 
              src={imageToDisplay} 
              alt="Preview" 
              className="image-preview"
            />
          )}
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
            className="submit-button"
          >
            {loading ? 'Kaydediliyor...' : (estate ? 'Güncelle' : 'Kaydet')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerCreateEstate; 