import React from "react";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";

const Header = ({ showLogout = false }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // 로그아웃 후 로그인 페이지로 이동은 App.jsx의 라우팅 로직으로 처리됨
  };

  return (
    <header className="header bg-traffic-orange">
      <img
        src="/src/assets/images/logos/circle-logo.svg"
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
