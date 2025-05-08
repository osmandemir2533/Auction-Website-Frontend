import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { SD_ROLES } from '../Interfaces/enums/SD_ROLES';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const token = localStorage.getItem("token");
    if (token != null) {
      const decode = jwtDecode(token);
      if (decode.role !== SD_ROLES.Administrator) {
        window.location.replace("/accessDenied");
        return null;
      }
    } else {
      window.location.replace("/login");
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth; 