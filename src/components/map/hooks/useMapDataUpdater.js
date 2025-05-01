import { useEffect, useRef } from "react";
import { fetchMapUpdateData } from "../../../utils/NaverMapData";

const useMapDataUpdater = (
  mapInstanceRef,
  selectedCamera,
  isDetailsPanelOpen,
  setMapData
) => {
  // 데이터 업데이트 인터벌 참조
  const updateIntervalRef = useRef(null);

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

    // 실시간 업데이트 비활성화 (요구사항 1)
    console.log("[NaverMap] 실시간 맵 데이터 업데이트 비활성화됨");

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [mapInstanceRef.current, selectedCamera, isDetailsPanelOpen, setMapData]);

  return {
    updateIntervalRef,
  };
};

export default useMapDataUpdater;