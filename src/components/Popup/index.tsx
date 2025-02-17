import React from "react";
import { ITouchEvent, View } from "@tarojs/components";
import cs from "classnames";
import "./index.scss";
import { Popup } from "@nutui/nutui-react-taro";

type MMButton = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  visible: boolean;
  setVisible: (v: boolean) => void;
};
const Index = (props: MMButton) => {
  const { children, className = "", contentClassName } = props;

  const _className = cs("mm-popup", {
    [className]: className,
  });

  return (
    <Popup
      visible={props.visible}
      style={{ height: "45%", borderRadius: 12 }}
      position="bottom"
      onClose={() => {
        props.setVisible(false);
      }}
      className={`${_className}`}
    >
      <View className="popup-border"></View>
      <View className={`popup-content ${contentClassName}`}>{children}</View>
    </Popup>
  );
};

export default Index;
