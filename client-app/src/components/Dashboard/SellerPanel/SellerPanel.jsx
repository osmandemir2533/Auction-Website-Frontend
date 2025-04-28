import React, { useState, useEffect } from 'react';
import { FaCar, FaTshirt, FaMusic, FaLaptop, FaHome, FaBook, FaGamepad, FaTools } from 'react-icons/fa';
import './SellerPanel.css';
import SellerVehicle from './Vehicle/SellerVehicle';
import SellerInstrumentPanel from './Music/SellerMusicalInstruments';
import SellerDresses from './Dress/SellerDresses';
import SellerEstates from './Estate/SellerEstates';
import SellerElectronics from './Electronic/SellerElectronics';

const SellerPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('vehicles');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde varsayılan kategoriyi ayarla
    setSelectedCategory('vehicles');
    setIsLoading(false);
  }, []);

  const categories = [
    { id: 'vehicles', name: 'Araçlar', icon: <FaCar />, component: <SellerVehicle /> },
    { id: 'dresses', name: 'Giyim', icon: <FaTshirt />, component: <SellerDresses /> },
    { id: 'instruments', name: 'Müzik Aletleri', icon: <FaMusic />, component: <SellerInstrumentPanel /> },
    { id: 'electronics', name: 'Elektronik', icon: <FaLaptop />, component: <SellerElectronics /> },
    { id: 'home', name: 'Gayrimenkul', icon: <FaHome />, component: < SellerEstates/> },
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
