import React from "react";

const CameraDetailsPanel = ({ camera, onClose, isOpen }) => {
  // 더미 충돌 예측 데이터
  const dummyCollisionData = [
    {
      id: "3_7",
      vehicle_ids: [3, 7],
      ttc: 2.8,
      collision_point: [37.6768, 126.74585],
      timestamp: "2025-04-25T14:33:41.587",
    },
    {
      id: "4_9",
      vehicle_ids: [4, 9],
      ttc: 3.5,
      collision_point: [37.677, 126.7459],
      timestamp: "2025-04-25T14:33:42.123",
    },
    {
      id: "2_5",
      vehicle_ids: [2, 5],
      ttc: 1.9,
      collision_point: [37.6765, 126.74575],
      timestamp: "2025-04-25T14:33:40.789",
    },
  ];

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
        <h3 className="camera-name seoul-16-bold">{camera.name}</h3>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="panel-content">
        {/* 좌측 영상 컨테이너 */}
        <div className="video-container">
          <div className="video-placeholder">
            <div className="video-text seoul-14-bold">
              <p>카메라 스트림 연결되지 않음</p>
              <p>Camera ID: {camera.id}</p>
            </div>
          </div>
        </div>

        {/* 우측 충돌 로그 */}
        <div className="collision-log">
          <h4 className="section-title seoul-14-bold">충돌 예측 로그</h4>
          <div className="log-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>차량</th>
                  <th>시간</th>
                  <th>위치</th>
                  <th>기록시간</th>
                </tr>
              </thead>
              <tbody>
                {dummyCollisionData.map((collision) => (
                  <tr
                    key={collision.id}
                    className={
                      collision.ttc < 2
                        ? "critical"
                        : collision.ttc < 3
                        ? "warning"
                        : ""
                    }
                  >
                    <td>{collision.id}</td>
                    <td>{collision.vehicle_ids.join(", ")}</td>
                    <td>{collision.ttc.toFixed(1)}초</td>
                    <td>
                      [{collision.collision_point[0].toFixed(4)},{" "}
                      {collision.collision_point[1].toFixed(4)}]
                    </td>
                    <td>{formatTimestamp(collision.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetailsPanel;
