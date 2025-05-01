import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import NaverMap from "../components/map/NaverMap";
import CameraDropdown from "../components/map/CameraDropdown";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { fetchCameraData } from "../utils/CameraData";

const MainPage = () => {
  const { isAuthenticated } = useAuth();
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 카메라 데이터 가져오기 (최초 1회)
  useEffect(() => {
    const loadCameras = async () => {
      try {
        setIsLoading(true);
        console.log("[MainPage] 로그인 후 백엔드에서 카메라 데이터 요청 시작");
        const cameraData = await fetchCameraData();
        setCameras(cameraData);
        console.log("[MainPage] 백엔드에서 카메라 데이터 로드 완료:", cameraData);
      } catch (error) {
        console.error("[MainPage] 카메라 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCameras();
  }, []);

  // 카메라 선택 핸들러
  const handleSelectCamera = (cameraId) => {
    console.log("[MainPage] 드롭다운에서 카메라 선택:", cameraId);
    setSelectedCameraId(cameraId);
  };

  // 패널 상태 변경 핸들러
  const handlePanelStateChange = (isOpen) => {
    setIsPanelOpen(isOpen);
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="app-container">
      <Header showLogout={true} />

      {isLoading ? (
        <div className="loading-message">카메라 데이터 로딩 중...</div>
      ) : (
        <>
          {/* 카메라 드롭다운 메뉴 */}
          <div
            className={`camera-dropdown-wrapper ${
              isPanelOpen ? "" : "panel-closed"
            }`}
          >
            <CameraDropdown
              cameras={cameras}
              selectedCameraId={selectedCameraId}
              onSelectCamera={handleSelectCamera}
            />
          </div>

          <div className="main-content">
            <div className="map-container">
              <NaverMap
                selectedCameraId={selectedCameraId}
                cameras={cameras}
                onPanelStateChange={handlePanelStateChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPage;