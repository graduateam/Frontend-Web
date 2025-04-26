import { useEffect, useRef } from "react";

// 이미지 URL 상수
const ICONS = {
  camera: new URL("@/assets/images/icons/camera-icon.svg", import.meta.url)
    .href,
  vehicle: new URL("@/assets/images/icons/vehicle-icon.svg", import.meta.url)
    .href,
  person: new URL("@/assets/images/icons/person-icon.svg", import.meta.url)
    .href,
};

const useMapMarkers = (
  mapInstanceRef,
  isScriptLoaded,
  cameras,
  selectedCamera,
  isDetailsPanelOpen,
  mapData,
  onCameraClick
) => {
  // 마커 참조
  const cameraMarkersRef = useRef([]);
  const vehicleMarkersRef = useRef([]);
  const personMarkersRef = useRef([]);
  const cameraMarkersByIdRef = useRef({});

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
                  src="${ICONS.camera}"
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

            // 카메라 클릭 핸들러 호출
            if (onCameraClick) {
              onCameraClick(camera);
            }
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
  }, [isScriptLoaded, cameras, mapInstanceRef, onCameraClick]);

  // 차량 및 사람 마커 업데이트 - mapData가 변경될 때마다 실행
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

      // 선택된 카메라가 있고 패널이 열려있는 경우에만 처리
      if (selectedCamera && isDetailsPanelOpen) {
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
                      src="${ICONS.vehicle}"
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
                      src="${ICONS.person}"
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
  }, [
    isScriptLoaded,
    mapData,
    selectedCamera,
    isDetailsPanelOpen,
    mapInstanceRef,
  ]);

  return {
    cameraMarkersRef,
    vehicleMarkersRef,
    personMarkersRef,
    cameraMarkersByIdRef,
  };
};

export default useMapMarkers;
