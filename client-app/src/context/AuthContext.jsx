import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          role: decodedToken.role,
          name: decodedToken.name,
          fullName: decodedToken.fullName,
          nameid: decodedToken.nameid
        });
      } catch (error) {
        console.error('Token decode hatası:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUser({
        role: decodedToken.role,
        name: decodedToken.name,
        fullName: decodedToken.fullName,
        nameid: decodedToken.nameid
      });
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Token decode hatası:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 