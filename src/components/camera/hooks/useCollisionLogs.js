import { useState, useEffect, useRef } from "react";

const useCollisionLogs = (camera, isOpen, collisions) => {
  // 로그 상태 관리
  const [collisionLogs, setCollisionLogs] = useState([]);

  // 참조 객체들
  const currentCameraIdRef = useRef(null);
  const logsByCameraRef = useRef({}); // 카메라별 로그 저장소
  const transitionTimeoutRef = useRef(null);
  const isProcessingDataRef = useRef(false);
  const lastCameraChangeTimeRef = useRef(0);

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
    // 패널이 닫힐 때 데이터 처리 중지
    if (!isOpen) {
      isProcessingDataRef.current = false;

      // 타이머 정리
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      // 패널이 닫힐 때는 현재 카메라 ID 참조도 초기화
      currentCameraIdRef.current = null;
    }
  }, [isOpen]);

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

  // 로그 초기화 함수
  const handleResetLogs = () => {
    // 현재 카메라 ID가 유효하면 해당 카메라의 로그만 초기화
    if (currentCameraIdRef.current) {
      logsByCameraRef.current[currentCameraIdRef.current] = [];
      setCollisionLogs([]);
    }
  };

  // 마지막 안전장치: 렌더링 직전에 현재 카메라 ID 확인하여 로그 필터링
  const finalFilteredLogs = collisionLogs.filter(
    (log) => !log.cameraId || log.cameraId === (camera?.id || null)
  );

  return {
    collisionLogs: finalFilteredLogs,
    handleResetLogs,
  };
};

export default useCollisionLogs;
