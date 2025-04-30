import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  login as loginService,
  logout as logoutService,
} from "../services/authService";

// 인증 관련 커스텀 훅
const useAuth = () => {
  const auth = useContext(AuthContext);

  // 로그인 함수
  const login = async (credentials) => {
    try {
      const response = await loginService(credentials);
      // 새 API 응답 구조 확인
      if (response.hasOwnProperty("user")) {
        // 기존 응답 형식
        auth.updateAuthState(true, response.user);
        return response;
      } else if (response.data && response.data.user) {
        // 새로운 API 응답 형식
        auth.updateAuthState(true, response.data.user);
        return response.data;
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = () => {
    logoutService();
    auth.updateAuthState(false, null);
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    login,
    logout,
  };
};

export default useAuth;
