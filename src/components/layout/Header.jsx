import React from "react";

const Header = () => {
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
    </header>
  );
};

export default Header;
