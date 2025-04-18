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
import SellerDressPanel from './components/Dashboard/SellerPanel/Dress/SellerDressPanel';
import SellerMusicalInstrumentPanel from './components/Dashboard/SellerPanel/MusicalInstrument/SellerMusicalInstrumentPanel';
import DressList from './components/DressList/DressList';
import DressDetail from './components/DressDetail/DressDetail';
import MusicalInstrumentList from './components/MusicalInstrumentList/MusicalInstrumentList';
import MusicalInstrumentDetail from './components/MusicalInstrumentDetail/MusicalInstrumentDetail';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/vehicles/:id" element={<VehicleDetail />} />
            <Route path="/dresses" element={<DressList />} />
            <Route path="/dresses/:id" element={<DressDetail />} />
            <Route path="/musical-instruments" element={<MusicalInstrumentList />} />
            <Route path="/musical-instruments/:id" element={<MusicalInstrumentDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/dashboard/admin" element={<AdminPanel />} />
            <Route path="/dashboard/seller" element={<SellerPanel />} />
            <Route path="/dashboard/seller/dresses" element={<SellerDressPanel />} />
            <Route path="/dashboard/seller/musical-instruments" element={<SellerMusicalInstrumentPanel />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
