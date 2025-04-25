import React, { useState, useEffect, useRef } from "react";

const CameraDetailsPanel = ({ camera, onClose, isOpen, collisions }) => {
  // 로그 상태 관리
  const [collisionLogs, setCollisionLogs] = useState([]);
  // 애니메이션 상태 추가
  const [animationClass, setAnimationClass] = useState("");

  // 참조 객체들
  const currentCameraIdRef = useRef(null);
  const logsByCameraRef = useRef({}); // 카메라별 로그 저장소
  const transitionTimeoutRef = useRef(null);
  const isProcessingDataRef = useRef(false);
  const lastCameraChangeTimeRef = useRef(0);
  const panelRef = useRef(null); // 패널 DOM 요소 참조 추가

  // 카메라 변경 감지 및 처리
  useEffect(() => {
    if (camera) {
      const now = Date.now();
      const cameraChanged = currentCameraIdRef.current !== camera.id;

      console.log(
        `[CameraDetailsPanel] 카메라 ${camera.id} 선택${
          cameraChanged ? ", 변경 감지" : ""
        }`
      );

      if (cameraChanged) {
        // 카메라 변경 시간 기록
        lastCameraChangeTimeRef.current = now;

        // 이전 타이머 정리
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }

        // 데이터 처리 일시 중지
        isProcessingDataRef.current = false;

        // 새 카메라의 ID 저장
        currentCameraIdRef.current = camera.id;

        // 이 카메라의 기존 로그가 없으면 초기화
        if (!logsByCameraRef.current[camera.id]) {
          logsByCameraRef.current[camera.id] = [];
        }

        // 현재 카메라의 로그로 상태 업데이트
        setCollisionLogs([...logsByCameraRef.current[camera.id]]);

        // 전환 완료 후 데이터 처리 재개를 위한 타이머 설정 (500ms 쿨다운)
        transitionTimeoutRef.current = setTimeout(() => {
          isProcessingDataRef.current = true;
        }, 500);
      } else if (
        !isProcessingDataRef.current &&
        now - lastCameraChangeTimeRef.current > 500
      ) {
        // 같은 카메라인데 처리가 멈춰있고 충분한 시간이 지났으면 처리 재개
        isProcessingDataRef.current = true;
      }
    }

    return () => {
      // 컴포넌트 언마운트 또는 카메라 변경 시 타이머 정리
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [camera]);

  // 패널 열림/닫힘 애니메이션 처리
  useEffect(() => {
    // 패널이 열리거나 닫힐 때 애니메이션 상태 설정
    if (isOpen) {
      // 패널이 열릴 때는 즉시 'open' 클래스 추가
      setAnimationClass("open");
    } else {
      // 패널이 닫힐 때 데이터 처리 중지
      isProcessingDataRef.current = false;

      // 타이머 정리
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      // 패널이 닫힐 때는 'open' 클래스 제거
      setAnimationClass("");

      // 패널이 닫힐 때는 현재 카메라 ID 참조도 초기화
      currentCameraIdRef.current = null;
    }
  }, [isOpen]);

  // 로그 초기화 함수
  const handleResetLogs = () => {
    // 현재 카메라 ID가 유효하면 해당 카메라의 로그만 초기화
    if (currentCameraIdRef.current) {
      logsByCameraRef.current[currentCameraIdRef.current] = [];
      setCollisionLogs([]);
    }
  };

  // 새로운 충돌 데이터 처리 (이벤트 기반)
  useEffect(() => {
    // 데이터 처리 조건 검사 강화
    if (
      !isProcessingDataRef.current ||
      !collisions ||
      collisions.length === 0 ||
      !camera ||
      !isOpen ||
      currentCameraIdRef.current !== camera.id
    ) {
      return;
    }

    const currentCameraId = currentCameraIdRef.current;

    // 새로운 충돌 데이터 처리
    const processNewCollisions = () => {
      // 카메라 변경 도중에는 처리하지 않음
      if (currentCameraIdRef.current !== currentCameraId) return;

      // 이 카메라에 대한 로그 스토리지 확인
      if (!logsByCameraRef.current[currentCameraId]) {
        logsByCameraRef.current[currentCameraId] = [];
      }

      // 기존 로그에서 ID 추출
      const existingIds = new Set(
        logsByCameraRef.current[currentCameraId].map((log) => log.id)
      );

      // 새 충돌 데이터 처리
      const newCollisions = collisions
        .map((collision) => {
          const { properties } = collision;
          return {
            id: properties.id,
            vehicle_ids: properties.vehicle_ids,
            ttc: properties.ttc,
            collision_point: collision.geometry.coordinates.reverse(),
            timestamp: properties.timestamp,
            cameraId: currentCameraId,
          };
        })
        // 이미 존재하는 ID는 필터링
        .filter((collision) => !existingIds.has(collision.id));

      // 새 충돌이 있으면 로그 업데이트
      if (newCollisions.length > 0) {
        // 최신 로그를 맨 앞에 추가
        const updatedLogs = [
          ...newCollisions,
          ...logsByCameraRef.current[currentCameraId],
        ];

        // 카메라별 로그 저장소 업데이트
        logsByCameraRef.current[currentCameraId] = updatedLogs;

        // 현재 선택된 카메라의 로그만 상태에 반영
        if (currentCameraIdRef.current === currentCameraId) {
          setCollisionLogs(updatedLogs);
        }
      }
    };

    // 즉시 실행하지만 비동기 컨텍스트에서 실행하여 렌더링 차단 방지
    requestAnimationFrame(processNewCollisions);
  }, [collisions, camera, isOpen]);

  // 날짜 포맷팅 도우미 함수
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  if (!camera) return null;

  // 마지막 안전장치: 렌더링 직전에 현재 카메라 ID 확인하여 로그 필터링
  const finalFilteredLogs = collisionLogs.filter(
    (log) => !log.cameraId || log.cameraId === camera.id
  );

  return (
    <div className={`camera-details-panel ${animationClass}`} ref={panelRef}>
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
              충돌 예측 로그 ({finalFilteredLogs.length}건)
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
                {finalFilteredLogs.map((collision) => (
                  <tr key={collision.id}>
                    <td>{collision.id}</td>
                    <td>{collision.vehicle_ids.join(", ")}</td>
                    <td>{parseFloat(collision.ttc).toFixed(1)}초</td>
                    <td>[{collision.collision_point[0].toFixed(4)}]</td>
                    <td>{formatTimestamp(collision.timestamp)}</td>
                  </tr>
                ))}
                {finalFilteredLogs.length === 0 && (
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
