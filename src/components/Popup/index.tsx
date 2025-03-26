import { View } from "@tarojs/components";
import { ReactNode, useEffect } from "react";
import styles from "./index.module.less";

interface PopupProps {
  visible: boolean;
  position?: "bottom" | "top" | "left" | "right" | "center";
  round?: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: React.CSSProperties;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  position = "bottom",
  round = false,
  onClose,
  children,
  style = {},
}) => {
  // 防止滚动穿透
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <View
      className={`${styles.popupOverlay} ${visible ? styles.visible : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      catchMove
    >
      <View
        className={`
          ${styles.popupContent}
          ${styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`]}
          ${round ? styles.round : ""}
          ${visible ? styles.contentVisible : ""}
        `}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </View>
    </View>
  );
};

export default Popup;