import { useState, useEffect, useRef } from "react";

const usePanelAnimation = (isOpen) => {
  // 애니메이션 상태
  const [animationClass, setAnimationClass] = useState("");
  const panelRef = useRef(null);

  // 패널 열림/닫힘 애니메이션 처리
  useEffect(() => {
    // 패널이 열리거나 닫힐 때 애니메이션 상태 설정
    if (isOpen) {
      // 패널이 열릴 때는 즉시 'open' 클래스 추가
      setAnimationClass("open");
    } else {
      // 패널이 닫힐 때는 'open' 클래스 제거
      setAnimationClass("");
    }
  }, [isOpen]);

  return {
    animationClass,
    panelRef,
  };
};

export default usePanelAnimation;
