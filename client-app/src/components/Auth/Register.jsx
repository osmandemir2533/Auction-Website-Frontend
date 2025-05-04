import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';
import { api } from "../../services/api";

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
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Şifre alanı değiştiğinde kontrol et
    if (e.target.name === 'password') {
      if (e.target.value.length < 6) {
        setPasswordError('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');
    
    if (formData.password.length < 6) {
      setPasswordError('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      return;
    }

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
      const response = await api.registerUser(registerData);
      if (response.isSuccess) {
        toast.success('Kayıt işlemi başarılı! Giriş yapabilirsiniz.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Hata mesajını kontrol et ve Türkçe'ye çevir
        let errorMessage = response.errorMessages ? response.errorMessages[0] : 'Kayıt başarısız. Lütfen tekrar deneyin.';
        if (errorMessage === "Username Already exist") {
          errorMessage = "Bu e-posta adresi zaten kullanımda";
        }
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error('Kayıt işlemi sırasında hata:', err);
      if (err.response && err.response.data && err.response.data.errorMessages) {
        let errorMessage = err.response.data.errorMessages[0];
        if (errorMessage === "Username Already exist") {
          errorMessage = "Bu e-posta adresi zaten kullanımda";
        }
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
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
            placeholder="En az 6 karakter"
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
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
