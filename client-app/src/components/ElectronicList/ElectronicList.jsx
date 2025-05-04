import React, { useEffect, useState } from 'react';
import ElectronicCard from '../ElectronicCard/ElectronicCard';
import api from '../../services/api';
import './ElectronicList.css';
import Banner from '../Banner/Banner';
import { Link } from 'react-router-dom';

const brandList = [
  'Apple',
  'Samsung',
  'Sony',
  'Microsoft',
  'Dell',
  'HP',
  'Lenovo',
  'Canon',
  'Bose',
  'GoPro',
  'Asus',
  'Garmin',
  'Razer',
  'LG',
];

const ElectronicList = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredElectronics, setFilteredElectronics] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFilters, setShowAllFilters] = useState(false);

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        const data = await api.getElectronics();
        if (data.isSuccess && Array.isArray(data.result)) {
          setElectronics(data.result);
          setFilteredElectronics(data.result);
        } else {
          setElectronics([]);
          setFilteredElectronics([]);
        }
        setLoading(false);
      } catch (error) {
        setElectronics([]);
        setFilteredElectronics([]);
        setLoading(false);
      }
    };
    fetchElectronics();
  }, []);

  useEffect(() => {
    let filtered = [...electronics];
    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(electronic => {
        const brandMatch = (electronic.brand || '').toLowerCase().includes(searchTermLower);
        const modelMatch = (electronic.model || '').toLowerCase().includes(searchTermLower);
        const descMatch = (electronic.additionalInformation || '').toLowerCase().includes(searchTermLower);
        return brandMatch || modelMatch || descMatch;
      });
    }
    // Brand filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(electronic => (electronic.brand || '').toLowerCase() === activeFilter.toLowerCase());
    }
    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        filtered.sort((a, b) => b.manufacturingYear - a.manufacturingYear);
        break;
      default:
        break;
    }
    setFilteredElectronics(filtered);
  }, [electronics, searchTerm, activeFilter, sortBy]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilter = (brand) => {
    setActiveFilter(brand);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner 
        onSearch={handleSearch}
        title="Elektronik Ürünler"
        description="En yeni elektronik ürünleri uygun fiyatlarla keşfedin."
        backgroundImage="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg"
        overlayOpacity={0.5}
        searchPlaceholder="Marka, model veya özellik ile arama yapın..."
        category="electronic"
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
            {(showAllFilters ? brandList : brandList.slice(0, 4)).map(brand => (
              <button
                key={brand}
                className={`filter-button ${activeFilter === brand ? 'active' : ''}`}
                onClick={() => handleFilter(brand)}
              >
                {brand}
              </button>
            ))}
            {brandList.length > 4 && (
              <button 
                className={`show-more-button ${showAllFilters ? 'expanded' : ''}`}
                onClick={() => setShowAllFilters(!showAllFilters)}
              >
                {showAllFilters ? 'Daha Az Göster' : 'Daha Fazla Göster'}
                <i className={`fas fa-chevron-${showAllFilters ? 'up' : 'down'}`}></i>
              </button>
            )}
          </div>
        </div>
        
        {filteredElectronics.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              className="electronics-grid"
              style={{
                maxWidth: '1400px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
                padding: '0 0 2rem 0',
                boxSizing: 'border-box'
              }}
            >
              {filteredElectronics.map(electronic => (
                <Link to={`/electronic/${electronic.electronicId}`} key={electronic.electronicId}>
                  <ElectronicCard electronic={electronic} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results">
            {searchTerm ? 'Arama kriterlerine uygun ürün bulunamadı.' : 'Henüz hiç elektronik ürün ilanı bulunmamaktadır.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicList;
