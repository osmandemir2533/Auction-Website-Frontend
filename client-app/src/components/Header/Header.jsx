import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className={`header ${!isVisible ? 'header-hidden' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">Açık<span className="highlight">Artırma</span></span>
          </Link>
        </div>
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Ana Sayfa</Link>
          <Link to="/auctions" className="nav-link">Açık Artırmalar</Link>
          <Link to="/how-it-works" className="nav-link">Nasıl Çalışır?</Link>
          {user?.role === 'Administrator' ? (
            <div className="user-profile">
              <Link to="/admin" className="nav-link">
                <i className="fas fa-user-shield"></i> Admin Panel
              </Link>
              <Link to="/profile" className="nav-link user-name">
                <i className="fas fa-user"></i> {user.fullName}
              </Link>
              <button onClick={handleLogout} className="nav-link logout">
                <i className="fas fa-sign-out-alt"></i> Çıkış Yap
              </button>
            </div>
          ) : user ? (
            <div className="user-profile">
              <Link to="/profile" className="nav-link user-name">
                <i className="fas fa-user"></i> {user.fullName}
              </Link>
              <button onClick={handleLogout} className="nav-link logout">
                <i className="fas fa-sign-out-alt"></i> Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link login">Giriş Yap</Link>
              <Link to="/register" className="nav-link register">Üye Ol</Link>
            </div>
          )}
        </nav>
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </header>
  );
};

export default Header; 