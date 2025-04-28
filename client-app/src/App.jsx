import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import SellerPanel from './components/Dashboard/SellerPanel/SellerPanel';
import HowItWorks from './emptypage/howitworks';
import DressList from './components/DressList/DressList';
import DressDetail from './components/DressDetail/DressDetail';
import MusicList from './components/MusicList/MusicList';  // Müzik Listesi
import MusicDetail from './components/MusicDetail/MusicDetail';  // Müzik Detayı
import EstateList from './components/EstateList/EstateList';
import EstateDetail from './components/EstateDetail/EstateDetail';
import ElectronicList from './components/ElectronicList/ElectronicList';
import ElectronicDetail from './components/ElectronicDetail/ElectronicDetail';



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dress" element={<DressList />} />
            <Route path="/dress/:id" element={<DressDetail />} />
            <Route path="/vehicle" element={<VehicleList />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/dashboard/admin" element={<AdminPanel />} />
            <Route path="/dashboard/seller" element={<SellerPanel />} />
            <Route path="/music/:id" element={<MusicDetail />} />
            <Route path="/music" element={<MusicList />} />
            <Route path="/estate" element={<EstateList />} />
            <Route path="/estate/:id" element={<EstateDetail />} />
            <Route path="/electronic" element={<ElectronicList />} />
            <Route path="/electronic/:id" element={<ElectronicDetail />} />
            <Route path="/auctions" element={<MusicList />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
