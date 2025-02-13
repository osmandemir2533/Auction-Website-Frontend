import React, { useState } from 'react';
import Container from '../Container/Container';
import './Banner.css';

const Banner = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="banner">
      <Container>
        <div className="banner-content">
          <h1>Premium Araç Açık Artırması</h1>
          <p>Türkiye'nin en prestijli araçları, güvenilir açık artırma platformunda</p>
          <div className="search-container">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Marka, model veya yıl ile arama yapın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-search"></i>
                Ara
              </button>
            </form>
          </div>
          <div className="quick-filters">
            <button>Mercedes-Benz</button>
            <button>BMW</button>
            <button>Audi</button>
            <button>Porsche</button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Banner; 