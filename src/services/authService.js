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
    console.log("[Auth] API 로그인 시도:", credentials.username);

    // API 호출을 통한 로그인 시도
    const response = await authApi.login(credentials);
    console.log("[Auth] API 로그인 응답:", response);

    // 토큰과 사용자 정보 저장
    if (response.success && response.data) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      console.log("[Auth] 로그인 성공, 토큰 저장됨");
      return response.data;
    } else if (response.token) {
      // 구 형식 API 응답 처리
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      console.log("[Auth] 로그인 성공, 토큰 저장됨 (구 형식)");
      return response;
    } else {
      console.error("[Auth] 잘못된 응답 형식:", response);
      throw new Error("서버 응답 형식이 잘못되었습니다");
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
  // 실제 API 호출 (비동기)
  const useRealApi = import.meta.env.VITE_USE_REAL_API !== "false";
  if (useRealApi) {
    authApi.logout().catch((error) => {
      console.warn("[Auth] 로그아웃 API 호출 실패:", error);
    });
  }

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
