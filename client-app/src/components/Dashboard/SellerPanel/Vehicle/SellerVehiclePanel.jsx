import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './SellerVehiclePanel.css';

const SellerVehiclePanel = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔍 useEffect başladı');
    console.log('👤 Kullanıcı bilgileri:', user);
    
    const fetchSellerVehicles = async () => {
      try {
        console.log('1️⃣ Tüm araçları çekiyorum...');
        const allVehiclesResponse = await api.getVehicles();
        console.log('2️⃣ API yanıtı:', allVehiclesResponse);
        
        if (allVehiclesResponse.isSuccess) {
          console.log('3️⃣ Tüm araçlar:', allVehiclesResponse.result);
          
          // Satıcının araçlarını filtrele
          const sellerVehicleIds = allVehiclesResponse.result
            .filter(vehicle => {
              console.log('4️⃣ Araç kontrolü:', {
                vehicleId: vehicle.vehicleId,
                vehicleSellerId: vehicle.sellerId,
                userSellerId: user.nameid,
                tipleri: {
                  vehicleSellerId: typeof vehicle.sellerId,
                  userSellerId: typeof user.nameid
                }
              });
              return String(vehicle.sellerId) === String(user.nameid);
            })
            .map(vehicle => vehicle.vehicleId);
          
          console.log('5️⃣ Satıcının araç ID\'leri:', sellerVehicleIds);
          
          if (sellerVehicleIds.length === 0) {
            console.log('6️⃣ Satıcıya ait araç bulunamadı');
            setVehicles([]);
            return;
          }
          
          // Her bir araç için detaylı bilgiyi al
          console.log('7️⃣ Her araç için detaylı bilgi alınıyor...');
          const vehicleDetails = await Promise.all(
            sellerVehicleIds.map(async (vehicleId) => {
              console.log('8️⃣ Araç detayı alınıyor:', vehicleId);
              const vehicleResponse = await api.getVehicleById(vehicleId);
              console.log('9️⃣ Araç detayı yanıtı:', vehicleResponse);
              return vehicleResponse.isSuccess ? vehicleResponse.result : null;
            })
          );
          
          // Null olmayan araçları filtrele
          const validVehicles = vehicleDetails.filter(vehicle => vehicle !== null);
          console.log('🔟 Geçerli araçlar:', validVehicles);
          
          setVehicles(validVehicles);
        } else {
          console.log('❌ API yanıtı başarısız:', allVehiclesResponse);
          setError('Araçlar yüklenirken bir hata oluştu');
        }
      } catch (err) {
        console.error('❌ Hata oluştu:', err);
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.nameid) {
      console.log('🚀 fetchSellerVehicles başlatılıyor');
      fetchSellerVehicles();
    } else {
      console.log('⚠️ Kullanıcı veya nameid eksik');
    }
  }, [user.nameid]);

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await api.deleteVehicle(vehicleId);
        if (response.isSuccess) {
          setVehicles(vehicles.filter(vehicle => vehicle.vehicleId !== vehicleId));
        } else {
          setError('Araç silinemedi');
        }
      } catch (err) {
        setError('Bir hata oluştu');
        console.error('Silme hatası:', err);
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seller-vehicle-panel">
      <h2>İlan Verdiğim Araçlar</h2>
      <div className="vehicle-grid">
        {vehicles.length > 0 ? (
          vehicles.map(vehicle => (
            <div key={vehicle.vehicleId} className="vehicle-card">
              <div className="vehicle-image">
                <img src={vehicle.image} alt={vehicle.brandAndModel} />
              </div>
              <div className="vehicle-info">
                <h3>{vehicle.brandAndModel}</h3>
                <p>Yıl: {vehicle.manufacturingYear}</p>
                <p>Renk: {vehicle.color}</p>
                <p>Motor Hacmi: {vehicle.engineCapacity}cc</p>
                <p>Kilometre: {vehicle.millage}km</p>
                <p>Plaka: {vehicle.plateNumber}</p>
                <p>Başlangıç Fiyatı: {vehicle.price}₺</p>
                <p>Güncel Teklif: {vehicle.auctionPrice}₺</p>
                <p>Başlangıç: {new Date(vehicle.startTime).toLocaleString()}</p>
                <p>Bitiş: {new Date(vehicle.endTime).toLocaleString()}</p>
                <p>Durum: {vehicle.isActive ? 'Aktif' : 'Pasif'}</p>
                <div className="vehicle-actions">
                  <button className="edit-button">
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
            </div>
          ))
        ) : (
          <div className="no-vehicles">
            Henüz hiç araç ilanı vermediniz.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerVehiclePanel;
