import React, { useState, useEffect } from 'react';
import { FaCar, FaTshirt, FaMusic, FaLaptop, FaHome, FaBook, FaGamepad, FaTools } from 'react-icons/fa';
import './SellerPanel.css';
import SellerVehiclePanel from './Vehicle/SellerVehiclePanel';

const SellerPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('vehicles');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde varsayılan kategoriyi ayarla
    setSelectedCategory('vehicles');
    setIsLoading(false);
  }, []);

  const categories = [
    { id: 'vehicles', name: 'Araçlar', icon: <FaCar />, component: <SellerVehiclePanel /> },
    { id: 'dresses', name: 'Giyim', icon: <FaTshirt />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'instruments', name: 'Müzik Aletleri', icon: <FaMusic />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'electronics', name: 'Elektronik', icon: <FaLaptop />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'home', name: 'Gayrimenkul', icon: <FaHome />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'books', name: 'Kitap & Dergi', icon: <FaBook />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'games', name: 'Oyun & Hobi', icon: <FaGamepad />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'tools', name: 'Yapı Market', icon: <FaTools />, component: <div className="coming-soon">Yakında...</div> }
  ];

  if (isLoading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="seller-panel">
      <div className="seller-sidebar">
        <h2>Satıcı Paneli</h2>
        <div className="category-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="seller-content">
        {selectedCategory ? (
          categories.find(cat => cat.id === selectedCategory)?.component
        ) : (
          <div className="welcome-message">
            <h2>Hoş Geldiniz!</h2>
            <p>Yönetmek istediğiniz kategoriyi seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPanel;
