import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellerCreateMusicalInstrument.css';

const SellerCreateMusicalInstrument = ({ instrument, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageToStore, setImageToStore] = useState(null);
  const [imageToDisplay, setImageToDisplay] = useState(null);
  const [formData, setFormData] = useState({
    musicalInstrumentId: 0,
    name: '',
    brand: '',
    description: '',
    auctionPrice: 0,
    price: 0,
    startTime: '',
    endTime: '',
    isActive: true,
    image: '',
    sellerId: user?.nameid || ''
  });

  useEffect(() => {
    if (instrument) {
      setFormData({
        musicalInstrumentId: instrument.musicalInstrumentId || 0,
        name: instrument.name || '',
        brand: instrument.brand || '',
        description: instrument.description || '',
        auctionPrice: instrument.auctionPrice || 0,
        price: instrument.price || 0,
        startTime: instrument.startTime ? new Date(instrument.startTime).toISOString().slice(0, 16) : '',
        endTime: instrument.endTime ? new Date(instrument.endTime).toISOString().slice(0, 16) : '',
        isActive: instrument.isActive || true,
        image: instrument.image || '',
        sellerId: instrument.sellerId || user?.nameid || ''
      });

      if (instrument.image) {
        const imageUrl = instrument.image.startsWith('http') 
          ? instrument.image 
          : instrument.image.startsWith('data:image')
            ? instrument.image
            : `https://localhost:7282/Images/${instrument.image}`;
        
        setImageToDisplay(imageUrl);
        setImageToStore(imageUrl);
      }
    } else {
      // Yeni kayıt için form verilerini sıfırla
      setFormData({
        musicalInstrumentId: 0,
        name: '',
        brand: '',
        description: '',
        auctionPrice: 0,
        price: 0,
        startTime: '',
        endTime: '',
        isActive: true,
        image: '',
        sellerId: user?.nameid || ''
      });
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
      formDataToSend.append("MusicalInstrumentId", formData.musicalInstrumentId || 0);
      formDataToSend.append("Name", formData.name || '');
      formDataToSend.append("Brand", formData.brand || '');
      formDataToSend.append("Description", formData.description || '');
      formDataToSend.append("AuctionPrice", (formData.auctionPrice || 0).toString());
      formDataToSend.append("Price", (formData.price || 0).toString());
      formDataToSend.append("StartTime", formData.startTime || '');
      formDataToSend.append("EndTime", formData.endTime || '');
      formDataToSend.append("IsActive", (formData.isActive || true).toString());
      
      // SellerId değerini doğrudan user.nameid'den al
      const sellerId = user?.nameid || '';
      if (!sellerId) {
        setError("Satıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }
      
      // SellerId değerini doğrudan gönder
      formDataToSend.append("SellerId", sellerId);

      // Form verilerini kontrol et
      console.log('Form verileri:', {
        MusicalInstrumentId: formData.musicalInstrumentId,
        Name: formData.name,
        Brand: formData.brand,
        Description: formData.description,
        AuctionPrice: formData.auctionPrice,
        Price: formData.price,
        StartTime: formData.startTime,
        EndTime: formData.endTime,
        IsActive: formData.isActive,
        SellerId: sellerId
      });

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
            const response = await fetch(instrument.image, {
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
      } else if (!instrument) {
        setError("Lütfen bir resim seçin");
        setLoading(false);
        return;
      }

      // FormData içeriğini logla
      console.log('Gönderilen FormData:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (instrument) {
        console.log('Updating instrument with ID:', instrument.musicalInstrumentId);
        const response = await api.updateMusicalInstrument(instrument.musicalInstrumentId, formDataToSend);
        console.log('Update response:', response);
        if (response.isSuccess) {
          toast.success('Müzik aleti başarıyla güncellendi!');
          onSuccess();
        } else {
          setError(response.error || 'Güncelleme başarısız oldu');
        }
      } else {
        console.log('Creating new instrument');
        const response = await api.addMusicalInstrument(formDataToSend);
        console.log('Create response:', response);
        if (response.isSuccess) {
          toast.success('Müzik aleti başarıyla eklendi!');
          onSuccess();
        } else {
          setError(response.error || 'Ekleme başarısız oldu');
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
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="create-instrument-container">
      <h2>{instrument ? 'Müzik Aleti Düzenle' : 'Yeni Müzik Aleti Ekle'}</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form className="instrument-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Müzik Aleti Adı</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="brand">Marka</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
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
            <label htmlFor="price">Satış Fiyatı</label>
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
            <label htmlFor="startTime">Başlangıç Zamanı</label>
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
            <label htmlFor="endTime">Bitiş Zamanı</label>
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
          <div className="form-group full-width">
            <label htmlFor="image">Görsel</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              required={!instrument}
            />
            {imageToDisplay && (
              <img
                src={imageToDisplay}
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
            onClick={onCancel}
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : (instrument ? 'Güncelle' : 'Kaydet')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerCreateMusicalInstrument; 