import React from 'react';
import Container from '../Container/Container';
import './Banner.css';

const Banner = ({
  title = 'Premium Araç Açık Artırması',
  description = "Türkiye'nin en prestijli araçları, güvenilir açık artırma platformunda",
  backgroundImage = 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
  overlayOpacity = 0.5,
  overlayColor = 'rgba(38, 66, 137, 0.8)',  // Overlay rengi dinamik
  onSearch,
  searchPlaceholder = "Marka, model veya yıl ile arama yapın..."
}) => {
  return (
    <div 
      className="banner" 
      style={{
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="banner-overlay" style={{ background: overlayColor, opacity: overlayOpacity }}></div>
      <Container>
        <div className="banner-content">
          <h1>{title}</h1>
          <p>{description}</p>
          {onSearch && (
            <div className="search-container">
              <form onSubmit={(e) => {
                e.preventDefault();
                const searchTerm = e.target.search.value.trim();
                if (searchTerm) {
                  onSearch(searchTerm);
                } else {
                  onSearch(''); // Boş arama terimi ile tüm sonuçları göster
                }
              }}>
                <input
                  type="text"
                  name="search"
                  placeholder={searchPlaceholder}
                />
                <button type="submit">
                  <i className="fas fa-search"></i> Ara
                </button>
              </form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Banner;
