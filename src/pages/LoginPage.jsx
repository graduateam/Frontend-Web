import React, { useState } from "react";
import Header from "../components/layout/Header";
import LoginForm from "../components/auth/LoginForm";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
// 이미지 import 추가
import RoadIntersectionLogo from "@/assets/images/logos/road-intersection.svg";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/main" />;
  }

  const handleLogin = async (credentials) => {
    try {
      setError(""); // 이전 에러 메시지 초기화
      await login(credentials);
      // 로그인 성공 시 useAuth 내부에서 상태가 변경되어 자동으로 Navigate로 리디렉션됨
    } catch (error) {
      // 오류 메시지 표시
      setError(
        error.message || "로그인 실패: 아이디와 비밀번호를 확인해주세요."
      );
      alert(error.message || "로그인 실패: 아이디와 비밀번호를 확인해주세요.");
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
            src={RoadIntersectionLogo} // 수정: import한 변수 사용
            alt="Road Intersection"
          />
        </div>
        <LoginForm onSubmit={handleLogin} />
        {error && <div className="error-message text-white mt-2">{error}</div>}
        <div className="version-tag text-white pretendard-16-bold">V1.0</div>
      </div>
    </div>
  );
};

export default LoginPage;
