import React, { useEffect, useState } from 'react';
import VehicleCard from '../VehicleCard/VehicleCard';
import api from '../../services/api';
import './VehicleList.css';
import Banner from '../Banner/Banner';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await api.getVehicles();
        console.log("API'den Gelen Veri:", data);

        if (data.isSuccess && Array.isArray(data.result)) {
          setVehicles(data.result);
          setFilteredVehicles(data.result);
        } else {
          console.error("Beklenmeyen veri formatı:", data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Araçlar yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      console.log("Arama terimi:", searchTerm);
      filtered = filtered.filter(vehicle => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // Marka ve Model kontrolü
        const brandModelMatch = (vehicle.brandAndModel || '').toLowerCase().includes(searchTermLower);
        
        // Üretim Yılı kontrolü
        const yearMatch = vehicle.manufacturingYear.toString().includes(searchTerm);
        
        // Renk kontrolü
        const colorMatch = (vehicle.color || '').toLowerCase().includes(searchTermLower);
        
        // Ek bilgi kontrolü
        const infoMatch = (vehicle.additionalInformation || '').toLowerCase().includes(searchTermLower);
        
        console.log("Araç:", vehicle.brandAndModel, "Eşleşme:", { 
          brandModelMatch, 
          yearMatch, 
          colorMatch,
          infoMatch
        });
        
        return brandModelMatch || yearMatch || colorMatch || infoMatch;
      });
    }

    // Brand filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(vehicle => 
        vehicle.brandAndModel.toLowerCase().includes(activeFilter.toLowerCase())
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
      case 'year-desc':
        filtered.sort((a, b) => b.manufacturingYear - a.manufacturingYear);
        break;
      default:
        break;
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, activeFilter, sortBy]);

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
        title="Araç Açık Artırmaları"
        description="Hayalinizdeki aracı en iyi fiyatla yakalayın."
        backgroundImage="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
        overlayOpacity={0.5}
        searchPlaceholder="Marka, model veya yıl ile arama yapın..."
      />
      
      <div className="content-wrapper">
        <div className="filter-header">
          <h2>Araçlar ({filteredVehicles.length})</h2>
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
          <button 
            className={`filter-button ${activeFilter === 'bmw' ? 'active' : ''}`}
            onClick={() => handleFilter('bmw')}
          >
            BMW
          </button>
          <button 
            className={`filter-button ${activeFilter === 'mercedes' ? 'active' : ''}`}
            onClick={() => handleFilter('mercedes')}
          >
            Mercedes
          </button>
          <button 
            className={`filter-button ${activeFilter === 'audi' ? 'active' : ''}`}
            onClick={() => handleFilter('audi')}
          >
            Audi
          </button>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="vehicles-grid">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            {searchTerm ? 'Arama kriterlerine uygun araç bulunamadı.' : 'Henüz hiç araç ilanı bulunmamaktadır.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;