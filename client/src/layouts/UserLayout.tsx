import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../features/dashboard/components/Header';

const UserLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default UserLayout;