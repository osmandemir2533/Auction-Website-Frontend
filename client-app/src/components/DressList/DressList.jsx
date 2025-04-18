import React, { useState, useEffect } from 'react';
import DressCard from '../DressCard/DressCard';
import { api } from '../../services/api';
import './DressList.css';
import Banner from '../Banner/Banner';

const DressList = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredDresses, setFilteredDresses] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const response = await api.getDresses();
        if (response.isSuccess && Array.isArray(response.result)) {
          setDresses(response.result);
          setFilteredDresses(response.result);
        } else {
          console.error("Beklenmeyen veri formatı:", response);
        }
      } catch (error) {
        console.error('Elbiseler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, []);

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    let sorted = [...filteredDresses];

    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'brand':
        sorted.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      default:
        break;
    }

    setFilteredDresses(sorted);
  };

  const handleFilter = (brand) => {
    setActiveFilter(brand);
    if (brand === 'all') {
      setFilteredDresses(dresses);
    } else {
      const filtered = dresses.filter(dress => 
        dress.brand.toLowerCase().includes(brand.toLowerCase())
      );
      setFilteredDresses(filtered);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner 
        onSearch={(term) => console.log(term)} 
        title="Elbise Açık Artırmaları"
        description="En şık elbiseler burada!"
        backgroundImage="https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg"
        overlayOpacity={0.5}
      />
      
      <div className="content-wrapper">
        <div className="filter-header">
          <h2>Elbiseler ({filteredDresses.length})</h2>
          <select className="sort-select" value={sortBy} onChange={handleSort}>
            <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
            <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
            <option value="brand">Marka (A-Z)</option>
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
            className={`filter-button ${activeFilter === 'zara' ? 'active' : ''}`}
            onClick={() => handleFilter('zara')}
          >
            Zara
          </button>
          <button 
            className={`filter-button ${activeFilter === 'hm' ? 'active' : ''}`}
            onClick={() => handleFilter('h&m')}
          >
            H&M
          </button>
          <button 
            className={`filter-button ${activeFilter === 'mango' ? 'active' : ''}`}
            onClick={() => handleFilter('mango')}
          >
            Mango
          </button>
        </div>
      </div>
      
      {filteredDresses.length > 0 ? (
        <div className="dresses-grid">
          {filteredDresses.map(dress => (
            <DressCard key={dress.dressId} dress={dress} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          Seçilen kriterlere uygun elbise bulunamadı.
        </div>
      )}
    </div>
  );
};

export default DressList; 