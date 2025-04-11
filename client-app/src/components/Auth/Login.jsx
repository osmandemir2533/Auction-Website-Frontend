import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userName)) {
      setError('Lütfen geçerli bir email adresi giriniz!');
      return;
    }

    try {
      console.log('Login isteği gönderiliyor:', formData);

      const response = await fetch('http://localhost:5119/api/User/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login cevabı:', data);

      if (response.ok && data.isSuccess) {
        localStorage.setItem('token', data.result.token);
        localStorage.setItem('user', JSON.stringify(data.result.user));
        console.log('Login başarılı, anasayfaya yönlendiriliyor');
        navigate('/');
      } else {
        setError(data.errorMessages ? data.errorMessages[0] : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        console.log('Login hatası:', data.errorMessages);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Login işlemi sırasında hata:', err);
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
          />
        </div>

        <button type="submit">Giriş Yap</button>
        
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