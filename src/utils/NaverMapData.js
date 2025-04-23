// NaverMapData.js
// 예시 데이터 - 서버의 map_update 이벤트 포맷을 모방한 GeoJSON 데이터

export const createSampleData = () => {
  // 현재 시간 기준 타임스탬프 생성
  const now = new Date();
  const timestamp = now.toISOString();

  // 서울 시청 근처 좌표 기준 (위도, 경도)
  const baseCoords = [37.5666805, 126.9784147];

  // 임의의 차량 ID 생성 (1~100 사이)
  const vehicleId1 = Math.floor(Math.random() * 100) + 1;
  const vehicleId2 = Math.floor(Math.random() * 100) + 1;

  // 속도 생성 (5~30 m/s 사이)
  const speed1 = (Math.random() * 25 + 5).toFixed(1);
  const speed2 = (Math.random() * 25 + 5).toFixed(1);

  // 방향 생성 (0~359도 사이)
  const heading1 = (Math.random() * 360).toFixed(2);
  const heading2 = (Math.random() * 360).toFixed(2);

  // 충돌 위험 여부 랜덤 결정
  const isCollisionRisk = Math.random() > 0.7;

  // TTC(충돌까지 남은 시간) 생성 (1~5초 사이, 충돌 위험이 있는 경우만)
  const ttc = isCollisionRisk ? (Math.random() * 4 + 1).toFixed(1) : null;

  // 차량 1 좌표 (기준 좌표에서 약간 이동)
  const vehicle1Coords = [
    baseCoords[0] + (Math.random() * 0.001 - 0.0005),
    baseCoords[1] + (Math.random() * 0.001 - 0.0005),
  ];

  // 차량 2 좌표
  const vehicle2Coords = [
    baseCoords[0] + (Math.random() * 0.002 - 0.001),
    baseCoords[1] + (Math.random() * 0.002 - 0.001),
  ];

  // 충돌 지점 좌표 (두 차량 사이 중간 지점)
  const collisionCoords = isCollisionRisk
    ? [
        (vehicle1Coords[0] + vehicle2Coords[0]) / 2,
        (vehicle1Coords[1] + vehicle2Coords[1]) / 2,
      ]
    : null;

  // 경로 좌표 생성 (현재 위치에서 진행 방향으로)
  const createPathCoords = (baseCoord, heading, steps = 3) => {
    const result = [
      [baseCoord[1], baseCoord[0]], // GeoJSON은 [경도, 위도] 순서
    ];

    // 진행 방향에 따라 다음 좌표 계산
    const headingRad = (parseFloat(heading) * Math.PI) / 180;
    const stepSize = 0.0001; // 좌표 간격

    for (let i = 0; i < steps; i++) {
      const lastCoord = [...result[result.length - 1]];
      const nextLng = lastCoord[0] + Math.sin(headingRad) * stepSize;
      const nextLat = lastCoord[1] + Math.cos(headingRad) * stepSize;
      result.push([nextLng, nextLat]);
    }

    return result;
  };

  // 비디오 경계 영역 생성 (기준 좌표 주변 사각형)
  const createVideoBoundary = (center) => {
    const offset = 0.002; // 경계 크기
    return [
      [center[1] - offset, center[0] - offset], // 좌하단
      [center[1] + offset, center[0] - offset], // 우하단
      [center[1] + offset, center[0] + offset], // 우상단
      [center[1] - offset, center[0] + offset], // 좌상단
      [center[1] - offset, center[0] - offset], // 닫힌 다각형을 위해 첫 점 반복
    ].map((coord) => [coord[0], coord[1]]); // [경도, 위도] 변환
  };

  // GeoJSON 데이터 생성
  return {
    vehicles: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [vehicle1Coords[1], vehicle1Coords[0]], // [경도, 위도] 순서
        },
        properties: {
          id: vehicleId1,
          type: "vehicle",
          heading: heading1,
          speed: speed1,
          speed_kph: (parseFloat(speed1) * 3.6).toFixed(1), // m/s에서 km/h로 변환
          timestamp: timestamp,
          is_collision_risk: isCollisionRisk,
          ttc: isCollisionRisk ? ttc : null,
        },
        rectangle: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [vehicle1Coords[1] - 0.0001, vehicle1Coords[0] - 0.00005], // 좌하단
                [vehicle1Coords[1] + 0.0001, vehicle1Coords[0] - 0.00005], // 우하단
                [vehicle1Coords[1] + 0.0001, vehicle1Coords[0] + 0.00005], // 우상단
                [vehicle1Coords[1] - 0.0001, vehicle1Coords[0] + 0.00005], // 좌상단
                [vehicle1Coords[1] - 0.0001, vehicle1Coords[0] - 0.00005], // 닫힌 다각형을 위해 첫 점 반복
              ],
            ],
          },
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [vehicle2Coords[1], vehicle2Coords[0]], // [경도, 위도] 순서
        },
        properties: {
          id: vehicleId2,
          type: "vehicle",
          heading: heading2,
          speed: speed2,
          speed_kph: (parseFloat(speed2) * 3.6).toFixed(1), // m/s에서 km/h로 변환
          timestamp: timestamp,
          is_collision_risk: isCollisionRisk,
          ttc: isCollisionRisk ? ttc : null,
        },
        rectangle: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [vehicle2Coords[1] - 0.0001, vehicle2Coords[0] - 0.00005], // 좌하단
                [vehicle2Coords[1] + 0.0001, vehicle2Coords[0] - 0.00005], // 우하단
                [vehicle2Coords[1] + 0.0001, vehicle2Coords[0] + 0.00005], // 우상단
                [vehicle2Coords[1] - 0.0001, vehicle2Coords[0] + 0.00005], // 좌상단
                [vehicle2Coords[1] - 0.0001, vehicle2Coords[0] - 0.00005], // 닫힌 다각형을 위해 첫 점 반복
              ],
            ],
          },
        },
      },
    ],
    collisions: isCollisionRisk
      ? [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [collisionCoords[1], collisionCoords[0]], // [경도, 위도] 순서
            },
            properties: {
              id: `${vehicleId1}_${vehicleId2}`,
              type: "collision",
              vehicle_ids: [vehicleId1, vehicleId2],
              ttc: ttc,
              timestamp: timestamp,
            },
          },
        ]
      : [],
    paths: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: createPathCoords(vehicle1Coords, heading1),
        },
        properties: {
          id: `path_${vehicleId1}`,
          vehicle_id: vehicleId1,
          type: "path",
        },
        predicted_path: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: createPathCoords(vehicle1Coords, heading1, 2).slice(1),
          },
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: createPathCoords(vehicle2Coords, heading2),
        },
        properties: {
          id: `path_${vehicleId2}`,
          vehicle_id: vehicleId2,
          type: "path",
        },
        predicted_path: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: createPathCoords(vehicle2Coords, heading2, 2).slice(1),
          },
        },
      },
    ],
    video_boundary: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [createVideoBoundary(baseCoords)],
      },
      properties: {
        type: "camera_boundary",
        timestamp: Date.now() / 1000,
      },
    },
  };
};

// 데이터 갱신 테스트용 함수
export const getMapUpdateData = () => {
  return createSampleData();
};
