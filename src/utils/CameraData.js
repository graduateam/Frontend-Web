/**
 * 카메라 데이터 유틸리티
 * 실제 API 호출은 cameraApi로 위임합니다.
 */

import cameraApi from "../services/api/cameraApi";

console.log("[CameraData] 모듈 초기화");

// 카메라 데이터 (정적 목업 데이터)
const mockCameraData = [
  {
    id: 1,
    location: { latitude: 37.5676805, longitude: 126.9764147 },
    name: "카메라 1",
    status: "active",
  },
  {
    id: 2,
    location: { latitude: 37.5656805, longitude: 126.9794147 },
    name: "카메라 2",
    status: "active",
  },
  {
    id: 3,
    location: { latitude: 37.5646805, longitude: 126.9774147 },
    name: "카메라 3",
    status: "active",
  },
];

console.log(
  `[CameraData] mockCameraData 준비됨: ${mockCameraData.length}개 카메라`
);

/**
 * 카메라 데이터를 가져오는 함수
 * @returns {Promise<Array>} 카메라 데이터 배열
 */
export const fetchCameraData = async () => {
  console.log("[CameraData] fetchCameraData 호출됨", new Date().toISOString());

  try {
    // 항상 실제 API 호출 (요구사항 2)
    console.log("[CameraData] 백엔드 API 호출 시도");
    const cameras = await cameraApi.getAllCameras();
    console.log(`[CameraData] 백엔드에서 ${cameras.length}개 카메라 데이터 로드됨`, cameras);
    return cameras;
  } catch (error) {
    console.error("[CameraData] 카메라 데이터 로드 오류:", error);
    // 에러 발생 시 빈 배열 반환하여 앱 중단 방지
    console.log("[CameraData] 오류 발생으로 빈 카메라 배열 반환");
    return [];
  }
};

export default {
  fetchCameraData,
};
