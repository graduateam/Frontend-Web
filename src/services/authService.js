/**
 * 인증 관련 서비스
 * 실제 API 호출은 authApi로 위임하고
 * 로컬 스토리지 관리와 인증 상태를 처리합니다.
 */

import authApi from "./api/authApi";

// 로컬 스토리지 키
const TOKEN_KEY = "smart_road_reflector_token";
const USER_KEY = "smart_road_reflector_user";

/**
 * 사용자 로그인
 * @param {Object} credentials - 로그인 인증 정보
 * @returns {Promise<Object>} 로그인 결과
 */
export const login = async (credentials) => {
  try {
    // 개발 환경이거나 VITE_USE_REAL_API가 명시적으로 'true'가 아닐 때 모의 로그인 사용
    const useRealApi = import.meta.env.VITE_USE_REAL_API === "true";

    // 모의 로그인 사용 (기본 동작)
    if (!useRealApi) {
      console.log("[Auth] 모의 로그인 사용");
      if (
        credentials.username === "admin" &&
        credentials.password === "password"
      ) {
        const mockData = {
          token: "mock-jwt-token",
          user: {
            id: 1,
            username: credentials.username,
            role: "ADMIN",
          },
        };
        localStorage.setItem(TOKEN_KEY, mockData.token);
        localStorage.setItem(USER_KEY, JSON.stringify(mockData.user));
        return mockData;
      } else {
        throw new Error("Invalid credentials");
      }
    }
    // 실제 API 사용
    else {
      console.log("[Auth] 실제 API 로그인 시도");
      const response = await authApi.login(credentials);

      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      return response;
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * 사용자 로그아웃
 */
export const logout = () => {
  // 로컬 스토리지에서 인증 정보 제거
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * 현재 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

/**
 * 인증 토큰 가져오기
 * @returns {string|null} 토큰 또는 null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 사용자 인증 상태 확인
 * @returns {boolean} 인증 여부
 */
export const isAuthenticated = () => {
  return getToken() !== null;
};

export default {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
};
