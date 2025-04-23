import React, { useEffect, useRef, useState } from "react";
import { getMapUpdateData } from "../../utils/NaverMapData"; // 예시 데이터 가져오기

const NaverMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [mapData, setMapData] = useState(null);

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
    // 스크립트가 로드된 후에만 지도 초기화
    if (isScriptLoaded && window.naver && window.naver.maps) {
      try {
        const mapOptions = {
          center: new window.naver.maps.LatLng(37.5666805, 126.9784147),
          zoom: 14,
          mapTypeControl: true,
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;
        console.log("Naver Map 초기화 성공!");

        // 인증 에러 처리
        window.naver.maps.Event.addListener(map, "auth_error", (error) => {
          console.error("네이버 지도 인증 오류:", error);
          setMapError(
            "네이버 지도 인증에 실패했습니다. 관리자에게 문의하세요."
          );
        });

        // 초기 데이터 가져오기
        const initialData = getMapUpdateData();
        setMapData(initialData);
        console.log("초기 데이터 로드:", initialData);
      } catch (error) {
        console.error("지도 초기화 중 오류:", error);
        setMapError("지도 초기화 중 오류가 발생했습니다.");
      }
    }
  }, [isScriptLoaded]);

  // 주기적으로 데이터 업데이트 (초당 12회 = 약 83ms마다)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const interval = setInterval(() => {
      // 실제로는 서버에서 WebSocket으로 데이터를 받아옴
      // 여기서는 예시 데이터를 생성
      const newData = getMapUpdateData();
      setMapData(newData);
      console.log("데이터 업데이트:", new Date().toISOString());
    }, 83); // 약 12fps

    return () => clearInterval(interval);
  }, [mapInstanceRef.current]);

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
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
      }}
    />
  );
};

export default NaverMap;
