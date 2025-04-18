import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    toast.info('Çıkış yapıldı. Yönlendiriliyorsunuz...', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Kullanıcı rolüne göre yönlendirme
  const getDashboardLink = () => {
    if (user && user.role) {
      if (user.role === 'Administrator') return '/dashboard/admin';
      if (user.role === 'Seller') return '/dashboard/seller';
      if (user.role === 'Normal') return '/dashboard/user';
    }
    return '/dashboard';
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
          
          <Link to="/auctions" className="nav-link">Açık Arttırmalar</Link>

          <Link to="/how-it-works" className="nav-link">Nasıl Çalışır?</Link>
          
          {user ? (
            <div className="user-profile">
              <Link to={getDashboardLink()} className="nav-link">
                <i className="fas fa-tachometer-alt"></i> {user.fullName}'in Paneli
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
