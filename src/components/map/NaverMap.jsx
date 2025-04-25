import React, { useEffect, useRef, useState } from "react";
import { fetchMapUpdateData } from "../../utils/NaverMapData";
import { fetchCameraData } from "../../utils/CameraData"; // 새로 만든 CameraData 가져오기
import CameraDetailsPanel from "./CameraDetailsPanel"; // 카메라 상세 패널 불러오기
import "../../assets/styles/CameraDetailsPanel.css";

console.log("[NaverMap] 컴포넌트 정의");

const NaverMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [cameras, setCameras] = useState([]); // mockCameraData 대신 상태로 관리
  const cameraMarkersRef = useRef([]);

  // 카메라 상세 정보 패널 상태
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

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

        // 초기 데이터 가져오기
        console.log("[NaverMap] 초기 맵 데이터 요청 시작");
        fetchMapUpdateData()
          .then((initialData) => {
            console.log("[NaverMap] 초기 맵 데이터 로드 완료", {
              vehicles: initialData.vehicles.length,
              collisions: initialData.collisions.length,
              paths: initialData.paths.length,
              timestamp: new Date().toISOString(),
            });
            setMapData(initialData);
          })
          .catch((error) => {
            console.error("[NaverMap] 초기 맵 데이터 로드 실패:", error);
          });

        // 카메라 데이터 가져오기 (1회만)
        console.log("[NaverMap] 카메라 데이터 요청 시작");
        fetchCameraData()
          .then((cameraData) => {
            console.log("[NaverMap] 카메라 데이터 로드 완료", {
              count: cameraData.length,
              cameras: cameraData.map((c) => `${c.id}:${c.name}`).join(", "),
            });
            setCameras(cameraData);
          })
          .catch((error) => {
            console.error("[NaverMap] 카메라 데이터 로드 실패:", error);
            setMapError("카메라 정보를 불러오지 못했습니다.");
          });
      } catch (error) {
        console.error("[NaverMap] 지도 초기화 중 오류:", error);
        setMapError("지도 초기화 중 오류가 발생했습니다.");
      }
    }
  }, [isScriptLoaded]);

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
                  src="/src/assets/images/icons/camera-icon.svg" 
                  alt="카메라 ${camera.id}" 
                  width="${imageSize * 0.75}" 
                  height="${imageSize * 0.75}"
                />
              </div>
            `,
              anchor: new window.naver.maps.Point(20, 20), // 마커 중앙 지점
            },
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

  // 주기적으로 데이터 업데이트 (초당 12회 = 약 83ms마다)
  useEffect(() => {
    console.log("[NaverMap] 맵 데이터 업데이트 useEffect 실행", {
      mapReady: !!mapInstanceRef.current,
    });

    if (!mapInstanceRef.current) return;

    // 업데이트 로그 카운터
    let updateCount = 0;
    let successCount = 0;
    let errorCount = 0;
    let lastLogTime = Date.now();

    console.log("[NaverMap] 맵 데이터 실시간 업데이트 시작 (간격: 83ms)");

    const interval = setInterval(async () => {
      updateCount++;

      try {
        // API 호출 형태로 변경
        const newData = await fetchMapUpdateData();
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
    }, 83); // 약 12fps

    return () => {
      console.log("[NaverMap] 맵 데이터 업데이트 중단");
      clearInterval(interval);
    };
  }, [mapInstanceRef.current]);

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
      <div
        className="map-error bg-gray-10 text-traffic-orange-b3"
        style={{ padding: "20px", textAlign: "center", height: "100%" }}
      >
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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "500px",
        }}
      />

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
