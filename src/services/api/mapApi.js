/**
 * 지도 데이터 관련 API 서비스
 */

import api from "./apiClient";

const MAP_ENDPOINTS = {
  GET_UPDATE: "/map/update",
  GET_COLLISIONS: "/map/collisions",
  GET_VEHICLES: (cameraId) =>
    `/map/vehicles${cameraId ? `?camera_id=${cameraId}` : ""}`,
  GET_BOUNDARIES: "/map/boundaries",
  GET_CAMERA_BOUNDARY: (cameraId) => `/map/boundaries/${cameraId}`,
};

/**
 * 지도 업데이트 데이터 조회
 * @param {number|null} cameraId - 카메라 ID (옵션)
 * @returns {Promise<Object>} 지도 업데이트 데이터
 */
export const getMapUpdateData = async (cameraId = null) => {
  try {
    const params = cameraId ? { camera_id: cameraId } : {};
    return await api.get(MAP_ENDPOINTS.GET_UPDATE, params);
  } catch (error) {
    console.error("[Map API] 지도 업데이트 데이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 충돌 예측 데이터 조회
 * @param {number|null} cameraId - 카메라 ID (옵션)
 * @returns {Promise<Array>} 충돌 예측 데이터 배열
 */
export const getCollisions = async (cameraId = null) => {
  try {
    const params = cameraId ? { camera_id: cameraId } : {};
    return await api.get(MAP_ENDPOINTS.GET_COLLISIONS, params);
  } catch (error) {
    console.error("[Map API] 충돌 예측 데이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 차량 데이터 조회
 * @param {number|null} cameraId - 카메라 ID (옵션)
 * @returns {Promise<Array>} 차량 데이터 배열
 */
export const getVehicles = async (cameraId = null) => {
  try {
    return await api.get(MAP_ENDPOINTS.GET_VEHICLES(cameraId));
  } catch (error) {
    console.error("[Map API] 차량 데이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 모든 카메라의 비디오 경계 데이터 조회
 * @returns {Promise<Array>} 비디오 경계 데이터 배열
 */
export const getAllBoundaries = async () => {
  try {
    return await api.get(MAP_ENDPOINTS.GET_BOUNDARIES);
  } catch (error) {
    console.error("[Map API] 비디오 경계 데이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 특정 카메라의 비디오 경계 데이터 조회
 * @param {number} cameraId - 카메라 ID
 * @returns {Promise<Object>} 비디오 경계 데이터
 */
export const getCameraBoundary = async (cameraId) => {
  try {
    return await api.get(MAP_ENDPOINTS.GET_CAMERA_BOUNDARY(cameraId));
  } catch (error) {
    console.error(
      `[Map API] 카메라 ${cameraId} 비디오 경계 데이터 조회 실패:`,
      error
    );
    throw error;
  }
};

export default {
  getMapUpdateData,
  getCollisions,
  getVehicles,
  getAllBoundaries,
  getCameraBoundary,
};
