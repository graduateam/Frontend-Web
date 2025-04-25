/**
 * 인증 관련 API 서비스
 */

import api from "./apiClient";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  PROFILE: "/auth/profile",
};

/**
 * 사용자 로그인
 * @param {Object} credentials - 로그인 인증 정보
 * @param {string} credentials.username - 사용자 아이디
 * @param {string} credentials.password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 결과 (토큰, 사용자 정보 등)
 */
export const login = async (credentials) => {
  try {
    return await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
  } catch (error) {
    console.error("[Auth API] 로그인 실패:", error);
    throw error;
  }
};

/**
 * 사용자 로그아웃
 * @returns {Promise<Object>} 로그아웃 결과
 */
export const logout = async () => {
  try {
    return await api.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error("[Auth API] 로그아웃 실패:", error);
    // 로그아웃은 실패해도 무시하고 로컬에서는 세션 정리
    return { success: true };
  }
};

/**
 * 사용자 프로필 정보 가져오기
 * @returns {Promise<Object>} 사용자 프로필 정보
 */
export const getUserProfile = async () => {
  try {
    return await api.get(AUTH_ENDPOINTS.PROFILE);
  } catch (error) {
    console.error("[Auth API] 프로필 조회 실패:", error);
    throw error;
  }
};

/**
 * 토큰 갱신
 * @returns {Promise<Object>} 갱신된 토큰 정보
 */
export const refreshToken = async () => {
  try {
    return await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
  } catch (error) {
    console.error("[Auth API] 토큰 갱신 실패:", error);
    throw error;
  }
};

export default {
  login,
  logout,
  getUserProfile,
  refreshToken,
};
