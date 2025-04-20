import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EstateCard from '../EstateCard/EstateCard';
import api from '../../services/api';
import './EstateList.css';
import Banner from '../Banner/Banner';

const EstateList = () => {
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredEstates, setFilteredEstates] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchEstates();
  }, []);

  const fetchEstates = async () => {
    try {
      setLoading(true);
      const response = await api.getEstates();
      console.log('API Response:', response);
      
      if (response && response.isSuccess) {
        console.log('Estates data:', response.result);
        if (Array.isArray(response.result)) {
          setEstates(response.result);
          setFilteredEstates(response.result);
          setError(null);
        } else {
          console.error('Invalid estates data format:', response.result);
          setError('Emlak verileri geçersiz formatta. Lütfen daha sonra tekrar deneyin.');
          setEstates([]);
          setFilteredEstates([]);
        }
      } else {
        console.error('API Error:', response?.error || 'Bilinmeyen hata');
        setError(response?.error || 'Emlak verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
        setEstates([]);
        setFilteredEstates([]);
      }
    } catch (err) {
      console.error('Error fetching estates:', err);
      setError('Emlak verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
      setEstates([]);
      setFilteredEstates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    let sorted = [...filteredEstates];

    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'size-desc':
        sorted.sort((a, b) => (b.squareMeters || 0) - (a.squareMeters || 0));
        break;
      default:
        break;
    }

    setFilteredEstates(sorted);
  };

  const handleFilter = (type) => {
    setActiveFilter(type);
    applyFilters(type, typeFilter);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    applyFilters(activeFilter, type);
  };

  const applyFilters = (activeStatus, estateType) => {
    let filtered = [...estates];
    
    // Apply active/inactive filter
    if (activeStatus !== 'all') {
      filtered = filtered.filter(estate => estate.isActive === (activeStatus === 'active'));
    }
    
    // Apply estate type filter
    if (estateType !== 'all') {
      filtered = filtered.filter(estate => {
        const estateTypeLower = estate.type?.toLowerCase();
        const filterTypeLower = estateType.toLowerCase();
        return estateTypeLower === filterTypeLower;
      });
    }
    
    setFilteredEstates(filtered);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner 
        onSearch={(term) => console.log(term)}
        title="Emlak Açık Artırmaları"
        description="Hayalinizdeki evi en iyi fiyatla yakalayın."
        backgroundImage="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
        overlayOpacity={0.5}
      />
      
      <div className="content-wrapper">
        <div className="filters">
          <div className="filter-header">
            <h2>Emlaklar ({filteredEstates.length})</h2>
            <select className="sort-select" value={sortBy} onChange={handleSort}>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="size-desc">Büyüklük (Büyükten Küçüğe)</option>
            </select>
          </div>
          
          <div className="filter-section">
            <h3>Durum</h3>
            <div className="filter-buttons">
              <button
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => handleFilter('all')}
              >
                Tümü
              </button>
              <button
                className={activeFilter === 'active' ? 'active' : ''}
                onClick={() => handleFilter('active')}
              >
                Aktif
              </button>
              <button
                className={activeFilter === 'inactive' ? 'active' : ''}
                onClick={() => handleFilter('inactive')}
              >
                Pasif
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>Emlak Tipi</h3>
            <div className="filter-buttons">
              <button
                className={typeFilter === 'all' ? 'active' : ''}
                onClick={() => handleTypeFilter('all')}
              >
                Tümü
              </button>
              <button
                className={typeFilter === 'villa' ? 'active' : ''}
                onClick={() => handleTypeFilter('villa')}
              >
                Villa
              </button>
              <button
                className={typeFilter === 'apartment' ? 'active' : ''}
                onClick={() => handleTypeFilter('apartment')}
              >
                Daire
              </button>
              <button
                className={typeFilter === 'land' ? 'active' : ''}
                onClick={() => handleTypeFilter('land')}
              >
                Arsa
              </button>
              <button
                className={typeFilter === 'commercial' ? 'active' : ''}
                onClick={() => handleTypeFilter('commercial')}
              >
                Ticari
              </button>
            </div>
          </div>
        </div>
        
        {filteredEstates.length > 0 ? (
          <div className="estates-grid">
            {filteredEstates.map(estate => (
              <Link to={`/estate/${estate.estateId}`} key={estate.estateId}>
                <EstateCard estate={estate} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-results">
            {estates.length === 0 ? (
              'Henüz hiç emlak ilanı bulunmamaktadır.'
            ) : (
              'Seçtiğiniz filtrelere uygun emlak bulunamadı. Lütfen farklı filtreler deneyin.'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstateList; 