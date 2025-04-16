import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium' }) => {
  return (
    <div className={`loader-container ${size}`}>
      <div className="loader"></div>
      <p>Yükleniyor...</p>
    </div>
  );
};

export default Loader; 