import React from "react";

const CameraDetailsPanel = ({ camera, onClose, isOpen }) => {
  // 더미 충돌 예측 데이터 - 더 많은 항목 추가
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
    {
      id: "1_8",
      vehicle_ids: [1, 8],
      ttc: 4.2,
      collision_point: [37.6767, 126.7457],
      timestamp: "2025-04-25T14:33:43.211",
    },
    {
      id: "10_12",
      vehicle_ids: [10, 12],
      ttc: 2.5,
      collision_point: [37.6772, 126.74595],
      timestamp: "2025-04-25T14:33:44.345",
    },
    {
      id: "6_14",
      vehicle_ids: [6, 14],
      ttc: 1.7,
      collision_point: [37.676, 126.7456],
      timestamp: "2025-04-25T14:33:45.678",
    },
    {
      id: "15_18",
      vehicle_ids: [15, 18],
      ttc: 3.1,
      collision_point: [37.6775, 126.746],
      timestamp: "2025-04-25T14:33:46.789",
    },
    {
      id: "5_11",
      vehicle_ids: [5, 11],
      ttc: 2.3,
      collision_point: [37.6763, 126.74582],
      timestamp: "2025-04-25T14:33:47.456",
    },
    {
      id: "7_9",
      vehicle_ids: [7, 9],
      ttc: 3.9,
      collision_point: [37.6766, 126.74588],
      timestamp: "2025-04-25T14:33:48.123",
    },
    {
      id: "3_6",
      vehicle_ids: [3, 6],
      ttc: 2.7,
      collision_point: [37.6764, 126.74579],
      timestamp: "2025-04-25T14:33:49.345",
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
          <h4 className="section-title seoul-14-bold">충돌 예측 로그</h4>
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
                {dummyCollisionData.map((collision) => (
                  <tr key={collision.id}>
                    <td>{collision.id}</td>
                    <td>{collision.vehicle_ids.join(", ")}</td>
                    <td>{collision.ttc.toFixed(1)}초</td>
                    <td>[{collision.collision_point[0].toFixed(4)}]</td>
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
