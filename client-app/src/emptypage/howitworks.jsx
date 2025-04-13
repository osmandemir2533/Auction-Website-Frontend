import React from 'react';
import { Link } from 'react-router-dom';
import './howitworks.css';
import { 
  FaUserPlus, 
  FaSearch, 
  FaHandPaper, 
  FaGavel, 
  FaCar, 
  FaCheckCircle
} from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus size={40} />,
      title: "1. Üye Olun",
      description: "Hızlı ve kolay bir şekilde ücretsiz üye olun. Kimlik doğrulama işlemini tamamlayarak güvenli alım satım deneyimine başlayın."
    },
    {
      icon: <FaSearch size={40} />,
      title: "2. Araçları İnceleyin",
      description: "Detaylı araç bilgileri, profesyonel fotoğraflar ve ekspertiz raporlarıyla araçları inceleyin."
    },
    {
      icon: <FaHandPaper size={40} />,
      title: "3. Teklif Verin",
      description: "Beğendiğiniz araçlar için online olarak teklif verin. Minimum artırım tutarı ve güncel fiyat bilgilerini takip edin."
    },
    {
      icon: <FaGavel size={40} />,
      title: "4. Açık Artırmaya Katılın",
      description: "Canlı açık artırmalara katılın ve diğer tekliflerle rekabet edin. Anlık bildirimlerle açık artırma sürecini takip edin."
    },
    {
      icon: <FaCar size={40} />,
      title: "5. Aracı Kazanın",
      description: "En yüksek teklifi vererek açık artırmayı kazandığınızda, ödeme ve araç teslim sürecine geçilir."
    },
    {
      icon: <FaCheckCircle size={40} />,
      title: "6. Güvenli Teslimat",
      description: "Ödeme sonrası profesyonel ekibimiz aracınızı istediğiniz lokasyona güvenle teslim eder."
    }
  ];

  return (
    <div className="how-it-works">
      <div className="hero-section">
        <h1>Nasıl Çalışır?</h1>
        <p>Açık Artırma platformumuzda araç alım-satım işlemlerinizi güvenle gerçekleştirin</p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <div className="step-icon">
              {step.icon}
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="advantages-section">
        <h2>Neden Bizi Tercih Etmelisiniz?</h2>
        <div className="advantages-grid">
          <div className="advantage-item">
            <h4>Güvenli Alışveriş</h4>
            <p>Güvenli ödeme sistemi ve noter tasdikli devir işlemleri</p>
          </div>
          <div className="advantage-item">
            <h4>Şeffaf Fiyatlandırma</h4>
            <p>Açık ve net fiyatlandırma, gizli maliyetsiz işlemler</p>
          </div>
          <div className="advantage-item">
            <h4>Profesyonel Destek</h4>
            <p>7/24 müşteri desteği ve uzman danışmanlık hizmeti</p>
          </div>
          <div className="advantage-item">
            <h4>Geniş Araç Ağı</h4>
            <p>Türkiye'nin en geniş ikinci el araç ağı ve seçenekleri</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Hemen Başlayın</h2>
        <p>Ücretsiz üye olun ve açık artırmalara katılmaya başlayın</p>
        <div className="cta-buttons">
          <Link to="/register" className="primary-button">Üye Ol</Link>
          <Link to="/" className="secondary-button">Açık Artırmaları Gör</Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;