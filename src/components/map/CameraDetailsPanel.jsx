import React, { useState, useEffect } from "react";
// 경로 수정
import "../../assets/styles/CameraDetailsPanel.css";

const CameraDetailsPanel = ({ camera, onClose, isOpen, collisions }) => {
  // 충돌 로그를 저장할 상태 추가
  const [collisionLogs, setCollisionLogs] = useState([]);

  // 로그 초기화 함수
  const handleResetLogs = () => {
    // 로그 상태 초기화만 수행
    setCollisionLogs([]);
  };

  // 충돌 데이터가 변경될 때마다 로그 업데이트
  useEffect(() => {
    if (!collisions || collisions.length === 0) return;

    // 새로운 충돌 데이터 처리
    const newCollisions = collisions.map((collision) => {
      // 원본 데이터에서 필요한 정보 추출
      const { properties } = collision;

      return {
        id: properties.id,
        vehicle_ids: properties.vehicle_ids,
        ttc: properties.ttc,
        collision_point: collision.geometry.coordinates.reverse(), // [경도, 위도]를 [위도, 경도]로 변환
        timestamp: properties.timestamp,
      };
    });

    // 기존 로그에 새 충돌 데이터 추가 (중복 제거 및 순서 변경)
    setCollisionLogs((prevLogs) => {
      // 중복 제거를 위해 ID 기반 필터링
      const existingIds = new Set(prevLogs.map((log) => log.id));
      const uniqueNewCollisions = newCollisions.filter(
        (collision) => !existingIds.has(collision.id)
      );

      // 순서 변경: 새 로그를 앞에 추가
      return [...uniqueNewCollisions, ...prevLogs];
    });
  }, [collisions]);

  // 날짜 포맷팅 도우미 함수
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  if (!camera) return null;

  return (
    <div className={`camera-details-panel ${isOpen ? "open" : ""}`}>
      <div className="panel-header">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h3 className="camera-name seoul-16-bold">
          {camera.name} (ID: {camera.id})
        </h3>
      </div>

      <div className="panel-content">
        {/* 영상 컨테이너 */}
        <div className="video-container">
          <div className="video-placeholder">
            <div className="video-text seoul-14-bold">
              <p>카메라 스트림 연결되지 않음</p>
              <p>상태: {camera.status}</p>
            </div>
          </div>
        </div>

        {/* 충돌 로그 */}
        <div className="collision-log">
          <div className="section-header">
            <h4 className="seoul-14-bold">
              충돌 예측 로그 ({collisionLogs.length}건)
            </h4>
            <button onClick={handleResetLogs} className="reset-button">
              초기화
            </button>
          </div>
          <div className="log-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>차량</th>
                  <th>시간</th>
                  <th>위치</th>
                  <th>기록</th>
                </tr>
              </thead>
              <tbody>
                {collisionLogs.map((collision) => (
                  <tr key={collision.id}>
                    <td>{collision.id}</td>
                    <td>{collision.vehicle_ids.join(", ")}</td>
                    <td>{parseFloat(collision.ttc).toFixed(1)}초</td>
                    <td>[{collision.collision_point[0].toFixed(4)}]</td>
                    <td>{formatTimestamp(collision.timestamp)}</td>
                  </tr>
                ))}
                {collisionLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="no-data-message">
                      실시간 충돌 예측 데이터가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetailsPanel;
