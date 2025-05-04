import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SellerCreateDress from './SellerCreateDress';
import './SellerDresses.css';

const SellerDresses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingDress, setEditingDress] = useState(null);

  useEffect(() => {
    fetchDresses();
  }, []);

  const fetchDresses = async () => {
    try {
      setLoading(true);
      const response = await api.getDresses();
      if (response.isSuccess) {
        const sellerDresses = response.result
          .filter(dress => String(dress.sellerId) === String(user.nameid))
          .map(dress => {
            // Resim URL'sini oluştur
            let imageUrl = '';
            if (dress.image) {
              if (dress.image.startsWith('http')) {
                // Tam URL zaten verilmişse
                imageUrl = dress.image;
              } else if (dress.image.startsWith('data:image')) {
                // Base64 formatındaysa
                imageUrl = dress.image;
              } else {
                // Dosya adı verilmişse
                imageUrl = `https://localhost:7282/Images/${dress.image}`;
              }
            }

            return {
              ...dress,
              image: imageUrl
            };
          });
        setDresses(sellerDresses);
      } else {
        setError('Giyim ürünleri yüklenirken bir hata oluştu');
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
        const response = await api.deleteDress(id);
        if (response.isSuccess) {
          await fetchDresses();
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

  const handleEdit = (dress) => {
    setEditingDress(dress);
    setIsAdding(true);
  };

  const handleFormSubmit = async () => {
    await fetchDresses();
    setIsAdding(false);
    setEditingDress(null);
  };

  if (loading && !dresses.length) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="dress-container">
      <div className="dress-header">
        <h2>Giyim Ürünleri Yönetimi</h2>
        <button 
          className="add-button"
          onClick={() => setIsAdding(true)}
        >
          Yeni Ürün Ekle
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isAdding && (
        <SellerCreateDress
          dress={editingDress}
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsAdding(false);
            setEditingDress(null);
          }}
        />
      )}

      <div className="dress-list">
        {dresses.map(dress => (
          <div key={dress.dressId} className="dress-card" onClick={() => navigate(`/dress/${dress.dressId}`)}>
            <div className="dress-image">
              <img src={dress.image} alt={dress.brand} />
            </div>
            <div className="dress-info">
              <h3>{dress.brand}</h3>
              <p>Tür: {dress.type}</p>
              <p>Beden: {dress.size}</p>
              <p>Renk: {dress.color}</p>
              <p>Materyal: {dress.material}</p>
              <p>Fiyat: {dress.price} TL</p>
              <p>Başlangıç: {new Date(dress.startTime).toLocaleString()}</p>
              <p>Bitiş: {new Date(dress.endTime).toLocaleString()}</p>
              <p>Durum: {dress.isActive ? 'Aktif' : 'Pasif'}</p>
              <p>{dress.additionalInformation}</p>
            </div>
            <div className="dress-actions">
              <button 
                className="edit-button"
                onClick={(e) => { e.stopPropagation(); handleEdit(dress); }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={(e) => { e.stopPropagation(); handleDelete(dress.dressId); }}
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

export default SellerDresses; 