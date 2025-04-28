import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SellerCreateElectronic from './SellerCreateElectronic';
import SellerUpdateElectronic from './SellerUpdateElectronic';
import './SellerElectronics.css';

const SellerElectronics = () => {
  const { user } = useAuth();
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingElectronic, setEditingElectronic] = useState(null);

  useEffect(() => {
    fetchElectronics();
  }, []);

  const fetchElectronics = async () => {
    try {
      setLoading(true);
      const response = await api.getElectronicsBySeller(user.nameid);
      if (response.isSuccess) {
        const sellerElectronics = response.result.map(electronic => {
          let imageUrl = '';
          if (electronic.image) {
            if (electronic.image.startsWith('http')) {
              imageUrl = electronic.image;
            } else if (electronic.image.startsWith('data:image')) {
              imageUrl = electronic.image;
            } else {
              imageUrl = `https://localhost:7282/Images/${electronic.image}`;
            }
          }

          return {
            ...electronic,
            image: imageUrl
          };
        });
        setElectronics(sellerElectronics);
      } else {
        setError('Elektronik ürünleri yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        const response = await api.deleteElectronic(id);
        if (response.isSuccess) {
          await fetchElectronics();
        } else {
          setError('Silme işlemi başarısız oldu');
        }
      } catch (err) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (electronic) => {
    setEditingElectronic(electronic);
    setIsAdding(true);
  };

  const handleFormSubmit = async () => {
    await fetchElectronics();
    setIsAdding(false);
    setEditingElectronic(null);
  };

  if (loading && !electronics.length) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="electronics-container">
      <div className="electronics-header">
        <h2>Elektronik Ürünleri Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          Yeni Ürün Ekle
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAdding && !editingElectronic && (
        <SellerCreateElectronic
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingElectronic(null);
          }}
        />
      )}

      {isAdding && editingElectronic && (
        <SellerUpdateElectronic
          electronic={editingElectronic}
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingElectronic(null);
          }}
        />
      )}

      <div className="electronics-list">
        {electronics.map(electronic => (
          <div key={electronic.electronicId} className="electronic-card">
            <div className="electronic-image">
              <img src={electronic.image} alt={`${electronic.brand} ${electronic.model}`} />
            </div>
            <div className="electronic-info">
              <h3>{electronic.brand} {electronic.model}</h3>
              <p>Üretim Yılı: {electronic.manufacturingYear}</p>
              <p>Fiyat: {electronic.price} TL</p>
              <p>Müzayede Fiyatı: {electronic.auctionPrice} TL</p>
              <p>Başlangıç: {new Date(electronic.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(electronic.endTime).toLocaleString()}</p>
              <p>Durum: {electronic.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>Ek Bilgiler: {electronic.additionalInformation}</p>
            </div>
            <div className="electronic-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit(electronic)}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(electronic.electronicId)}
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

export default SellerElectronics; 