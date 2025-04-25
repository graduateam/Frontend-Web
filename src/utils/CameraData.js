// utils/CameraData.js
// 카메라 정적 데이터 및 API 호출 함수

console.log("[CameraData] 모듈 초기화");

// 카메라 데이터 (정적)
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
 * 실제 API 연동 시 이 함수만 수정하면 됨
 * @returns {Promise<Array>} 카메라 데이터 배열
 */
export const fetchCameraData = async () => {
  console.log("[CameraData] fetchCameraData 호출됨", new Date().toISOString());

  try {
    // 실제 API 구현 시 여기에 fetch 호출 코드가 들어갈 것입니다.
    // const response = await fetch('/api/cameras');
    // const data = await response.json();
    // return data;

    // 현재는 목업 데이터를 비동기적으로 반환합니다.
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `[CameraData] 데이터 반환: ${mockCameraData.length}개 카메라`,
          {
            첫번째카메라: mockCameraData[0],
            마지막카메라: mockCameraData[mockCameraData.length - 1],
          }
        );
        resolve(mockCameraData);
      }, 300); // 300ms 지연으로 실제 API 호출 시뮬레이션
    });
  } catch (error) {
    console.error("[CameraData] 카메라 데이터 로드 오류:", error);
    throw new Error("카메라 데이터를 가져오는데 실패했습니다.");
  }
};
