/**
 * 네이버 지도 데이터 유틸리티
 * 실제 API 호출은 mapApi로 위임합니다.
 */

import mapApi from "../services/api/mapApi";

console.log("[NaverMapData] 모듈 초기화");

// 여기서부터는 모의 데이터 생성을 위한 코드로,
// 실제 서버 연동 시에는 사용되지 않습니다.

// 차량 상태 관리를 위한 전역 변수들
let vehicles = [];
let lastVehicleCreationTime = 0;
let videoBoundaryMap = {}; // 카메라 ID별 비디오 경계 저장

// 삐뚤어진 사각형 경계 생성
const createIrregularVideoBoundary = (center, cameraId) => {
  // 기본 offset에 변화를 주어 불규칙한 사각형 만들기
  const baseOffset = 0.002;

  // 카메라 ID에 따라 약간 다른 모양 생성 (의사 난수)
  const seed = cameraId || 1;
  const random = (n) => (((seed * 9301 + 49297) % 233280) / 233280) * n;

  const boundary = [
    [
      center[1] - baseOffset * (1.2 + random(0.3)),
      center[0] - baseOffset * (0.9 + random(0.2)),
    ], // 좌하단
    [
      center[1] + baseOffset * (1.1 + random(0.2)),
      center[0] - baseOffset * (1.1 + random(0.3)),
    ], // 우하단
    [
      center[1] + baseOffset * (0.9 + random(0.2)),
      center[0] + baseOffset * (1.2 + random(0.3)),
    ], // 우상단
    [
      center[1] - baseOffset * (1.0 + random(0.3)),
      center[0] + baseOffset * (1.0 + random(0.2)),
    ], // 좌상단
  ];

  // 카메라 ID별로 경계 저장
  videoBoundaryMap[cameraId] = boundary;

  return boundary;
};

// 경계의 랜덤 지점 선택 (시작점 또는 목적지)
const getRandomBoundaryPoint = (boundary) => {
  if (!boundary || boundary.length < 4) return null;

  // 경계의 4개 변 중 하나를 랜덤하게 선택
  const sideIndex = Math.floor(Math.random() * 4);

  // 선택한 변의 두 끝점
  const point1 = boundary[sideIndex];
  const point2 = boundary[(sideIndex + 1) % 4];

  // 두 끝점 사이의 랜덤 지점 계산 (0~1 사이의 값으로 보간)
  const ratio = Math.random();
  const randomPoint = [
    point1[0] + (point2[0] - point1[0]) * ratio,
    point1[1] + (point2[1] - point1[1]) * ratio,
  ];

  return randomPoint;
};

// 새 차량 생성
const createNewVehicle = (cameraId) => {
  // 현재 시간
  const now = new Date();
  const timestamp = now.toISOString();

  // 1초에 한 번만 차량 생성
  if (now.getTime() - lastVehicleCreationTime < 1000) return null;
  lastVehicleCreationTime = now.getTime();

  // 해당 카메라의 비디오 경계 가져오기
  const boundary = videoBoundaryMap[cameraId];
  if (!boundary) return null;

  // 임의의 차량 ID 생성 (1~1000 사이)
  const vehicleId = Math.floor(Math.random() * 1000) + 1;

  // 시작점과 목적지 선택 (경계의 랜덤 지점)
  const startPoint = getRandomBoundaryPoint(boundary);
  let destPoint;

  // 목적지가 시작점과 충분히 떨어지도록 선택
  do {
    destPoint = getRandomBoundaryPoint(boundary);
  } while (
    Math.sqrt(
      Math.pow(destPoint[0] - startPoint[0], 2) +
        Math.pow(destPoint[1] - startPoint[1], 2)
    ) < 0.002
  );

  // 속도 생성 (5~15 m/s 사이)
  const speed = (Math.random() * 10 + 5).toFixed(1);

  // 시작점에서 목적지를 향한 방향 계산
  const dx = destPoint[0] - startPoint[0];
  const dy = destPoint[1] - startPoint[1];
  const heading = ((Math.atan2(dx, dy) * 180) / Math.PI).toFixed(2);

  // 차량 객체 생성
  const vehicle = {
    id: vehicleId,
    cameraId: cameraId,
    startPoint: startPoint,
    destPoint: destPoint,
    currentPos: [...startPoint], // 현재 위치는 시작점으로 초기화
    speed: speed,
    heading: heading,
    creationTime: now.getTime(),
    isRemoved: false,
    is_collision_risk: false,
    ttc: null,
  };

  // 차량 배열에 추가
  vehicles.push(vehicle);

  return vehicle;
};

// 경로 좌표 생성 (현재 위치에서 진행 방향으로)
const createPathCoords = (currentPos, destPos, steps = 3) => {
  const result = [
    [currentPos[0], currentPos[1]], // GeoJSON은 [경도, 위도] 순서
  ];

  // 진행 방향 계산
  const dx = destPos[0] - currentPos[0];
  const dy = destPos[1] - currentPos[1];
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 단위 벡터
  const unitX = dx / distance;
  const unitY = dy / distance;

  // 각 스텝의 크기 (총 거리의 일부)
  const stepSize = distance / (steps + 1);

  for (let i = 1; i <= steps; i++) {
    const nextLng = currentPos[0] + unitX * stepSize * i;
    const nextLat = currentPos[1] + unitY * stepSize * i;
    result.push([nextLng, nextLat]);
  }

  return result;
};

// 차량 위치 업데이트
const updateVehicles = () => {
  const now = new Date().getTime();

  // 각 차량의 위치 업데이트
  vehicles.forEach((vehicle) => {
    if (vehicle.isRemoved) return;

    // 경과 시간 (초)
    const elapsedTime = (now - vehicle.creationTime) / 1000;

    // 시작점과 목적지 사이의 거리
    const dx = vehicle.destPoint[0] - vehicle.startPoint[0];
    const dy = vehicle.destPoint[1] - vehicle.startPoint[1];
    const totalDistance = Math.sqrt(dx * dx + dy * dy);

    // 초당 이동 거리 (도 단위, 지구 위에서는 1도가 약 111km)
    // 실제로는 정확한 거리 계산이 필요하지만, 여기서는 근사치로 계산
    // 1m/s는 약 0.00001도/s (지구 위도에 따라 다름)
    const speedDegree = parseFloat(vehicle.speed) * 0.00001;

    // 이동할 총 시간 (초)
    const totalTime = totalDistance / speedDegree;

    // 현재 진행 비율 (0~1)
    let ratio = elapsedTime / totalTime;

    // 목적지에 도달했거나 초과했으면 차량 제거 표시
    if (ratio >= 1) {
      vehicle.isRemoved = true;
      return;
    }

    // 현재 위치 계산 (선형 보간)
    vehicle.currentPos[0] = vehicle.startPoint[0] + dx * ratio;
    vehicle.currentPos[1] = vehicle.startPoint[1] + dy * ratio;
  });

  // 제거 표시된 차량 필터링
  vehicles = vehicles.filter((vehicle) => !vehicle.isRemoved);
};

// GeoJSON 데이터 생성
export const createSampleData = (selectedCameraId) => {
  // 현재 시간 기준 타임스탬프 생성
  const now = new Date();
  const timestamp = now.toISOString();

  // 서울 시청 근처 좌표 기준 (위도, 경도)
  const baseCoords = [37.5666805, 126.9784147];

  // 만약 선택된 카메라가 없으면 비디오 경계만 반환
  if (!selectedCameraId) {
    // 카메라 3개에 대한 비디오 경계 미리 생성
    for (let i = 1; i <= 3; i++) {
      if (!videoBoundaryMap[i]) {
        // 카메라마다 약간 다른 중심점 사용
        const cameraCenter = [
          baseCoords[0] + (i - 2) * 0.001, // 위도
          baseCoords[1] + (i - 2) * 0.001, // 경도
        ];
        createIrregularVideoBoundary(cameraCenter, i);
      }
    }

    // 모든 카메라의 비디오 경계만 포함된 데이터 반환
    const videoBoundaries = Object.entries(videoBoundaryMap).map(
      ([cameraId, boundary]) => {
        return {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[...boundary, boundary[0]]], // 닫힌 다각형
          },
          properties: {
            camera_id: parseInt(cameraId),
            type: "camera_boundary",
            timestamp: Date.now() / 1000,
          },
        };
      }
    );

    return {
      vehicles: [],
      collisions: [],
      paths: [],
      video_boundaries: videoBoundaries,
    };
  }

  // 선택된 카메라의 비디오 경계가 없으면 생성
  if (!videoBoundaryMap[selectedCameraId]) {
    // 카메라 ID에 따라 약간 다른 중심점 사용
    const cameraCenter = [
      baseCoords[0] + (selectedCameraId - 2) * 0.001, // 위도
      baseCoords[1] + (selectedCameraId - 2) * 0.001, // 경도
    ];
    createIrregularVideoBoundary(cameraCenter, selectedCameraId);
  }

  // 새 차량 생성 (1초에 한 번)
  createNewVehicle(selectedCameraId);

  // 기존 차량 위치 업데이트
  updateVehicles();

  // 선택된 카메라에 해당하는 차량만 필터링
  const cameraVehicles = vehicles.filter(
    (v) => v.cameraId === selectedCameraId
  );

  // GeoJSON 데이터 생성
  const vehicleFeatures = cameraVehicles.map((vehicle) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [vehicle.currentPos[0], vehicle.currentPos[1]], // [경도, 위도] 순서
      },
      properties: {
        id: vehicle.id,
        type: "vehicle",
        heading: vehicle.heading,
        speed: vehicle.speed,
        speed_kph: (parseFloat(vehicle.speed) * 3.6).toFixed(1), // m/s에서 km/h로 변환
        timestamp: timestamp,
        is_collision_risk: vehicle.is_collision_risk,
        ttc: vehicle.ttc,
      },
      rectangle: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [vehicle.currentPos[0] - 0.0001, vehicle.currentPos[1] - 0.00005], // 좌하단
              [vehicle.currentPos[0] + 0.0001, vehicle.currentPos[1] - 0.00005], // 우하단
              [vehicle.currentPos[0] + 0.0001, vehicle.currentPos[1] + 0.00005], // 우상단
              [vehicle.currentPos[0] - 0.0001, vehicle.currentPos[1] + 0.00005], // 좌상단
              [vehicle.currentPos[0] - 0.0001, vehicle.currentPos[1] - 0.00005], // 닫힌 다각형을 위해 첫 점 반복
            ],
          ],
        },
      },
    };
  });

  // 경로 생성
  const pathFeatures = cameraVehicles.map((vehicle) => {
    const pathCoords = createPathCoords(vehicle.currentPos, vehicle.destPoint);

    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: pathCoords,
      },
      properties: {
        id: `path_${vehicle.id}`,
        vehicle_id: vehicle.id,
        type: "path",
      },
      predicted_path: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: pathCoords.slice(1),
        },
      },
    };
  });

  // 충돌 계산 (간단한 구현: 차량 간 거리가 가까우면 충돌 위험)
  const collisions = [];
  for (let i = 0; i < cameraVehicles.length; i++) {
    for (let j = i + 1; j < cameraVehicles.length; j++) {
      const v1 = cameraVehicles[i];
      const v2 = cameraVehicles[j];

      // 두 차량 간 거리 계산
      const dx = v1.currentPos[0] - v2.currentPos[0];
      const dy = v1.currentPos[1] - v2.currentPos[1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 거리가 매우 가까우면 충돌 위험
      if (distance < 0.0003) {
        // 약 30m 정도
        // 충돌 지점 (두 차량의 중간)
        const collisionPoint = [
          (v1.currentPos[0] + v2.currentPos[0]) / 2,
          (v1.currentPos[1] + v2.currentPos[1]) / 2,
        ];

        // 충돌까지 남은 시간 계산 (거리에 반비례)
        const ttc = (1 + distance * 10000).toFixed(1); // 임의의 계산

        // 충돌 객체 생성
        collisions.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [collisionPoint[0], collisionPoint[1]], // [경도, 위도] 순서
          },
          properties: {
            id: `${v1.id}_${v2.id}`,
            type: "collision",
            vehicle_ids: [v1.id, v2.id],
            ttc: ttc,
            timestamp: timestamp,
          },
        });

        // 차량 속성 업데이트
        v1.is_collision_risk = true;
        v1.ttc = ttc;
        v2.is_collision_risk = true;
        v2.ttc = ttc;
      }
    }
  }

  // 선택된 카메라의 비디오 경계 다각형을 GeoJSON 형식으로 변환
  const videoBoundary = videoBoundaryMap[selectedCameraId] || [];
  const videoBoundaryFeature = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[...videoBoundary, videoBoundary[0]]], // 닫힌 다각형
    },
    properties: {
      camera_id: selectedCameraId,
      type: "camera_boundary",
      timestamp: Date.now() / 1000,
    },
  };

  // 모든 카메라의 비디오 경계 포함
  const allBoundaries = Object.entries(videoBoundaryMap).map(
    ([cameraId, boundary]) => {
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[...boundary, boundary[0]]], // 닫힌 다각형
        },
        properties: {
          camera_id: parseInt(cameraId),
          type: "camera_boundary",
          timestamp: Date.now() / 1000,
        },
      };
    }
  );

  return {
    vehicles: vehicleFeatures,
    collisions: collisions,
    paths: pathFeatures,
    video_boundary: videoBoundaryFeature,
    video_boundaries: allBoundaries,
  };
};

/**
 * 실시간 맵 데이터를 가져오는 함수
 * @param {number|null} selectedCameraId - 선택된 카메라 ID (없으면 null)
 * @returns {Promise<Object>} 맵 데이터 객체
 */
export const fetchMapUpdateData = async (selectedCameraId = null) => {
  // 성능을 위해 모든 호출에 로그를 찍지 않고 100번에 1번만 로그 출력
  const shouldLog = Math.random() < 0.01;

  if (shouldLog) {
    console.log(
      "[NaverMapData] fetchMapUpdateData 호출됨",
      new Date().toISOString(),
      selectedCameraId
        ? `선택된 카메라: ${selectedCameraId}`
        : "카메라 선택 없음"
    );
  }

  try {
    // 개발 환경에서만 모의 데이터 사용
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
      // 샘플 데이터를 생성하여 반환합니다.
      const data = createSampleData(selectedCameraId);

      if (shouldLog) {
        console.log("[NaverMapData] 모의 맵 데이터 생성 완료", {
          vehicles: data.vehicles.length,
          collisions: data.collisions.length,
          카메라: selectedCameraId,
          timestamp: new Date().toISOString(),
        });
      }

      return data;
    } else {
      // 실제 API 호출
      const data = await mapApi.getMapUpdateData(selectedCameraId);

      if (shouldLog) {
        console.log("[NaverMapData] API 맵 데이터 로드 완료", {
          vehicles: data.vehicles?.length || 0,
          collisions: data.collisions?.length || 0,
          카메라: selectedCameraId,
          timestamp: new Date().toISOString(),
        });
      }

      return data;
    }
  } catch (error) {
    console.error("[NaverMapData] 맵 데이터 업데이트 오류:", error);
    throw new Error("맵 데이터를 가져오는데 실패했습니다.");
  }
};

// 이전 버전과의 호환성 유지
export const getMapUpdateData = () => {
  console.log("[NaverMapData] 기존 getMapUpdateData 호출됨 (deprecated)");
  return createSampleData(null);
};

export default {
  fetchMapUpdateData,
  getMapUpdateData,
};
