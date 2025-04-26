import React, { useState, useEffect } from "react";
import useNaverMapInit from "./hooks/useNaverMapInit";
import useMapDataUpdater from "./hooks/useMapDataUpdater";
import useCameraFocus from "./hooks/useCameraFocus";
import MapMarkerLayer from "./MapMarkerLayer";
import MapBoundaryLayer from "./MapBoundaryLayer";
import CameraDetailsPanel from "../camera/CameraDetailsPanel";

console.log("[NaverMap] 컴포넌트 정의");

const NaverMap = ({ selectedCameraId, cameras, onPanelStateChange }) => {
  // 훅 사용
  const {
    mapRef,
    mapInstanceRef,
    isScriptLoaded,
    mapError,
    mapData,
    setMapData,
  } = useNaverMapInit();

  // 카메라 상세 정보 패널 상태
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // 카메라 포커싱 훅
  useCameraFocus(
    mapInstanceRef,
    isScriptLoaded,
    selectedCameraId,
    cameras,
    isDetailsPanelOpen
  );

  // 데이터 업데이트 훅
  useMapDataUpdater(
    mapInstanceRef,
    selectedCamera,
    isDetailsPanelOpen,
    setMapData
  );

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

    // 선택된 카메라 찾기
    const camera = cameras.find((cam) => cam.id === selectedCameraId);
    if (!camera) return;

    // 먼저 선택된 카메라와 패널 상태를 설정
    setSelectedCamera(camera);
    setIsDetailsPanelOpen(true);
  }, [selectedCameraId, isScriptLoaded, cameras, mapInstanceRef]);

  // 카메라 클릭 핸들러
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    setIsDetailsPanelOpen(true);
  };

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

      {/* 마커 레이어 */}
      <MapMarkerLayer
        mapInstanceRef={mapInstanceRef}
        isScriptLoaded={isScriptLoaded}
        cameras={cameras}
        selectedCamera={selectedCamera}
        isDetailsPanelOpen={isDetailsPanelOpen}
        mapData={mapData}
        onCameraClick={handleCameraClick}
      />

      {/* 경계 레이어 */}
      <MapBoundaryLayer
        mapInstanceRef={mapInstanceRef}
        isScriptLoaded={isScriptLoaded}
        mapData={mapData}
        selectedCamera={selectedCamera}
        isDetailsPanelOpen={isDetailsPanelOpen}
      />

      {/* 카메라 상세 패널 */}
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
