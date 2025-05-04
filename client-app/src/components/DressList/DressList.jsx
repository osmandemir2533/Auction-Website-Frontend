import React, { useState, useEffect, useCallback } from 'react';
import DressCard from '../DressCard/DressCard';
import { api } from '../../services/api';
import './DressList.css';
import Banner from '../Banner/Banner';
import { Link } from 'react-router-dom';

const dressTypes = [
  'Elbise',
  'Ceket',
  'Kot Ceket',
  'Etek',
  'Pantolon',
  'Gömlek',
  'Mont',
];

const DressList = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredDresses, setFilteredDresses] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showAllFilters, setShowAllFilters] = useState(false);

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
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(dress => {
        // Tür kontrolü
        const typeMatch = (dress.type || '').toLowerCase().includes(searchTermLower);
        // Materyal kontrolü
        const materialMatch = (dress.material || '').toLowerCase().includes(searchTermLower);
        // Renk kontrolü
        const colorMatch = (dress.color || '').toLowerCase().includes(searchTermLower);
        // Ek bilgi kontrolü
        const infoMatch = (dress.additionalInformation || '').toLowerCase().includes(searchTermLower);
        return typeMatch || materialMatch || colorMatch || infoMatch;
      });
    }

    // Type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(dress => {
        return (dress.type || '').toLowerCase() === activeFilter.toLowerCase();
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
      default:
        break;
    }

    setFilteredDresses(filtered);
  }, [dresses, searchTerm, activeFilter, sortBy]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilter = (type) => {
    setActiveFilter(type);
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
        title="Kıyafetler"
        description="En şık kıyafetler burada!"
        backgroundImage="https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg"
        overlayOpacity={0.5}
        searchPlaceholder="Tür, materyal veya renk ile arama yapın..."
      />
      
      <div className="content-wrapper">
        <div className="filter-header">
          <h2>Elbiseler ({filteredDresses.length})</h2>
          <select className="sort-select" value={sortBy} onChange={handleSort}>
            <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
            <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
          </select>
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilter('all')}
          >
            Tümü
          </button>
          {(showAllFilters ? dressTypes : dressTypes.slice(0, 4)).map(type => (
            <button
              key={type}
              className={`filter-button ${activeFilter === type ? 'active' : ''}`}
              onClick={() => handleFilter(type)}
            >
              {type}
            </button>
          ))}
          {dressTypes.length > 4 && (
            <button 
              className={`show-more-button ${showAllFilters ? 'expanded' : ''}`}
              onClick={() => setShowAllFilters(!showAllFilters)}
            >
              {showAllFilters ? 'Daha Az Göster' : 'Daha Fazla Göster'}
              <i className={`fas fa-chevron-${showAllFilters ? 'up' : 'down'}`}></i>
            </button>
          )}
        </div>

        {filteredDresses.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              className="dresses-grid"
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
              {filteredDresses.map(dress => (
                <Link to={`/dress/${dress.dressId}`} key={dress.dressId}>
                  <DressCard dress={dress} />
                </Link>
              ))}
            </div>
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