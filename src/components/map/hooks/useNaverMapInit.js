import { useState, useEffect, useRef } from "react";
import { fetchMapUpdateData } from "../../../utils/NaverMapData";

const useNaverMapInit = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [mapData, setMapData] = useState(null);

  // 지도 스크립트 로드
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
          zoomControl: false, // 줌 컨트롤 비활성화
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

  return {
    mapRef,
    mapInstanceRef,
    isScriptLoaded,
    mapError,
    mapData,
    setMapData,
  };
};

export default useNaverMapInit;
