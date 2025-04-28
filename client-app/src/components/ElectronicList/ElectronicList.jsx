import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ElectronicCard from '../ElectronicCard/ElectronicCard';
import Banner from '../Banner/Banner';
import api from '../../services/api';
import './ElectronicList.css';

const ElectronicList = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price-asc');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchElectronics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getElectronics();
      
      if (response.isSuccess && response.result) {
        const formattedElectronics = response.result.map(electronic => ({
          ...electronic,
          imageUrl: electronic.imageUrl || '/images/placeholder.jpg',
          features: electronic.features || [],
          status: electronic.status || 'Inactive',
          endDate: electronic.endDate || null
        }));
        
        setElectronics(formattedElectronics);
      } else {
        setError('Elektronik ürünler yüklenirken bir hata oluştu');
        setElectronics([]);
      }
    } catch (err) {
      setError('Elektronik ürünler yüklenirken bir hata oluştu');
      console.error('Error fetching electronics:', err);
      setElectronics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchElectronics();
  }, [fetchElectronics]);

  const handleSort = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleFilter = useCallback((brand) => {
    setActiveFilter(brand);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const filteredAndSortedElectronics = useMemo(() => {
    let result = [...electronics];
    
    // Search filter
    if (searchTerm) {
      console.log("Arama terimi:", searchTerm);
      result = result.filter(electronic => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // Marka kontrolü
        const brandMatch = (electronic.brand || '').toLowerCase().includes(searchTermLower);
        
        // Model kontrolü
        const modelMatch = (electronic.model || '').toLowerCase().includes(searchTermLower);
        
        // Üretim Yılı kontrolü
        const yearMatch = electronic.manufacturingYear.toString().includes(searchTerm);
        
        // Ek bilgi kontrolü
        const infoMatch = (electronic.additionalInformation || '').toLowerCase().includes(searchTermLower);
        
        console.log("Elektronik:", electronic.brand, "Eşleşme:", { 
          brandMatch, 
          modelMatch, 
          yearMatch,
          infoMatch
        });
        
        return brandMatch || modelMatch || yearMatch || infoMatch;
      });
    }
    
    // Brand filter
    if (activeFilter !== 'all') {
      result = result.filter(electronic => electronic.brand === activeFilter);
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.currentPrice || a.startingPrice || 0) - (b.currentPrice || b.startingPrice || 0);
      } else if (sortBy === 'price-desc') {
        return (b.currentPrice || b.startingPrice || 0) - (a.currentPrice || a.startingPrice || 0);
      } else if (sortBy === 'year-asc') {
        return (a.manufacturingYear || 0) - (b.manufacturingYear || 0);
      } else if (sortBy === 'year-desc') {
        return (b.manufacturingYear || 0) - (a.manufacturingYear || 0);
      }
      return 0;
    });
    
    return result;
  }, [electronics, searchTerm, activeFilter, sortBy]);

  const uniqueBrands = useMemo(() => 
    [...new Set(electronics.map(e => e.brand))].filter(Boolean),
    [electronics]
  );

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner
        onSearch={handleSearch}
        title="Elektronik Ürünler"
        description="En yeni elektronik ürünleri en iyi fiyatlarla yakalayın"
        backgroundImage="/images/electronics-banner.jpg"
        overlayOpacity={0.5}
        searchPlaceholder="Marka, model veya özellik ile arama yapın..."
      />
      <div className="content-wrapper">
        <div className="filters">
          <div className="filter-header">
            <h2>Bulunan {filteredAndSortedElectronics.length} Elektronik Ürün</h2>
            <select className="sort-select" value={sortBy} onChange={handleSort}>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="year-asc">Yıl (Eskiden Yeniye)</option>
              <option value="year-desc">Yıl (Yeniden Eskiye)</option>
            </select>
          </div>

          <div className="filter-section">
            <h3>Marka</h3>
            <div className="filter-buttons">
              <button
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilter('all')}
              >
                Tümü
              </button>
              {uniqueBrands.map(brand => (
                <button
                  key={brand}
                  className={`filter-button ${activeFilter === brand ? 'active' : ''}`}
                  onClick={() => handleFilter(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredAndSortedElectronics.length === 0 ? (
          <div className="no-results">
            {searchTerm ? 'Arama kriterlerine uygun ürün bulunamadı.' : 'Henüz hiç elektronik ürün ilanı bulunmamaktadır.'}
          </div>
        ) : (
          <div className="electronics-grid">
            {filteredAndSortedElectronics.map(electronic => (
              <ElectronicCard key={electronic.electronicId} electronic={electronic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ElectronicList); 