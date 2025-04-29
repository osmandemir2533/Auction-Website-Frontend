import React, { useState, useEffect, useCallback } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchDresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getDresses();
      
      if (response.isSuccess && response.result) {
        const formattedDresses = response.result.map(dress => {
          let imageUrl = '';
          if (dress.image) {
            if (dress.image.startsWith('http')) {
              imageUrl = dress.image;
            } else if (dress.image.startsWith('data:image')) {
              imageUrl = dress.image;
            } else {
              imageUrl = `https://localhost:7282/Images/${dress.image}`;
            }
          }
          
          return {
            ...dress,
            imageUrl: imageUrl || '/images/placeholder.jpg',
            status: dress.status || 'Inactive',
            endDate: dress.endDate || null
          };
        });
        
        setDresses(formattedDresses);
      } else {
        setError('Giyim ürünleri yüklenirken bir hata oluştu');
        setDresses([]);
      }
    } catch (err) {
      setError('Giyim ürünleri yüklenirken bir hata oluştu');
      console.error('Error fetching dresses:', err);
      setDresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDresses();
  }, [fetchDresses]);

  useEffect(() => {
    let filtered = [...dresses];

    // Search filter
    if (searchTerm) {
      console.log("Arama terimi:", searchTerm);
      filtered = filtered.filter(dress => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // Marka kontrolü
        const brandMatch = (dress.brand || '').toLowerCase().includes(searchTermLower);
        
        // Tür kontrolü
        const typeMatch = (dress.type || '').toLowerCase().includes(searchTermLower);
        
        // Materyal kontrolü
        const materialMatch = (dress.material || '').toLowerCase().includes(searchTermLower);
        
        // Renk kontrolü
        const colorMatch = (dress.color || '').toLowerCase().includes(searchTermLower);
        
        // Ek bilgi kontrolü
        const infoMatch = (dress.additionalInformation || '').toLowerCase().includes(searchTermLower);
        
        console.log("Elbise:", dress.brand, "Eşleşme:", { 
          brandMatch, 
          typeMatch, 
          materialMatch,
          colorMatch,
          infoMatch
        });
        
        return brandMatch || typeMatch || materialMatch || colorMatch || infoMatch;
      });
    }

    // Brand filter
    if (activeFilter !== 'all') {
      console.log("Aktif filtre:", activeFilter);
      filtered = filtered.filter(dress => {
        const brandMatch = (dress.brand || '').toLowerCase().includes(activeFilter.toLowerCase());
        console.log("Elbise:", dress.brand, "Marka eşleşmesi:", brandMatch);
        return brandMatch;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'brand':
        filtered.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
        break;
      default:
        break;
    }

    console.log("Filtrelenmiş elbiseler:", filtered);
    setFilteredDresses(filtered);
  }, [dresses, searchTerm, activeFilter, sortBy]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilter = (brand) => {
    console.log("Filtre değişti:", brand);
    setActiveFilter(brand);
  };

  const handleSearch = (term) => {
    console.log("Arama terimi değişti:", term);
    setSearchTerm(term);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner 
        onSearch={handleSearch}
        title="Elbise Açık Artırmaları"
        description="En şık elbiseler burada!"
        backgroundImage="https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg"
        overlayOpacity={0.5}
        searchPlaceholder="Marka, tür veya materyal ile arama yapın..."
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

        {filteredDresses.length > 0 ? (
          <div className="dresses-grid">
            {filteredDresses.map(dress => (
              <DressCard key={dress.dressId} dress={dress} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            {searchTerm ? 'Arama kriterlerine uygun elbise bulunamadı.' : 'Henüz hiç elbise ilanı bulunmamaktadır.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DressList; 