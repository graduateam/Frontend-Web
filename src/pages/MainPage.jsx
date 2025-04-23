import React from "react";
import Header from "../components/layout/Header";
import NaverMap from "../components/map/NaverMap";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const MainPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="app-container">
      <Header showLogout={true} />
      <div className="map-container">
        <NaverMap />
      </div>
    </div>
  );
};

export default MainPage;
