import React, { useEffect, useState } from 'react';
import VehicleCard from '../VehicleCard/VehicleCard';
import api from '../../services/api';
import './VehicleList.css';
import Container from '../Container/Container';
import Banner from '../Banner/Banner';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-asc');
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await api.getVehicles();
        console.log("API'den Gelen Veri:", data); // Debug amaçlı log

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

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    let sorted = [...filteredVehicles];

    switch (value) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        sorted.sort((a, b) => b.manufacturingYear - a.manufacturingYear);
        break;
      default:
        break;
    }

    setFilteredVehicles(sorted);
  };

  const handleFilter = (brand) => {
    setActiveFilter(brand);
    if (brand === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter(vehicle => 
        vehicle.brandAndModel.toLowerCase().includes(brand.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <Container>
      <div className="vehicle-list">
        <Banner 
          onSearch={(term) => console.log(term)} 
          title="Açık Artırmalar Başladı!"
          description="Hayalinizdeki ürünü en iyi fiyatla yakalayın."
          backgroundImage="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
          overlayOpacity={0.5}
        />
        
        <div className="filters">
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
              className={`filter-button ${activeFilter === 'toyota' ? 'active' : ''}`}
              onClick={() => handleFilter('toyota')}
            >
              Toyota
            </button>
            <button 
              className={`filter-button ${activeFilter === 'mercedes' ? 'active' : ''}`}
              onClick={() => handleFilter('mercedes')}
            >
              Mercedes
            </button>
            <button 
              className={`filter-button ${activeFilter === 'bmw' ? 'active' : ''}`}
              onClick={() => handleFilter('bmw')}
            >
              BMW
            </button>
            <button 
              className={`filter-button ${activeFilter === 'audi' ? 'active' : ''}`}
              onClick={() => handleFilter('audi')}
            >
              Audi
            </button>
            <button 
              className={`filter-button ${activeFilter === 'porsche' ? 'active' : ''}`}
              onClick={() => handleFilter('porsche')}
            >
              Porsche
            </button>
          </div>
        </div>
        
        {filteredVehicles.length > 0 ? (
          <div className="vehicles-grid">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            Seçilen kriterlere uygun araç bulunamadı.
          </div>
        )}
      </div>
    </Container>
  );
};

export default VehicleList;
