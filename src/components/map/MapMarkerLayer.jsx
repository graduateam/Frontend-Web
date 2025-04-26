import React from "react";
import useMapMarkers from "./hooks/useMapMarkers";

const MapMarkerLayer = ({
  mapInstanceRef,
  isScriptLoaded,
  cameras,
  selectedCamera,
  isDetailsPanelOpen,
  mapData,
  onCameraClick,
}) => {
  // 마커 관련 훅 사용
  useMapMarkers(
    mapInstanceRef,
    isScriptLoaded,
    cameras,
    selectedCamera,
    isDetailsPanelOpen,
    mapData,
    onCameraClick
  );

  // 실제 렌더링하는 것은 없고, 훅을 통해 지도 객체에 직접 마커 추가
  return null;
};

export default MapMarkerLayer;
