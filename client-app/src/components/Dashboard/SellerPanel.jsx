import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api'; // API'den araçları almak için
import VehicleCard from '../VehicleCard/VehicleCard'; // Araç kartı bileşenini kullanacağız
import './SellerPanel.css';

const SellerPanel = () => {
  const { user } = useAuth();  // Kullanıcı bilgilerini alıyoruz
  const [cars, setCars] = useState([]);  // Araçları saklamak için state
  const [newCar, setNewCar] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);  // Yükleniyor durumu
  const [error, setError] = useState('');  // Hata mesajları

  // Kullanıcıya ait araçları al
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await api.getVehicles();  // Araçları al
        if (data.isSuccess) {
          // Eğer API'den başarıyla cevap aldıysak, araçları state'e yerleştir
          setCars(data.result);
        } else {
          setError('Araçlar yüklenemedi');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      }
      setIsLoading(false);  // Yükleniyor durumunu kapat
    };
    fetchCars();
  }, [user]);

  // Yeni araç ekleme işlemi
  const handleAddCar = async () => {
    if (!newCar.name || !newCar.type || !newCar.price) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const response = await api.addCar(newCar);  // API'ye yeni araç ekleme isteği gönder
      if (response.isSuccess) {
        // Araç başarıyla eklendiyse, yeni aracı listeye ekle
        setCars([...cars, response.result]);
        setNewCar({ name: '', type: '', price: '', description: '' });  // Formu sıfırla
      } else {
        setError('Araç eklenemedi');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    }
  };

  // Araç silme işlemi
  const handleDeleteCar = async (carId) => {
    try {
      const response = await api.deleteCar(carId);  // API'ye araç silme isteği gönder
      if (response.isSuccess) {
        // Silinen aracı listeden çıkar
        setCars(cars.filter(car => car.id !== carId));
      } else {
        setError('Araç silinemedi.');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    }
  };

  // Araç güncelleme işlemi
  const handleUpdateCar = async (carId, updatedData) => {
    try {
      const response = await api.updateCar(carId, updatedData);  // API'ye araç güncelleme isteği gönder
      if (response.isSuccess) {
        // Güncellenen veriyi listeye yansıt
        setCars(cars.map(car => car.id === carId ? { ...car, ...updatedData } : car));
      } else {
        setError('Araç güncellenemedi.');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    }
  };

  // Yükleniyor durumu
  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="seller-panel">
      <h2>Seller Paneli</h2>
      {error && <div className="error-message">{error}</div>}  {/* Hata mesajı */}

      <div className="car-list">
        {cars.length > 0 ? (
          cars.map(car => (
            <VehicleCard 
              key={car.id} 
              vehicle={car}
              onDelete={() => handleDeleteCar(car.id)}  // Silme işlemi
              onUpdate={(updatedData) => handleUpdateCar(car.id, updatedData)}  // Güncelleme işlemi
            />
          ))
        ) : (
          <div>Hiç araç eklemediniz.</div>
        )}
      </div>

      {/* Yeni araç ekleme formu */}
      <div className="add-car">
        <h3>Yeni Araç Ekle</h3>
        <input 
          type="text" 
          name="name" 
          value={newCar.name} 
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} 
          placeholder="Araç Adı" 
        />
        <input 
          type="text" 
          name="type" 
          value={newCar.type} 
          onChange={(e) => setNewCar({ ...newCar, type: e.target.value })} 
          placeholder="Araç Türü" 
        />
        <input 
          type="number" 
          name="price" 
          value={newCar.price} 
          onChange={(e) => setNewCar({ ...newCar, price: e.target.value })} 
          placeholder="Fiyat" 
        />
        <textarea 
          name="description" 
          value={newCar.description} 
          onChange={(e) => setNewCar({ ...newCar, description: e.target.value })} 
          placeholder="Açıklama" 
        />
        <button onClick={handleAddCar}>Araç Ekle</button>
      </div>
    </div>
  );
};

export default SellerPanel;
