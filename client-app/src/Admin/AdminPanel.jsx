import React, { useState } from 'react';
import { FaCar, FaTshirt, FaMusic, FaLaptop, FaHome, FaBook, FaGamepad, FaTools } from 'react-icons/fa';
import Vehicle from './Vehicle/Vehicle';
import Dress from './Dress/Dress';
import MusicalInstrument from './MusicalInstrument/MusicalInstrument';
import Electronic from './Electronic/Electronic';
import './AdminPanel.css';
import Estate from './Estate/Estate';

const AdminPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'vehicles', name: 'Araçlar', icon: <FaCar />, component: <Vehicle /> },
    { id: 'dresses', name: 'Giyim', icon: <FaTshirt />, component: <Dress /> },
    { id: 'instruments', name: 'Müzik Aletleri', icon: <FaMusic />, component: <MusicalInstrument /> },
    { id: 'electronics', name: 'Elektronik', icon: <FaLaptop />, component: <Electronic /> },
    { id: 'home', name: 'Gayrimenkul', icon: <FaHome />, component: <Estate /> },
    { id: 'books', name: 'Kitap & Dergi', icon: <FaBook />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'games', name: 'Oyun & Hobi', icon: <FaGamepad />, component: <div className="coming-soon">Yakında...</div> },
    { id: 'tools', name: 'Yapı Market', icon: <FaTools />, component: <div className="coming-soon">Yakında...</div> }
  ];

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <h2>Admin Paneli</h2>
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
      <div className="admin-content">
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

export default AdminPanel;
