import React from "react";

const CameraVideo = ({ camera }) => {
  if (!camera) return null;

  return (
    <div className="video-container">
      <div className="video-placeholder">
        <div className="video-text seoul-14-bold">
          <p>카메라 스트림 연결되지 않음</p>
          <p>상태: {camera.status}</p>
        </div>
      </div>
    </div>
  );
};

export default CameraVideo;
