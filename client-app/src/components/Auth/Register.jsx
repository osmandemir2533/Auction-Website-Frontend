import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    userType: 'Normal'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userName)) {
      setError('Lütfen geçerli bir email adresi giriniz!');
      return;
    }

    const registerData = {
      userName: formData.userName,
      fullName: formData.fullName,
      password: formData.password,
      userType: formData.userType
    };

    try {
      const response = await fetch('http://localhost:5119/api/User/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.errorMessages ? data.errorMessages[0] : 'Kayıt başarısız. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            placeholder="ornek@email.com"
          />
        </div>

        <div className="form-group">
          <label>Ad Soyad:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Ad Soyad"
          />
        </div>

        <div className="form-group">
          <label>Kullanıcı Tipi:</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
          >
            <option value="Normal">Normal Kullanıcı</option>
            <option value="Seller">Satıcı</option>
            <option value="Administrator">Yönetici</option>
          </select>
        </div>

        <div className="form-group">
          <label>Şifre:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Şifreniz"
          />
        </div>

        <div className="form-group">
          <label>Şifre Tekrar:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Şifrenizi tekrar girin"
          />
        </div>

        <button type="submit">Kayıt Ol</button>
        
        <p>
          Zaten hesabınız var mı?{' '}
          <span onClick={() => navigate('/login')} className="auth-link">
            Giriş Yap
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register; 