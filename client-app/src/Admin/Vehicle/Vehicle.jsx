import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import CreateVehicle from './CreateVehicle';
import './Vehicle.css';
 
const Vehicle = () => {
  const navigate = useNavigate();
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
          let imageUrl = '';
          if (vehicle.image) {
            if (vehicle.image.startsWith('http')) {
              imageUrl = vehicle.image;
            } else if (vehicle.image.startsWith('data:image')) {
              imageUrl = vehicle.image;
            } else {
              imageUrl = `https://localhost:7282/Images/${vehicle.image}`;
            }
          }
 
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
 
  if (loading && !vehicles.length) return <div style={{ textAlign: 'center', padding: '20px' }}>Yükleniyor...</div>;
 
  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Araç Yönetimi</h2>
        <button
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => setIsAdding(true)}
        >
          Yeni Araç Ekle
        </button>
      </div>
 
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
 
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
 
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {vehicles.map(vehicle => (
          <div key={vehicle.vehicleId} className="vehicle-card" onClick={() => navigate(`/vehicle/${vehicle.vehicleId}`)}>
            <div style={{
              width: '100%',
              height: '200px',
              overflow: 'hidden'
            }}>
              <img
                src={vehicle.image}
                alt={vehicle.brandAndModel}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Resim+Yok';
                }}
              />
            </div>
            <div style={{ padding: '15px', flexGrow: 1 }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{vehicle.brandAndModel}</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>Yıl: {vehicle.manufacturingYear}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Renk: {vehicle.color}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Motor: {vehicle.engineCapacity}L</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Fiyat: {vehicle.price} TL</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Kilometre: {vehicle.millage} km</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Plaka: {vehicle.plateNumber}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Durum: {vehicle.isActive ? 'Aktif' : 'Pasif'}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Başlangıç: {new Date(vehicle.startTime).toLocaleString('tr-TR')}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>Bitiş: {new Date(vehicle.endTime).toLocaleString('tr-TR')}</p>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 15px',
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #eee'
            }}>
              <button
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={(e) => { e.stopPropagation(); handleEdit(vehicle); }}
              >
                <FaEdit />
                Düzenle
              </button>
              <button
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={(e) => { e.stopPropagation(); handleDelete(vehicle.vehicleId); }}
              >
                <FaTrash />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default Vehicle;