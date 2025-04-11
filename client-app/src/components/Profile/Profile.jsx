import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profil Bilgileri</h2>
        <div className="profile-info">
          <div className="info-item">
            <span className="label">Ad Soyad:</span>
            <span className="value">{user?.fullName}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user?.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Kullanıcı Tipi:</span>
            <span className="value">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 