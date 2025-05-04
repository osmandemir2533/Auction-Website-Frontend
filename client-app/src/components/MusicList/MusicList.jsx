import React, { useEffect, useState } from 'react';
import MusicCard from '../MusicCard/MusicCard';
import api from '../../services/api';
import './MusicList.css';
import Banner from '../Banner/Banner';
import { Link } from 'react-router-dom';

const brandList = [
  'Korg',
  'Shure',
  'Sennheiser',
  'Mackie',
  'Tama',
  'Roland',
  'Gretsch',
  'Vox',
  'Martin',
  'Peavey',
  'Line 6',
  'Pearl',
  'Yamaha',
  'Fender',
  'Bose',
  'Casio',
  'Ibanez',
];

const MusicList = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFilters, setShowAllFilters] = useState(false);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const data = await api.getMusicalInstruments();
        if (data.isSuccess && Array.isArray(data.result)) {
          const formattedInstruments = data.result.map(instrument => {
            let imageUrl = '';
            if (instrument.image) {
              if (instrument.image.startsWith('http')) {
                imageUrl = instrument.image;
              } else if (instrument.image.startsWith('data:image')) {
                imageUrl = instrument.image;
              } else {
                imageUrl = `https://localhost:7282/Images/${instrument.image}`;
              }
            }
            return {
              ...instrument,
              image: imageUrl || '/images/placeholder.jpg'
            };
          });
          setInstruments(formattedInstruments);
          setFilteredInstruments(formattedInstruments);
        } else {
          setInstruments([]);
          setFilteredInstruments([]);
        }
        setLoading(false);
      } catch (error) {
        setInstruments([]);
        setFilteredInstruments([]);
        setLoading(false);
      }
    };
    fetchInstruments();
  }, []);

  useEffect(() => {
    let filtered = [...instruments];
    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(instrument => {
        const nameMatch = (instrument.name || '').toLowerCase().includes(searchTermLower);
        const brandMatch = (instrument.brand || '').toLowerCase().includes(searchTermLower);
        const descMatch = (instrument.description || '').toLowerCase().includes(searchTermLower);
        return nameMatch || brandMatch || descMatch;
      });
    }
    // Brand filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(instrument => (instrument.brand || '').toLowerCase() === activeFilter.toLowerCase());
    }
    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    setFilteredInstruments(filtered);
  }, [instruments, searchTerm, activeFilter, sortBy]);

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
        title="Müzik Enstrümanları"
        description="Müzik dünyasına adım atın, enstrümanınızı bulun."
        backgroundImage="https://www.hepsiburada.com/hayatburada/wp-content/uploads/2023/12/enstruman-tavsiyeleri.jpg"
        overlayOpacity={0.5}
        searchPlaceholder="Enstrüman adı, marka veya özellik ile arama yapın..."
      />
      
      <div className="content-wrapper">
        <div className="filter-header">
          <h2>Enstrümanlar ({filteredInstruments.length})</h2>
          <select className="sort-select" value={sortBy} onChange={handleSort}>
            <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
            <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
            <option value="name-asc">İsim (A-Z)</option>
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

        {filteredInstruments.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              className="instruments-grid"
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
              {filteredInstruments.map(instrument => (
                <Link to={`/music/${instrument.instrumentId}`} key={instrument.instrumentId}>
                  <MusicCard instrument={instrument} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results">
            {searchTerm ? 'Arama kriterlerine uygun enstrüman bulunamadı.' : 'Henüz hiç enstrüman ilanı bulunmamaktadır.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicList;
