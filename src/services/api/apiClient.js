/**
 * API 클라이언트 - 모든 HTTP 요청을 처리하는 중앙 모듈
 */

import { getToken } from "../authService";

// API 기본 URL - 환경 변수에서 가져옴
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * API 요청을 생성하는 기본 함수
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {Object} options - fetch 옵션
 * @returns {Promise} API 응답
 */
async function apiRequest(endpoint, options = {}) {
  // 기본 헤더 설정
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 인증 토큰이 있으면 헤더에 추가
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 전체 URL 생성
  const url = `${API_BASE_URL}${endpoint}`;

  // 요청 옵션 통합
  const requestOptions = {
    ...options,
    headers,
  };

  try {
    // API 요청 실행
    const response = await fetch(url, requestOptions);

    // 응답 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(
        `[API] ${options.method || "GET"} ${endpoint} 응답:`,
        response.status,
        response.ok ? "성공" : "실패"
      );
    }

    // 응답이 성공이 아니면 에러 처리
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      const error = new Error(errorData.message || "서버 요청 실패");
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // 응답 데이터가 있으면 JSON으로 변환하여 반환
    if (response.status !== 204) {
      // 204 No Content
      return await response.json();
    }

    // 204 응답의 경우 성공만 반환
    return { success: true };
  } catch (error) {
    // 오류 로깅
    console.error(`[API] ${options.method || "GET"} ${endpoint} 오류:`, error);
    throw error;
  }
}

/**
 * HTTP GET 요청
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} params - URL 쿼리 파라미터
 * @returns {Promise} API 응답
 */
export const get = async (endpoint, params = {}) => {
  // URL 쿼리 파라미터 추가
  const queryString = Object.keys(params).length
    ? `?${new URLSearchParams(params).toString()}`
    : "";

  return apiRequest(`${endpoint}${queryString}`, { method: "GET" });
};

/**
 * HTTP POST 요청
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} data - 요청 바디 데이터
 * @returns {Promise} API 응답
 */
export const post = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * HTTP PUT 요청
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} data - 요청 바디 데이터
 * @returns {Promise} API 응답
 */
export const put = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * HTTP PATCH 요청
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} data - 요청 바디 데이터
 * @returns {Promise} API 응답
 */
export const patch = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * HTTP DELETE 요청
 * @param {string} endpoint - API 엔드포인트
 * @returns {Promise} API 응답
 */
export const del = async (endpoint) => {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
};
