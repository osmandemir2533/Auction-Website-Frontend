import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hakkımızda</h3>
            <p>Türkiye'nin en prestijli araç açık artırma platformu. Güvenli ve şeffaf alım-satım deneyimi.</p>
          </div>
          <div className="footer-section">
            <h3>Hızlı Linkler</h3>
            <ul>
              <li><Link to="/">Ana Sayfa</Link></li>
              <li><Link to="/auctions">Açık Artırmalar</Link></li>
              <li><Link to="/how-it-works">Nasıl Çalışır</Link></li>
              <li><Link to="/contact">İletişim</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>İletişim</h3>
            <ul>
              <li>📍 İstanbul, Türkiye</li>
              <li>📞 +90 (212) 555 0123</li>
              <li>✉️ info@luxaracartirma.com</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Bizi Takip Edin</h3>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Lüks Araç Açık Artırma. Tüm hakları saklıdır.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 