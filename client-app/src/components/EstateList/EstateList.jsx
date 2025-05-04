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
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFilters, setShowAllFilters] = useState(false);

  const estateTypes = [
    'Öğrenciye Uygun 1+1',
    'Doğa İçinde Ev',
    'Boğaz Manzaralı Dubleks',
    'Uygun Fiyatlı Daire',
    'Merkezi Konumda Stüdyo',
    'Bahçeli Tripleks',
    'Yeni Projede 2+1',
    'Dağ Manzaralı Yazlık',
    'Prestijli Ofis Katı',
    'Denize Sıfır Villa',
    'Sakin Sokakta Daire',
    'Konut İmarlı Arsa',
    'Lüks Rezidans Dairesi',
    'Şehir Merkezinde Ofis',
    'Satılık Loft Daire',
    'Kiralık Depo Alanı',
    'Yatırım İçin Arsa',
  ];

  useEffect(() => {
    fetchEstates();
  }, []);

  useEffect(() => {
    let filtered = [...estates];
    console.log('Filtreleme öncesi emlaklar:', filtered);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(estate => {
        const searchTermLower = searchTerm.toLowerCase();
        const titleMatch = (estate.title || '').toLowerCase().includes(searchTermLower);
        const descMatch = (estate.description || '').toLowerCase().includes(searchTermLower);
        const addressMatch = (estate.address || '').toLowerCase().includes(searchTermLower);
        return titleMatch || descMatch || addressMatch;
      });
    }

    // Title filter
    if (activeFilter !== 'all') {
      console.log('Aktif filtre:', activeFilter);
      filtered = filtered.filter(estate => {
        console.log('Emlak başlığı:', estate.title);
        return estate.title.toLowerCase().includes(activeFilter.toLowerCase());
      });
    }

    console.log('Filtreleme sonrası emlaklar:', filtered);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'size-desc':
        filtered.sort((a, b) => (b.squareMeters || 0) - (a.squareMeters || 0));
        break;
      default:
        break;
    }

    setFilteredEstates(filtered);
  }, [estates, searchTerm, activeFilter, sortBy]);

  const fetchEstates = async () => {
    try {
      setLoading(true);
      const response = await api.getEstates();
      console.log('API Response:', response);
      
      if (response && response.isSuccess) {
        if (Array.isArray(response.result)) {
          const formattedEstates = response.result.map(estate => {
            let imageUrl = '';
            if (estate.image) {
              if (estate.image.startsWith('http')) {
                imageUrl = estate.image;
              } else if (estate.image.startsWith('data:image')) {
                imageUrl = estate.image;
              } else {
                imageUrl = `https://localhost:7282/Images/${estate.image}`;
              }
            }
            
            return {
              ...estate,
              image: imageUrl || '/images/placeholder.jpg'
            };
          });
          console.log('Formatlanmış emlaklar:', formattedEstates);
          setEstates(formattedEstates);
          setFilteredEstates(formattedEstates);
          setError(null);
        } else {
          setError('Emlak verileri geçersiz formatta.');
          setEstates([]);
          setFilteredEstates([]);
        }
      } else {
        setError('Emlak verileri alınamadı.');
        setEstates([]);
        setFilteredEstates([]);
      }
    } catch (err) {
      console.error('Error fetching estates:', err);
      setError('Emlak verileri alınamadı.');
      setEstates([]);
      setFilteredEstates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilter = (type) => {
    console.log('Filtre seçildi:', type);
    setActiveFilter(type);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
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
        onSearch={handleSearch}
        title="Emlak"
        description="Hayalinizdeki evi en iyi fiyatla yakalayın."
        backgroundImage="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
        overlayOpacity={0.5}
        searchPlaceholder="Adres, emlak tipi veya özellik ile arama yapın..."
        category="estate"
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
            <h3>Emlak Tipi</h3>
            <div className="filter-buttons">
              <button
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilter('all')}
              >
                Tümü
              </button>
              {(showAllFilters ? estateTypes : estateTypes.slice(0, 4)).map(type => (
                <button
                  key={type}
                  className={`filter-button ${activeFilter === type ? 'active' : ''}`}
                  onClick={() => handleFilter(type)}
                >
                  {type}
                </button>
              ))}
              {estateTypes.length > 4 && (
                <button
                  className="filter-button show-more-button"
                  onClick={() => setShowAllFilters(!showAllFilters)}
                >
                  {showAllFilters ? 'Daha Az Göster' : 'Daha Fazla Göster'}
                  <i className={`fas fa-chevron-${showAllFilters ? 'up' : 'down'}`}></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {filteredEstates.length > 0 ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              className="estates-grid"
              style={{
                maxWidth: '1200px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
                padding: '0 0 2rem 0',
                boxSizing: 'border-box'
              }}
            >
              {filteredEstates.map(estate => (
                <Link to={`/estate/${estate.estateId}`} key={estate.estateId}>
                  <EstateCard estate={estate} />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results">
            {searchTerm ? 'Arama kriterlerine uygun emlak bulunamadı.' : 'Henüz hiç emlak ilanı bulunmamaktadır.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstateList;