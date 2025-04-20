import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { api } from '../../services/api';
import CreateVehicle from './CreateVehicle';
import './Vehicle.css';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.getVehicles();
      if (response.isSuccess) {
        const vehiclesWithValidUrls = response.result.map(vehicle => {
          console.log('Orijinal resim:', vehicle.image);

          // Resim URL'sini oluştur
          let imageUrl = '';
          if (vehicle.image) {
            if (vehicle.image.startsWith('http')) {
              // Tam URL zaten verilmişse
              imageUrl = vehicle.image;
            } else if (vehicle.image.startsWith('data:image')) {
              // Base64 formatındaysa
              imageUrl = vehicle.image;
            } else {
              // Dosya adı verilmişse
              imageUrl = `https://localhost:7282/Images/${vehicle.image}`;
            }
          }

          console.log('Oluşturulan URL:', imageUrl);

          return {
            ...vehicle,
            image: imageUrl
          };
        });
        setVehicles(vehiclesWithValidUrls);
      } else {
        setError('Araçlar yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        const response = await api.deleteVehicle(id);
        if (response.isSuccess) {
          await fetchVehicles();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (error) {
        setError(error.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsAdding(true);
  };

  const handleFormSubmit = async () => {
    await fetchVehicles();
    setIsAdding(false);
    setEditingVehicle(null);
  };

  if (loading && !vehicles.length) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="vehicle-container">
      <div className="vehicle-header">
        <h2>Araç Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          Yeni Araç Ekle
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAdding && (
        <CreateVehicle
          vehicle={editingVehicle}
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingVehicle(null);
          }}
        />
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
              <p>Başlangıç: {new Date(vehicle.startTime).toLocaleString('tr-TR')}</p>
              <p>Bitiş: {new Date(vehicle.endTime).toLocaleString('tr-TR')}</p>
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