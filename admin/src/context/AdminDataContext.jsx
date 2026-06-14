import React, { createContext, useContext } from 'react';

const AdminDataContext = createContext({});

export const AdminDataProvider = ({ children }) => {
  return (
    <AdminDataContext.Provider value={{
      auditLogs: [],
      products: [],
      orders: [],
      customers: [],
      subscriptions: [],
      warehouses: [],
      customerActions: []
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
