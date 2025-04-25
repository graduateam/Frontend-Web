import React from "react";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
// 이미지 import 추가
import CircleLogo from "@/assets/images/logos/circle-logo.svg";

const Header = ({ showLogout = false }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header bg-traffic-orange">
      <img
        src={CircleLogo} // 수정: 하드코딩 경로 대신 import한 변수 사용
        alt="Circle Logo"
        className="header-logo"
      />
      <div className="header-title text-white seoul-24-extrabold">
        Smart Road Reflector
      </div>
      {showLogout && (
        <div style={{ marginLeft: "auto", marginRight: "20px" }}>
          <button
            onClick={handleLogout}
            className="logout-button seoul-14-boldlight"
          >
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
