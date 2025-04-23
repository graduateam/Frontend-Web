import React from "react";
import Header from "../components/layout/Header";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const MainPage = () => {
  const { isAuthenticated } = useAuth();

  // 인증되지 않았으면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="app-container bg-traffic-orange">
      <Header showLogout={true} />
    </div>
  );
};

export default MainPage;
