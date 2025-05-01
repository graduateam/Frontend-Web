import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/config";
import "./CameraVideo.css";

const CameraVideo = ({ camera }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 비디오 로딩 상태 처리
  useEffect(() => {
    if (!camera) return;
    
    // 새 카메라 선택시 초기화
    setIsLoading(true);
    setHasError(false);
    
    // 비디오 로딩 시간 시뮬레이션 (실제로는 이미지 onLoad 이벤트 사용 가능)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [camera]);

  // 에러 핸들러
  const handleVideoError = () => {
    console.error("[CameraVideo] 비디오 스트림 로드 실패");
    setHasError(true);
    setIsLoading(false);
  };

  // 비디오 로드 완료 핸들러
  const handleVideoLoad = () => {
    console.log("[CameraVideo] 비디오 스트림 로드 완료");
    setIsLoading(false);
  };

  if (!camera) return null;

  // 비디오 스트림 URL 생성
  const videoStreamUrl = `${API_BASE_URL}/api/video-feed/${camera.id}`;
  console.log("[CameraVideo] 스트림 URL:", videoStreamUrl);

  return (
    <div className="video-container">
      {isLoading && (
        <div className="video-loading">
          <div className="loading-spinner"></div>
          <p className="seoul-14-bold">비디오 스트림 로딩 중...</p>
        </div>
      )}
      
      {hasError && (
        <div className="video-error seoul-14-bold">
          <p>비디오 스트림을 불러올 수 없습니다</p>
          <p>상태: {camera.status}</p>
        </div>
      )}
      
      <img
        src={videoStreamUrl}
        alt={`카메라 ${camera.id} 스트림`}
        className={`video-stream ${isLoading ? 'hidden' : ''}`}
        onError={handleVideoError}
        onLoad={handleVideoLoad}
      />
    </div>
  );
};

export default CameraVideo;
