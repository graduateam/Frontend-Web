import React from "react";
import Header from "../components/layout/Header";
import LoginForm from "../components/auth/LoginForm";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();

  // 이미 인증된 경우 메인 페이지로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/main" />;
  }

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // 로그인 성공 후 리다이렉트는 위의 isAuthenticated 조건으로 처리됨
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <div className="app-container bg-traffic-orange-d3">
      <Header showLogout={false} />
      <div className="white-title-bar seoul-24-extrabold bg-white text-traffic-orange-b2">
        SmartRoadReflector
      </div>
      <div className="content bg-traffic-orange-d3">
        <div className="korean-title seoul-24-light text-white">
          관리자 전용 웹페이지
        </div>
        <div className="center-logo">
          <img
            src="/src/assets/images/logos/road-intersection.svg"
            alt="Road Intersection"
          />
        </div>
        <LoginForm onSubmit={handleLogin} />
        <div className="version-tag text-white pretendard-16-bold">V1.0</div>
      </div>
    </div>
  );
};

export default LoginPage;
