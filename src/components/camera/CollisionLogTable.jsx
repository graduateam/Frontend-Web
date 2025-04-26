import React from "react";

const CollisionLogTable = ({ collisionLogs, onResetLogs }) => {
  // 날짜 포맷팅 도우미 함수
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  return (
    <div className="collision-log">
      <div className="section-header">
        <h4 className="seoul-14-bold">
          충돌 예측 로그 ({collisionLogs.length}건)
        </h4>
        <button onClick={onResetLogs} className="reset-button">
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
  );
};

export default CollisionLogTable;
