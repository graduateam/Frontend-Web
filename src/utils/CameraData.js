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
    // 개발 환경에서만 모의 데이터 사용
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      // 모의 API 지연 시뮬레이션
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            `[CameraData] 모의 데이터 반환: ${mockCameraData.length}개 카메라`,
            {
              첫번째카메라: mockCameraData[0],
              마지막카메라: mockCameraData[mockCameraData.length - 1],
            }
          );
          resolve(mockCameraData);
        }, 300); // 300ms 지연으로 API 호출 시뮬레이션
      });
    } else {
      // 실제 API 호출
      const cameras = await cameraApi.getAllCameras();
      console.log(
        `[CameraData] API에서 ${cameras.length}개 카메라 데이터 로드됨`
      );
      return cameras;
    }
  } catch (error) {
    console.error("[CameraData] 카메라 데이터 로드 오류:", error);
    throw new Error("카메라 데이터를 가져오는데 실패했습니다.");
  }
};

export default {
  fetchCameraData,
};
