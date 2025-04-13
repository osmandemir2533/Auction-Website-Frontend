// src/components/Dashboard/DashboardRouter.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminPanel from '../../Admin/AdminPanel';
import SellerPanel from './SellerPanel/SellerPanel';

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Yükleniyor...</div>;
  if (!user) return <div>Giriş yapmalısınız.</div>;

  switch (user.role) {
    case 'admin':
      return <AdminPanel />;
    case 'seller':
      return <SellerPanel />;
    default:
      return <div>Yetkisiz erişim.</div>;
  }
};

export default DashboardRouter;
