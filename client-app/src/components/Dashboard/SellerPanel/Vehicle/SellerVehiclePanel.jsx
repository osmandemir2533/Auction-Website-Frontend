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
  const [isEditing, setIsEditing] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Yeni araç ekleme state
  const [formData, setFormData] = useState({
    brandAndModel: '',
    manufacturingYear: '',
    color: '',
    engineCapacity: '',
    millage: '',
    plateNumber: '',
    price: '',
    startTime: '',
    endTime: '',
    isActive: true,
    image: ''
  });

  useEffect(() => {
    const fetchSellerVehicles = async () => {
      try {
        const allVehiclesResponse = await api.getVehicles();
        if (allVehiclesResponse.isSuccess) {
          const sellerVehicleIds = allVehiclesResponse.result
            .filter(vehicle => String(vehicle.sellerId) === String(user?.nameid))
            .map(vehicle => vehicle.vehicleId);

          if (sellerVehicleIds.length === 0) {
            setVehicles([]);
            return;
          }

          const vehicleDetails = await Promise.all(
            sellerVehicleIds.map(async (vehicleId) => {
              const vehicleResponse = await api.getVehicleById(vehicleId);
              return vehicleResponse.isSuccess ? vehicleResponse.result : null;
            })
          );

          const validVehicles = vehicleDetails.filter(vehicle => vehicle !== null);
          setVehicles(validVehicles);
        } else {
          setError('Araçlar yüklenirken bir hata oluştu');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.nameid) {
      fetchSellerVehicles();
    } else {
      console.log('⚠️ Kullanıcı veya nameid eksik');
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditing) {
        response = await api.updateVehicle(editingVehicle.vehicleId, formData);
      } else {
        response = await api.addVehicle(formData);
      }

      if (response.isSuccess) {
        await fetchSellerVehicles();
        resetForm();
      } else {
        setError('İşlem başarısız oldu');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await api.deleteVehicle(id);
        if (response.isSuccess) {
          setVehicles(vehicles.filter(vehicle => vehicle.vehicleId !== id));
        } else {
          setError('Araç silinemedi');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
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
      image: vehicle.image
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      brandAndModel: '',
      manufacturingYear: '',
      color: '',
      engineCapacity: '',
      millage: '',
      plateNumber: '',
      price: '',
      startTime: '',
      endTime: '',
      isActive: true,
      image: ''
    });
    setIsEditing(false);
    setEditingVehicle(null);
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seller-vehicle-panel">
      <h2>İlan Verdiğim Araçlar</h2>

      {/* Yeni araç ekleme butonu */}
      <button
        className="add-button"
        onClick={() => setIsAdding(true)}
      >
        Yeni Araç Ekle
      </button>

      {error && <div className="error-message">{error}</div>}

      {/* Yeni araç ekleme formu */}
      {isAdding && (
        <SellerCreateVehicle
          vehicle={editingVehicle}
          onSuccess={handleSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingVehicle(null);
            resetForm(); // Formu sıfırla
          }}
        />
      )}

      {/* Araçları listele */}
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
              </div>

              <div className="vehicle-actions" style={{ marginTop: '20px' }}>
                <button
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '8px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleEdit(vehicle)}
                >
                  <FaEdit />
                </button>
                <button
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '8px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handleDelete(vehicle.vehicleId)}
                >
                  <FaTrash />
                </button>
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
