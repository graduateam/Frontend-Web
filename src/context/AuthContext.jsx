import React, { createContext, useState, useEffect } from "react";
import { getToken, getCurrentUser } from "../services/authService";

// 인증 컨텍스트 생성
export const AuthContext = createContext();

// 인증 컨텍스트 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로컬 스토리지에서 인증 상태 확인
  useEffect(() => {
    const token = getToken();
    const currentUser = getCurrentUser();

    if (token && currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  // 인증 상태 업데이트 함수
  const updateAuthState = (authState, userData) => {
    setIsAuthenticated(authState);
    setUser(userData);
  };

  // 컨텍스트 값
  const contextValue = {
    isAuthenticated,
    user,
    loading,
    updateAuthState,
  };

  // 로딩 중이 아닐 때만 자식 컴포넌트 렌더링
  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
