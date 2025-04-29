import React, { useEffect, useState } from 'react';
import ElectronicCard from '../ElectronicCard/ElectronicCard';
import api from '../../services/api';
import './ElectronicList.css';
import Banner from '../Banner/Banner';

const ElectronicList = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredElectronics, setFilteredElectronics] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        const data = await api.getElectronics();
        console.log("API'den Gelen Veri:", data);

        if (data.isSuccess && Array.isArray(data.result)) {
          setElectronics(data.result);
          setFilteredElectronics(data.result);
        } else {
          console.error("Beklenmeyen veri formatı:", data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Elektronik ürünler yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchElectronics();
  }, []);

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    let sorted = [...filteredElectronics];

    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        sorted.sort((a, b) => b.manufacturingYear - a.manufacturingYear);
        break;
      default:
        break;
    }

    setFilteredElectronics(sorted);
  };

  const handleFilter = (category) => {
    setActiveFilter(category);
    if (category === 'all') {
      setFilteredElectronics(electronics);
    } else {
      const filtered = electronics.filter(electronic => 
        electronic.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredElectronics(filtered);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner 
        onSearch={(term) => console.log(term)} 
        title="Elektronik Ürün Müzayedesi"
        description="En yeni elektronik ürünleri uygun fiyatlarla keşfedin."
        backgroundImage="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg"
        overlayOpacity={0.5}
      />
      
      <div className="content-wrapper">
        <div className="filters">
          <div className="filter-header">
            <h2>Elektronik Ürünler ({filteredElectronics.length})</h2>
            <select className="sort-select" value={sortBy} onChange={handleSort}>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="year-desc">Yıl (Yeniden Eskiye)</option>
            </select>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilter('all')}
            >
              Tümü
            </button>
            <button 
              className={`filter-button ${activeFilter === 'telefon' ? 'active' : ''}`}
              onClick={() => handleFilter('telefon')}
            >
              Telefon
            </button>
            <button 
              className={`filter-button ${activeFilter === 'laptop' ? 'active' : ''}`}
              onClick={() => handleFilter('laptop')}
            >
              Laptop
            </button>
            <button 
              className={`filter-button ${activeFilter === 'tablet' ? 'active' : ''}`}
              onClick={() => handleFilter('tablet')}
            >
              Tablet
            </button>
            <button 
              className={`filter-button ${activeFilter === 'televizyon' ? 'active' : ''}`}
              onClick={() => handleFilter('televizyon')}
            >
              Televizyon
            </button>
            <button 
              className={`filter-button ${activeFilter === 'konsol' ? 'active' : ''}`}
              onClick={() => handleFilter('konsol')}
            >
              Oyun Konsolu
            </button>
          </div>
        </div>
        
        {filteredElectronics.length > 0 ? (
          <div className="electronics-grid">
            {filteredElectronics.map(electronic => (
              <ElectronicCard key={electronic.electronicId} electronic={electronic} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            Seçilen kriterlere uygun ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicList;
