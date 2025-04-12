// src/components/Dashboard/DashboardRouter.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminPanel from './AdminPanel';
import SellerPanel from './SellerPanel';
import UserPanel from './UserPanel';

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Yükleniyor...</div>;
  if (!user) return <div>Giriş yapmalısınız.</div>;

  switch (user.role) {
    case 'admin':
      return <AdminPanel />;
    case 'seller':
      return <SellerPanel />;
    case 'user':
      return <UserPanel />;
    default:
      return <div>Yetkisiz erişim.</div>;
  }
};

export default DashboardRouter;
