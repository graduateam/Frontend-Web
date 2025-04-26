import React from "react";
import useMapBoundaries from "./hooks/useMapBoundaries";

const MapBoundaryLayer = ({
  mapInstanceRef,
  isScriptLoaded,
  mapData,
  selectedCamera,
  isDetailsPanelOpen,
}) => {
  // 경계 관련 훅 사용
  useMapBoundaries(
    mapInstanceRef,
    isScriptLoaded,
    mapData,
    selectedCamera,
    isDetailsPanelOpen
  );

  // 실제 렌더링하는 것은 없고, 훅을 통해 지도 객체에 직접 다각형 추가
  return null;
};

export default MapBoundaryLayer;
