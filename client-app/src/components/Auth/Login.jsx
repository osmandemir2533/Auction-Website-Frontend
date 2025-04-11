import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import { api } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userName)) {
      setError('Lütfen geçerli bir email adresi giriniz!');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login isteği gönderiliyor:', formData);
      const response = await api.loginUser(formData);
      console.log('Login cevabı:', response);

      if (response.isSuccess) {
        login(response.result.token);
        localStorage.setItem('user', JSON.stringify(response.result.user));
        console.log('Login başarılı, anasayfaya yönlendiriliyor');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(response.errorMessages ? response.errorMessages[0] : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        console.log('Login hatası:', response.errorMessages);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Login işlemi sırasında hata:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
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
            disabled={isLoading}
          />
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
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="loader">
              <div className="spinner"></div>
              Giriş Yapılıyor...
            </div>
          ) : (
            'Giriş Yap'
          )}
        </button>

        <p>
          Hesabınız yok mu?{' '}
          <span onClick={() => navigate('/register')} className="auth-link">
            Kayıt Ol
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
