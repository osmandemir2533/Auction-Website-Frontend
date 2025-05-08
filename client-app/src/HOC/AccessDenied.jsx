import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <h1>Erişim Reddedildi</h1>
        <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        <button onClick={() => navigate('/')} className="home-button">
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};

export default AccessDenied; 