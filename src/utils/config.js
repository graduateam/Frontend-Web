/**
 * 애플리케이션 설정 값 모음
 */

// API 기본 URL 설정
export const API_BASE_URL = "http://localhost:5000"; // Flask 서버 주소

// 인증 관련 설정
export const AUTH_TOKEN_KEY = "auth_token";

// 맵 관련 설정
export const DEFAULT_MAP_ZOOM = 16;
export const DEFAULT_MAP_CENTER = { lat: 37.5676805, lng: 126.9764147 }; // 서울 중심

// 레이어 표시 설정
export const MAP_SETTINGS = {
  showVehicleLabels: true,
  showPathLines: true,
  animateVehicles: true
};

// 충돌 위험도 설정 (초 단위)
export const COLLISION_RISK_THRESHOLD = {
  high: 2.0,   // 2초 미만 = 높은 위험
  medium: 4.0, // 2-4초 = 중간 위험
  low: 6.0     // 4-6초 = 낮은 위험, 6초 이상 = 위험 없음
};
