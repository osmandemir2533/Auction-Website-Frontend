import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';
import { api } from "../../services/api";
import { jwtDecode } from 'jwt-decode';

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
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userName)) {
      setError('Lütfen geçerli bir email adresi giriniz!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.loginUser(formData);
      if (response.isSuccess) {
        const token = response.result.token;
        login(token);

        const decoded = jwtDecode(token);
        const role = decoded.role;

        localStorage.setItem('user', JSON.stringify(response.result.user));
        
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Rol bazlı yönlendirme
        let redirectPath = '/';
        if (role === 'Administrator') redirectPath = '/';
        else if (role === 'Seller') redirectPath = '/';
        else if (role === 'Normal') redirectPath = '/';

        setTimeout(() => {
          navigate(redirectPath);
        }, 2000);
      } else {
        toast.error(response.errorMessages ? response.errorMessages[0] : 'Giriş başarısız.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsLoading(false);
      }
    } catch (err) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
