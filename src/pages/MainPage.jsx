import React from "react";
import Header from "../components/layout/Header";
import NaverMap from "../components/map/NaverMap";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import "../assets/styles/mainpage.css"; // 새 스타일 파일 추가

const MainPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="app-container">
      <Header showLogout={true} />
      <div className="main-content">
        <div className="map-container">
          <NaverMap />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
