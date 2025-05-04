import React, { useEffect, useState, useCallback } from 'react';
import VehicleCard from '../VehicleCard/VehicleCard';
import api from '../../services/api';
import './VehicleList.css';
import Banner from '../Banner/Banner';
import { Link } from 'react-router-dom';

const brandList = [
  'McLaren 720S',
  'Koenigsegg Jesko',
  'Ferrari SF90 Stradale',
  'Pagani Huayra',
  'Lexus LC 500',
  'Ford Mustang Shelby GT500',
  'Porsche Cayman GT4',
  'TOGG T10X',
  'Honda Civic',
  'Tesla Model S',
  'Audi R8',
  'Mercedes-AMG GT',
  'Nissan GT-R',
  'Bugatti Chiron',
  'Ferrari',
];

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getVehicles();
      
      if (response.isSuccess && response.result) {
        const formattedVehicles = response.result.map(vehicle => {
          let imageUrl = '';
          if (vehicle.image) {
            if (vehicle.image.startsWith('http')) {
              imageUrl = vehicle.image;
            } else if (vehicle.image.startsWith('data:image')) {
              imageUrl = vehicle.image;
            } else {
              imageUrl = `https://localhost:7282/Images/${vehicle.image}`;
            }
          }
          
          return {
            ...vehicle,
            imageUrl: imageUrl || '/images/placeholder.jpg',
            status: vehicle.status || 'Inactive',
            endDate: vehicle.endDate || null
          };
        });
        setVehicles(formattedVehicles);
        setFilteredVehicles(formattedVehicles);
      } else {
        setError('Araçlar yüklenirken bir hata oluştu');
        setVehicles([]);
      }
    } catch (err) {
      setError('Araçlar yüklenirken bir hata oluştu');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    let filtered = [...vehicles];

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle => {
        // Marka ve Model kontrolü
        const brandModelMatch = (vehicle.brandAndModel || '').toLowerCase().includes(searchTermLower);
        // Üretim Yılı kontrolü
        const yearMatch = (vehicle.manufacturingYear || '').toString().includes(searchTerm);
        // Renk kontrolü
        const colorMatch = (vehicle.color || '').toLowerCase().includes(searchTermLower);
        // Ek bilgi kontrolü
        const infoMatch = (vehicle.additionalInformation || '').toLowerCase().includes(searchTermLower);
        return brandModelMatch || yearMatch || colorMatch || infoMatch;
      });
    }

    // Brand filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(vehicle => (vehicle.brandAndModel || '').toLowerCase() === activeFilter.toLowerCase());
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
        title="Araçlar"
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

        {filteredVehicles.length > 0 ? (
          <div className="vehicles-grid">
            {filteredVehicles.map(vehicle => (
              <Link to={`/vehicle/${vehicle.vehicleId}`} key={vehicle.vehicleId}>
                <VehicleCard vehicle={vehicle} />
              </Link>
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