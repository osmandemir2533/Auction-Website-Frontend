import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VehicleList from './components/VehicleList/VehicleList';
import VehicleDetail from './components/VehicleDetail/VehicleDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import DashboardRouter from './components/Dashboard/DashboardRouter';
import AdminPanel from './Admin/AdminPanel';
import SellerPanel from './components/Dashboard/SellerPanel';
import UserPanel from './components/Dashboard/UserPanel';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/dashboard/admin" element={<AdminPanel />} />
            <Route path="/dashboard/seller" element={<SellerPanel />} />
            <Route path="/dashboard/user" element={<UserPanel />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
