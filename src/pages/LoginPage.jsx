import React from "react";
import Header from "../components/layout/Header";
import LoginForm from "../components/auth/LoginForm";
import { login } from "../services/authService";

const LoginPage = () => {
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // 로그인 성공 시 대시보드 페이지로 이동 (라우터 연동 시 활성화)
      // navigate('/dashboard');
      alert("로그인 성공! 백엔드 연동 시 대시보드로 이동합니다.");
    } catch (error) {
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="subheader">SmartRoadReflector</div>
      <div className="content">
        <div className="korean-title">관리자 전용 웹페이지</div>
        <div className="center-logo">
          <img
            src="/src/assets/images/logos/road-intersection.svg"
            alt="Road Intersection"
          />
        </div>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
