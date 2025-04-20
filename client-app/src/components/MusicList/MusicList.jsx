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

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const data = await api.getMusicalInstruments();
        console.log("API'den Gelen Veri:", data);

        if (data.isSuccess && Array.isArray(data.result)) {
          setInstruments(data.result);
          setFilteredInstruments(data.result);
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

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    let sorted = [...filteredInstruments];

    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredInstruments(sorted);
  };

  const handleFilter = (brand) => {
    setActiveFilter(brand);
    if (brand === 'all') {
      setFilteredInstruments(instruments);
    } else {
      const filtered = instruments.filter(instrument => 
        instrument.brand.toLowerCase().includes(brand.toLowerCase())
      );
      setFilteredInstruments(filtered);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="page-wrapper">
      <Banner 
        onSearch={(term) => console.log(term)} 
        title="Yeni Müzik Enstrümanları!"
        description="Müzik dünyasına adım atın, enstrümanınızı bulun."
        backgroundImage="https://www.hepsiburada.com/hayatburada/wp-content/uploads/2023/12/enstruman-tavsiyeleri.jpg"
        overlayOpacity={0.5}
      />
      
      <div className="content-wrapper">
        <div className="filters">
          <div className="filter-header">
            <h2>Enstrümanlar ({filteredInstruments.length})</h2>
            <select className="sort-select" value={sortBy} onChange={handleSort}>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="name-asc">Ad (A'dan Z'ye)</option>
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
              className={`filter-button ${activeFilter === 'Yamaha' ? 'active' : ''}`}
              onClick={() => handleFilter('Yamaha')}
            >
              Yamaha
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Fender' ? 'active' : ''}`}
              onClick={() => handleFilter('Fender')}
            >
              Fender
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Gibson' ? 'active' : ''}`}
              onClick={() => handleFilter('Gibson')}
            >
              Gibson
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Roland' ? 'active' : ''}`}
              onClick={() => handleFilter('Roland')}
            >
              Roland
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Pearl' ? 'active' : ''}`}
              onClick={() => handleFilter('Pearl')}
            >
              Pearl
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Bose' ? 'active' : ''}`}
              onClick={() => handleFilter('Bose')}
            >
              Bose
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Casio' ? 'active' : ''}`}
              onClick={() => handleFilter('Casio')}
            >
              Casio
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Ibanez' ? 'active' : ''}`}
              onClick={() => handleFilter('Ibanez')}
            >
              Ibanez
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Korg' ? 'active' : ''}`}
              onClick={() => handleFilter('Korg')}
            >
              Korg
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Ludwig' ? 'active' : ''}`}
              onClick={() => handleFilter('Ludwig')}
            >
              Ludwig
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Shure' ? 'active' : ''}`}
              onClick={() => handleFilter('Shure')}
            >
              Shure
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Sennheiser' ? 'active' : ''}`}
              onClick={() => handleFilter('Sennheiser')}
            >
              Sennheiser
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Mackie' ? 'active' : ''}`}
              onClick={() => handleFilter('Mackie')}
            >
              Mackie
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Tama' ? 'active' : ''}`}
              onClick={() => handleFilter('Tama')}
            >
              Tama
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Gretsch' ? 'active' : ''}`}
              onClick={() => handleFilter('Gretsch')}
            >
              Gretsch
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Vox' ? 'active' : ''}`}
              onClick={() => handleFilter('Vox')}
            >
              Vox
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Martin' ? 'active' : ''}`}
              onClick={() => handleFilter('Martin')}
            >
              Martin
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Peavey' ? 'active' : ''}`}
              onClick={() => handleFilter('Peavey')}
            >
              Peavey
            </button>
            <button 
              className={`filter-button ${activeFilter === 'Line 6' ? 'active' : ''}`}
              onClick={() => handleFilter('Line 6')}
            >
              Line 6
            </button>
          </div>
        </div>

        {filteredInstruments.length > 0 ? (
          <div className="instruments-grid">
            {filteredInstruments.map(instrument => (
              <MusicCard key={instrument.musicalInstrumentId} instrument={instrument} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            Seçilen kriterlere uygun enstrüman bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicList;
