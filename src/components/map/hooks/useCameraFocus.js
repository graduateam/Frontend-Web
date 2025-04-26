import { useEffect } from "react";

const useCameraFocus = (
  mapInstanceRef,
  isScriptLoaded,
  selectedCameraId,
  cameras,
  isDetailsPanelOpen
) => {
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
  }, [selectedCameraId, isScriptLoaded, cameras, mapInstanceRef]);
};

export default useCameraFocus;
