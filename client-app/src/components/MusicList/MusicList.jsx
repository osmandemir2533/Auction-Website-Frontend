import React, { useEffect, useState } from 'react';
import MusicCard from '../MusicCard/MusicCard';
import api from '../../services/api';
import './MusicList.css';
import Banner from '../Banner/Banner';

const MusicList = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const data = await api.getMusicalInstruments();
        console.log("API'den Gelen Veri:", data);

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
          console.error("Beklenmeyen veri formatı:", data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Enstrümanlar yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  useEffect(() => {
    let filtered = [...instruments];

    // Search filter
    if (searchTerm) {
      console.log("Arama terimi:", searchTerm);
      filtered = filtered.filter(instrument => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // İsim kontrolü
        const nameMatch = (instrument.name || '').toLowerCase().includes(searchTermLower);
        
        // Marka kontrolü
        const brandMatch = (instrument.brand || '').toLowerCase().includes(searchTermLower);
        
        // Açıklama kontrolü
        const descMatch = (instrument.description || '').toLowerCase().includes(searchTermLower);
        
        console.log("Enstrüman:", instrument.name, "Eşleşme:", { 
          nameMatch, 
          brandMatch, 
          descMatch
        });
        
        return nameMatch || brandMatch || descMatch;
      });
    }

    // Brand filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(instrument => 
        instrument.brand.toLowerCase().includes(activeFilter.toLowerCase())
      );
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
          <button 
            className={`filter-button ${activeFilter === 'yamaha' ? 'active' : ''}`}
            onClick={() => handleFilter('yamaha')}
          >
            Yamaha
          </button>
          <button 
            className={`filter-button ${activeFilter === 'fender' ? 'active' : ''}`}
            onClick={() => handleFilter('fender')}
          >
            Fender
          </button>
          <button 
            className={`filter-button ${activeFilter === 'gibson' ? 'active' : ''}`}
            onClick={() => handleFilter('gibson')}
          >
            Gibson
          </button>
        </div>

        {filteredInstruments.length > 0 ? (
          <div className="instruments-grid">
            {filteredInstruments.map(instrument => (
              <MusicCard key={instrument.instrumentId} instrument={instrument} />
            ))}
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
