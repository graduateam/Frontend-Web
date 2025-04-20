import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import { isAuthenticated } from "../services/authService";

const AdminDashboard = () => {
  useEffect(() => {
    // 인증 확인 (라우터 가드 구현 시 대체 가능)
    if (!isAuthenticated()) {
      // 미인증 시 로그인 페이지로 리다이렉트
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="subheader">SmartRoadReflector</div>
      <div style={{ padding: "20px" }}>
        <h1>관리자 대시보드</h1>
        <p>백엔드와 연동 후 구현 예정입니다.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
