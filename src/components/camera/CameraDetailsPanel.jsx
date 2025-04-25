import React from "react";
import PanelHeader from "./PanelHeader";
import CameraVideo from "./CameraVideo";
import CollisionLogTable from "./CollisionLogTable";
import useCollisionLogs from "./hooks/useCollisionLogs";
import usePanelAnimation from "./hooks/usePanelAnimation";

const CameraDetailsPanel = ({ camera, onClose, isOpen, collisions }) => {
  // 충돌 로그 관련 훅
  const { collisionLogs, handleResetLogs } = useCollisionLogs(
    camera,
    isOpen,
    collisions
  );

  // 패널 애니메이션 관련 훅
  const { animationClass, panelRef } = usePanelAnimation(isOpen);

  if (!camera) return null;

  return (
    <div className={`camera-details-panel ${animationClass}`} ref={panelRef}>
      {/* 패널 헤더 */}
      <PanelHeader camera={camera} onClose={onClose} />

      <div className="panel-content">
        {/* 카메라 비디오 영역 */}
        <CameraVideo camera={camera} />

        {/* 충돌 로그 테이블 */}
        <CollisionLogTable
          collisionLogs={collisionLogs}
          onResetLogs={handleResetLogs}
        />
      </div>
    </div>
  );
};

export default CameraDetailsPanel;
