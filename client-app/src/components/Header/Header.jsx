import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCar, FaMusic, FaLaptop, FaHome, FaTshirt, FaQuestionCircle } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { name: "Araçlar", path: "/vehicle", icon: <FaCar />, className: "vehicle-link" },
    { name: "Müzik Aletleri", path: "/music", icon: <FaMusic />, className: "music-link" },
    { name: "Elektronik", path: "/electronic", icon: <FaLaptop />, className: "electronic-link" },
    { name: "Emlak", path: "/estate", icon: <FaHome />, className: "estate-link" },
    { name: "Kıyafetler", path: "/dress", icon: <FaTshirt />, className: "dress-link" }
  ];

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
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={category.path} 
              className={`nav-link category-link ${category.className}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-text">{category.name}</span>
            </Link>
          ))}
          
          <Link to="/how-it-works" className="nav-link how-it-works-link">
            <span className="how-it-works-icon"><FaQuestionCircle /></span>
            <span className="how-it-works-text">Nasıl Çalışır?</span>
          </Link>
          
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
