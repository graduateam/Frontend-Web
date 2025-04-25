/**
 * 카메라 관련 API 서비스
 */

import api from "./apiClient";

const CAMERA_ENDPOINTS = {
  GET_ALL: "/cameras",
  GET_DETAILS: (id) => `/cameras/${id}`,
  GET_STATS: (id) => `/cameras/${id}/stats`,
  UPDATE_STATUS: (id) => `/cameras/${id}/status`,
};

/**
 * 모든 카메라 정보 조회
 * @returns {Promise<Array>} 카메라 정보 배열
 */
export const getAllCameras = async () => {
  try {
    return await api.get(CAMERA_ENDPOINTS.GET_ALL);
  } catch (error) {
    console.error("[Camera API] 카메라 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 단일 카메라 상세 정보 조회
 * @param {number} cameraId - 카메라 ID
 * @returns {Promise<Object>} 카메라 상세 정보
 */
export const getCameraDetails = async (cameraId) => {
  try {
    return await api.get(CAMERA_ENDPOINTS.GET_DETAILS(cameraId));
  } catch (error) {
    console.error(
      `[Camera API] 카메라 ${cameraId} 상세 정보 조회 실패:`,
      error
    );
    throw error;
  }
};

/**
 * 카메라 통계 정보 조회
 * @param {number} cameraId - 카메라 ID
 * @returns {Promise<Object>} 카메라 통계 정보
 */
export const getCameraStats = async (cameraId) => {
  try {
    return await api.get(CAMERA_ENDPOINTS.GET_STATS(cameraId));
  } catch (error) {
    console.error(
      `[Camera API] 카메라 ${cameraId} 통계 정보 조회 실패:`,
      error
    );
    throw error;
  }
};

/**
 * 카메라 상태 업데이트
 * @param {number} cameraId - 카메라 ID
 * @param {string} status - 변경할 상태 ('active', 'inactive', 'maintenance' 등)
 * @returns {Promise<Object>} 업데이트 결과
 */
export const updateCameraStatus = async (cameraId, status) => {
  try {
    return await api.patch(CAMERA_ENDPOINTS.UPDATE_STATUS(cameraId), {
      status,
    });
  } catch (error) {
    console.error(`[Camera API] 카메라 ${cameraId} 상태 업데이트 실패:`, error);
    throw error;
  }
};

export default {
  getAllCameras,
  getCameraDetails,
  getCameraStats,
  updateCameraStatus,
};
