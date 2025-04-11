import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VehicleList from './components/VehicleList/VehicleList';
import VehicleDetail from './components/VehicleDetail/VehicleDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
        <Route path="/" element={
          <>
            <HomePage />
          </>
        } />
        <Route path="/vehicles" element={<VehicleList />} />   {/* BURAYA EKLENDİ */}
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
