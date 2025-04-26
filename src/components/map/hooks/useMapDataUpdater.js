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
  }, [mapInstanceRef.current, selectedCamera, isDetailsPanelOpen, setMapData]);

  return {
    updateIntervalRef,
  };
};

export default useMapDataUpdater;
