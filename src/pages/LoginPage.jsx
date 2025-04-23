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
    <div className="app-container bg-traffic-orange-d3">
      <Header />
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
