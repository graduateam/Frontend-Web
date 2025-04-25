import { useEffect, useRef } from "react";

const useMapBoundaries = (
  mapInstanceRef,
  isScriptLoaded,
  mapData,
  selectedCamera,
  isDetailsPanelOpen
) => {
  // 경계 참조
  const videoBoundaryRef = useRef(null);
  const allVideoBoundariesRef = useRef([]);

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
  }, [isScriptLoaded, mapData?.video_boundaries, mapInstanceRef]);

  // 선택된 카메라 비디오 경계 업데이트
  useEffect(() => {
    if (!isScriptLoaded || !mapInstanceRef.current || !mapData) return;

    try {
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
      }
    } catch (error) {
      console.error(
        "[NaverMap] 선택된 카메라 비디오 경계 업데이트 중 오류:",
        error
      );
    }
  }, [
    isScriptLoaded,
    mapData,
    selectedCamera,
    isDetailsPanelOpen,
    mapInstanceRef,
  ]);

  return {
    videoBoundaryRef,
    allVideoBoundariesRef,
  };
};

export default useMapBoundaries;
