import React, { useEffect, useRef, useState } from "react";
import { fetchMapUpdateData } from "../../utils/NaverMapData";
import CameraDetailsPanel from "./CameraDetailsPanel";

console.log("[NaverMap] 컴포넌트 정의");

// 이미지를 모듈로 가져와서 URL 생성
const ICONS = {
  camera: new URL("@/assets/images/icons/camera-icon.svg", import.meta.url)
    .href,
  vehicle: new URL("@/assets/images/icons/vehicle-icon.svg", import.meta.url)
    .href,
  person: new URL("@/assets/images/icons/person-icon.svg", import.meta.url)
    .href,
};

const NaverMap = ({ selectedCameraId, cameras, onPanelStateChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [mapData, setMapData] = useState(null);
  const cameraMarkersRef = useRef([]);
  // 차량 및 인원 마커를 관리하기 위한 ref 추가
  const vehicleMarkersRef = useRef([]);
  const personMarkersRef = useRef([]);
  // 비디오 경계 다각형을 관리하기 위한 ref 추가
  const videoBoundaryRef = useRef(null);
  const allVideoBoundariesRef = useRef([]);

  // 카메라 마커를 ID별로 빠르게 접근하기 위한 ref
  const cameraMarkersByIdRef = useRef({});

  // 카메라 상세 정보 패널 상태
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // 데이터 업데이트 인터벌 참조 저장
  const updateIntervalRef = useRef(null);

  useEffect(() => {
    // 이미 스크립트가 로드되었는지 확인
    if (document.getElementById("naver-maps-script")) {
      setIsScriptLoaded(true);
      return;
    }

    // 환경 변수에서 클라이언트 ID 가져오기
    const clientId = import.meta.env.VITE_NAVER_MAPS_CLIENT_ID;

    if (!clientId) {
      setMapError("네이버 지도 API 키가 설정되지 않았습니다.");
      return;
    }

    // 스크립트 엘리먼트 생성
    const script = document.createElement("script");
    script.id = "naver-maps-script";
    script.type = "text/javascript";
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    // 스크립트 로드 성공 처리
    script.onload = () => {
      console.log("네이버 지도 API 스크립트 로드 성공");
      setIsScriptLoaded(true);
    };

    // 스크립트 로드 실패 처리
    script.onerror = () => {
      console.error("네이버 지도 API 스크립트 로드 실패");
      setMapError("네이버 지도 API를 불러오지 못했습니다.");
    };

    // 스크립트 추가
    document.head.appendChild(script);

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      if (document.getElementById("naver-maps-script")) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    console.log("[NaverMap] 지도 초기화 useEffect 실행", { isScriptLoaded });

    // 스크립트가 로드된 후에만 지도 초기화
    if (isScriptLoaded && window.naver && window.naver.maps) {
      try {
        console.log("[NaverMap] 지도 초기화 시작");

        const mapOptions = {
          center: new window.naver.maps.LatLng(37.5666805, 126.9784147),
          zoom: 14,
          mapTypeControl: false, // 지도 타입 컨트롤(일반/위성) 제거
          scaleControl: false, // 축척 컨트롤 제거
          logoControl: true, // 로고는 유지 (법적 요구사항)
          mapDataControl: false, // 데이터 저작권 컨트롤 제거
          zoomControl: true, // 줌 컨트롤 활성화
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;
        console.log("[NaverMap] Naver Map 초기화 성공!", {
          center: mapOptions.center.toString(),
          zoom: mapOptions.zoom,
        });

        // 인증 에러 처리
        window.naver.maps.Event.addListener(map, "auth_error", (error) => {
          console.error("[NaverMap] 네이버 지도 인증 오류:", error);
          setMapError(
            "네이버 지도 인증에 실패했습니다. 관리자에게 문의하세요."
          );
        });

        // 초기 데이터 가져오기 (카메라 선택 없음)
        console.log("[NaverMap] 초기 맵 데이터 요청 시작");
        fetchMapUpdateData()
          .then((initialData) => {
            console.log("[NaverMap] 초기 맵 데이터 로드 완료", {
              vehicles: initialData.vehicles ? initialData.vehicles.length : 0,
              collisions: initialData.collisions
                ? initialData.collisions.length
                : 0,
              boundaries: initialData.video_boundaries
                ? initialData.video_boundaries.length
                : 0,
              timestamp: new Date().toISOString(),
            });
            setMapData(initialData);
          })
          .catch((error) => {
            console.error("[NaverMap] 초기 맵 데이터 로드 실패:", error);
          });
      } catch (error) {
        console.error("[NaverMap] 지도 초기화 중 오류:", error);
        setMapError("지도 초기화 중 오류가 발생했습니다.");
      }
    }
  }, [isScriptLoaded]);

  // 패널 상태 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (typeof onPanelStateChange === "function") {
      onPanelStateChange(isDetailsPanelOpen);
    }
  }, [isDetailsPanelOpen, onPanelStateChange]);

  // props로 받은 selectedCameraId가 변경될 때 처리
  useEffect(() => {
    if (
      !selectedCameraId ||
      !isScriptLoaded ||
      !mapInstanceRef.current ||
      cameras.length === 0
    )
      return;

    console.log(`[NaverMap] 드롭다운으로 카메라 ${selectedCameraId} 선택됨`);

    // 선택된 카메라 찾기
    const camera = cameras.find((cam) => cam.id === selectedCameraId);
    if (!camera) {
      console.error(`[NaverMap] 카메라 ID ${selectedCameraId}를 찾을 수 없음`);
      return;
    }

    // 먼저 선택된 카메라와 패널 상태를 설정
    setSelectedCamera(camera);
    setIsDetailsPanelOpen(true);

    // 약간의 딜레이를 두고 지도 중심 조정 (패널이 열리는 것을 기다림)
    setTimeout(() => {
      // 카메라 위치를 LatLng 객체로 변환
      const cameraPosition = new window.naver.maps.LatLng(
        camera.location.latitude,
        camera.location.longitude
      );

      const map = mapInstanceRef.current;
      const panelWidth = 350; // CameraDetailsPanel의 너비 (px)

      // 1. 먼저 줌 레벨 설정
      map.setZoom(16);

      // 2. 지도 투영 객체 가져오기
      const projection = map.getProjection();

      // 3. 카메라 위치를 픽셀로 변환
      const cameraPixel = projection.fromCoordToOffset(cameraPosition);

      // 4. 요구사항: 지도 중심이 카메라 마커 기준 오른쪽으로 패널 너비의 절반만큼 이동
      const offsetPixels = panelWidth / 2; // 패널 너비의 절반 (175px)

      // 5. 중심점을 오른쪽으로 이동 (카메라 마커는 상대적으로 왼쪽에 위치)
      cameraPixel.x += offsetPixels;

      // 6. 조정된 픽셀 좌표를 지도 좌표로 변환
      const newCenter = projection.fromOffsetToCoord(cameraPixel);

      // 7. 새 중심점으로 지도 이동
      map.setCenter(newCenter);

      console.log(
        `[NaverMap] 지도 중심 이동: 카메라 위치에서 오른쪽으로 ${offsetPixels}px 이동`
      );
    }, 100); // 100ms 딜레이
  }, [selectedCameraId, isScriptLoaded, cameras, mapInstanceRef.current]);

  // 카메라 마커 추가
  useEffect(() => {
    console.log("[NaverMap] 카메라 마커 useEffect 실행", {
      isScriptLoaded,
      mapReady: !!mapInstanceRef.current,
      camerasCount: cameras.length,
    });

    if (isScriptLoaded && mapInstanceRef.current && cameras.length > 0) {
      try {
        console.log("[NaverMap] 카메라 마커 추가 시작");

        // 기존 마커 제거
        if (cameraMarkersRef.current.length > 0) {
          console.log(
            `[NaverMap] 기존 마커 ${cameraMarkersRef.current.length}개 제거`
          );
          cameraMarkersRef.current.forEach((marker) => marker.setMap(null));
          cameraMarkersRef.current = [];
        }

        // 마커 ID별 참조 초기화
        cameraMarkersByIdRef.current = {};

        // 카메라 마커 추가
        cameras.forEach((camera) => {
          const markerPosition = new window.naver.maps.LatLng(
            camera.location.latitude,
            camera.location.longitude
          );

          // 이미지 크기 정의 (기준값)
          const imageSize = 40;

          const marker = new window.naver.maps.Marker({
            position: markerPosition,
            map: mapInstanceRef.current,
            icon: {
              content: `
              <div style="cursor: pointer;">
                <img 
                  src="${ICONS.camera}"  // 수정: 동적으로 생성된 URL 사용
                  alt="카메라 ${camera.id}" 
                  width="${imageSize * 0.75}" 
                  height="${imageSize * 0.75}"
                />
              </div>
            `,
              anchor: new window.naver.maps.Point(20, 20), // 마커 중앙 지점
            },
            zIndex: 100, // 비디오 경계보다 높은 z-index 설정
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, "click", () => {
            console.log(`[NaverMap] 카메라 ${camera.id} 클릭: ${camera.name}`, {
              위치: `${camera.location.latitude}, ${camera.location.longitude}`,
              상태: camera.status,
            });

            // 카메라 상세 정보 패널 열기
            setSelectedCamera(camera);
            setIsDetailsPanelOpen(true);
          });

          cameraMarkersRef.current.push(marker);

          // ID별 마커 참조 저장 (드롭다운 선택 시 활용)
          cameraMarkersByIdRef.current[camera.id] = marker;
        });

        console.log("[NaverMap] 카메라 마커 추가 완료:", {
          count: cameras.length,
          ids: cameras.map((c) => c.id).join(", "),
        });
      } catch (error) {
        console.error("[NaverMap] 카메라 마커 추가 중 오류:", error);
      }
    }
  }, [isScriptLoaded, cameras]);

  // 비디오 경계 영역 업데이트 - 모든 카메라 경계 표시
  useEffect(() => {
    if (!isScriptLoaded || !mapInstanceRef.current || !mapData) return;

    try {
      // 기존 모든 비디오 경계 제거
      if (allVideoBoundariesRef.current.length > 0) {
        allVideoBoundariesRef.current.forEach((boundary) =>
          boundary.setMap(null)
        );
        allVideoBoundariesRef.current = [];
      }

      // 모든 카메라의 비디오 경계 추가
      if (mapData.video_boundaries && mapData.video_boundaries.length > 0) {
        mapData.video_boundaries.forEach((boundary) => {
          if (boundary.geometry && boundary.geometry.coordinates) {
            try {
              // 비디오 경계 좌표 가져오기
              const coordinates = boundary.geometry.coordinates[0];

              // 네이버 지도 API 형식으로 좌표 변환 (경도,위도 → LatLng 객체)
              const pathCoordinates = coordinates.map(
                ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
              );

              // 다각형 생성
              const polygon = new window.naver.maps.Polygon({
                map: mapInstanceRef.current,
                paths: pathCoordinates,
                fillColor: "#e15501", // 주황색 (traffic-orange 컬러와 일치)
                fillOpacity: 0.1, // 10% 불투명도 (선택되지 않은 카메라는 더 투명하게)
                strokeColor: "#e15501",
                strokeWeight: 1,
                strokeOpacity: 0.4,
                zIndex: 1, // 마커보다 낮은 z-index
              });

              // 카메라 ID 저장
              polygon.set("camera_id", boundary.properties.camera_id);

              // ref에 저장
              allVideoBoundariesRef.current.push(polygon);
            } catch (error) {
              console.error("[NaverMap] 비디오 경계 처리 중 오류:", error);
            }
          }
        });

        console.log(
          `[NaverMap] 모든 카메라 비디오 경계 업데이트 완료: ${allVideoBoundariesRef.current.length}개`
        );
      }
    } catch (error) {
      console.error("[NaverMap] 비디오 경계 영역 업데이트 중 오류:", error);
    }
  }, [isScriptLoaded, mapData?.video_boundaries]);

  // 차량 및 사람 마커, 선택된 카메라 비디오 경계 업데이트 - mapData가 변경될 때마다 실행
  // 카메라가 선택된 경우에만 차량 데이터 표시
  useEffect(() => {
    if (!isScriptLoaded || !mapInstanceRef.current || !mapData) return;

    try {
      // 기존 차량 마커 제거
      if (vehicleMarkersRef.current.length > 0) {
        vehicleMarkersRef.current.forEach((marker) => marker.setMap(null));
        vehicleMarkersRef.current = [];
      }

      // 기존 인원 마커 제거 (향후 인원 데이터가 추가될 경우를 대비)
      if (personMarkersRef.current.length > 0) {
        personMarkersRef.current.forEach((marker) => marker.setMap(null));
        personMarkersRef.current = [];
      }

      // 기존 선택된 비디오 경계 제거
      if (videoBoundaryRef.current) {
        videoBoundaryRef.current.setMap(null);
        videoBoundaryRef.current = null;
      }

      // 선택된 카메라가 있고 패널이 열려있는 경우에만 처리
      if (selectedCamera && isDetailsPanelOpen) {
        // 선택된 카메라의 비디오 경계 업데이트
        if (
          mapData.video_boundary &&
          mapData.video_boundary.geometry &&
          mapData.video_boundary.geometry.coordinates
        ) {
          try {
            // 비디오 경계 좌표 가져오기
            const coordinates = mapData.video_boundary.geometry.coordinates[0];

            // 네이버 지도 API 형식으로 좌표 변환 (경도,위도 → LatLng 객체)
            const pathCoordinates = coordinates.map(
              ([lng, lat]) => new window.naver.maps.LatLng(lat, lng)
            );

            // 다각형 생성
            const polygon = new window.naver.maps.Polygon({
              map: mapInstanceRef.current,
              paths: pathCoordinates,
              fillColor: "#e15501", // 주황색 (traffic-orange 컬러와 일치)
              fillOpacity: 0.3, // 30% 불투명도 (선택된 카메라는 더 진하게)
              strokeColor: "#e15501",
              strokeWeight: 2,
              strokeOpacity: 0.8,
              zIndex: 2, // 선택된 카메라는 더 높은 z-index
            });

            // ref에 저장
            videoBoundaryRef.current = polygon;

            console.log(
              `[NaverMap] 선택된 카메라 ${selectedCamera.id} 비디오 경계 업데이트 완료`
            );
          } catch (error) {
            console.error("[NaverMap] 비디오 경계 처리 중 오류:", error);
          }
        }

        // 차량 마커 추가
        if (mapData.vehicles && mapData.vehicles.length > 0) {
          mapData.vehicles.forEach((vehicle) => {
            if (!vehicle.geometry || !vehicle.geometry.coordinates) return;

            const [longitude, latitude] = vehicle.geometry.coordinates;
            const markerPosition = new window.naver.maps.LatLng(
              latitude,
              longitude
            );

            // 이미지 크기 정의 (카메라 마커와 동일한 크기)
            const imageSize = 40;

            const marker = new window.naver.maps.Marker({
              position: markerPosition,
              map: mapInstanceRef.current,
              icon: {
                content: `
                  <div style="cursor: pointer;">
                    <img 
                      src="${ICONS.vehicle}"  // 수정: 동적으로 생성된 URL 사용
                      alt="차량 ${vehicle.properties.id}" 
                      width="${imageSize * 0.75}" 
                      height="${imageSize * 0.75}"
                    />
                  </div>
                `,
                anchor: new window.naver.maps.Point(20, 20), // 마커 중앙 지점
              },
              zIndex: 100, // 비디오 경계보다 높은 z-index 설정
            });

            // 마커 클릭 이벤트 (선택적)
            window.naver.maps.Event.addListener(marker, "click", () => {
              console.log(`[NaverMap] 차량 ${vehicle.properties.id} 클릭:`, {
                위치: `${latitude}, ${longitude}`,
                속도: `${vehicle.properties.speed} m/s (${vehicle.properties.speed_kph} km/h)`,
                방향: `${vehicle.properties.heading}°`,
                충돌위험: vehicle.properties.is_collision_risk
                  ? "있음"
                  : "없음",
                충돌시간: vehicle.properties.ttc
                  ? `${vehicle.properties.ttc}초 후`
                  : "없음",
              });
            });

            vehicleMarkersRef.current.push(marker);
          });
        }

        // 인원 마커는 현재 데이터에 없지만, 향후 확장성을 위해 구현
        // mapData에 persons 데이터가 있을 경우에만 실행됨
        if (mapData.persons && mapData.persons.length > 0) {
          mapData.persons.forEach((person) => {
            if (!person.geometry || !person.geometry.coordinates) return;

            const [longitude, latitude] = person.geometry.coordinates;
            const markerPosition = new window.naver.maps.LatLng(
              latitude,
              longitude
            );

            // 이미지 크기 정의 (카메라 마커와 동일한 크기)
            const imageSize = 40;

            const marker = new window.naver.maps.Marker({
              position: markerPosition,
              map: mapInstanceRef.current,
              icon: {
                content: `
                  <div style="cursor: pointer;">
                    <img 
                      src="${ICONS.person}"  // 수정: 동적으로 생성된 URL 사용
                      alt="인원 ${person.properties.id}" 
                      width="${imageSize * 0.75}" 
                      height="${imageSize * 0.75}"
                    />
                  </div>
                `,
                anchor: new window.naver.maps.Point(20, 20), // 마커 중앙 지점
              },
              zIndex: 100, // 비디오 경계보다 높은 z-index 설정
            });

            personMarkersRef.current.push(marker);
          });
        }
      }
    } catch (error) {
      console.error("[NaverMap] 차량/인원 마커 업데이트 중 오류:", error);
    }
  }, [isScriptLoaded, mapData, selectedCamera, isDetailsPanelOpen]);

  // 선택된 카메라에 따른 데이터 업데이트 간격 설정
  useEffect(() => {
    // 기존 인터벌 정리
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    // 지도가 초기화되지 않았으면 리턴
    if (!mapInstanceRef.current) return;

    console.log("[NaverMap] 맵 데이터 업데이트 useEffect 실행", {
      mapReady: !!mapInstanceRef.current,
      selectedCamera: selectedCamera?.id || "none",
      isDetailsPanelOpen,
    });

    // 업데이트 로그 카운터
    let updateCount = 0;
    let successCount = 0;
    let errorCount = 0;
    let lastLogTime = Date.now();

    // 업데이트 간격 설정 (카메라 선택 여부에 따라 다르게)
    const updateInterval = isDetailsPanelOpen && selectedCamera ? 83 : 1000; // 약 12fps 또는 1fps

    console.log(
      `[NaverMap] 맵 데이터 실시간 업데이트 시작 (간격: ${updateInterval}ms)`
    );

    // 인터벌 설정
    updateIntervalRef.current = setInterval(async () => {
      updateCount++;

      try {
        // 선택된 카메라 ID 전달
        const cameraId =
          isDetailsPanelOpen && selectedCamera ? selectedCamera.id : null;
        const newData = await fetchMapUpdateData(cameraId);
        setMapData(newData);
        successCount++;

        // 10초에 한 번씩만 통계 로그
        const now = Date.now();
        if (now - lastLogTime > 10000) {
          console.log("[NaverMap] 맵 데이터 업데이트 통계:", {
            총시도: updateCount,
            성공: successCount,
            실패: errorCount,
            성공률: `${((successCount / updateCount) * 100).toFixed(1)}%`,
            초당호출수: ((updateCount * 1000) / (now - lastLogTime)).toFixed(1),
            선택카메라: cameraId || "none",
          });

          // 로그 출력 후 카운터 리셋
          updateCount = 0;
          successCount = 0;
          errorCount = 0;
          lastLogTime = now;
        }
      } catch (error) {
        errorCount++;
        console.error("[NaverMap] 맵 데이터 업데이트 중 오류:", error);
      }
    }, updateInterval);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      console.log("[NaverMap] 맵 데이터 업데이트 중단");
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [mapInstanceRef.current, selectedCamera, isDetailsPanelOpen]);

  // 카메라 상세 패널 닫기 핸들러
  const handleCloseDetailsPanel = () => {
    setIsDetailsPanelOpen(false);
    // 패널이 닫힌 후 선택된 카메라 정보 초기화 (애니메이션 끝난 후)
    setTimeout(() => {
      setSelectedCamera(null);
    }, 300); // CSS 트랜지션 시간과 일치
  };

  // 에러 발생 시 표시
  if (mapError) {
    return (
      <div className="map-error bg-gray-10 text-traffic-orange-b3">
        <p className="seoul-16-bold">{mapError}</p>
        <button
          className="bg-traffic-orange text-white mt-4 py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-container" />

      <CameraDetailsPanel
        camera={selectedCamera}
        isOpen={isDetailsPanelOpen}
        onClose={handleCloseDetailsPanel}
        collisions={mapData?.collisions || []} // 실시간 충돌 데이터 전달
      />
    </div>
  );
};

export default NaverMap;
