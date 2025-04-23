import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  // Replaced background-color with utility class
  // Original: background-color: rgba(139, 64, 0, 0.6);
  const containerStyle = {
    backgroundColor: "rgba(var(--color-traffic-orange-b1-rgb), 0.6)",
  };

  return (
    <div className="login-container bg-traffic-orange-s1">
      <div className="login-title text-white">LOGIN</div>
      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="default"
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="default"
        />
        <Button className="login-button" variant="primary">
          로그인
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
