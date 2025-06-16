import React, { useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE } from "../utils/consts";
import { Context } from "..";

const AppRouter = () => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {/* Защищенные маршруты */}
      {user.isAuth && authRoutes.map(({ path, Component }) => (
        <Route 
          key={path} 
          path={path} 
          element={<Component />} 
        />
      ))}
      
      {/* Публичные маршруты */}
      {publicRoutes.map(({ path, Component }) => (
        <Route 
          key={path} 
          path={path} 
          element={<Component />} 
        />
      ))}
      
      {/* Редирект для несуществующих маршрутов */}
      <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
    </Routes>
  );
};

export default AppRouter;