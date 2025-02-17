import React from "react";
import { ITouchEvent, Text, View } from "@tarojs/components";
import cs from "classnames";
import "./index.scss";
import { Loading } from "@nutui/nutui-react-taro";

type MMButton = {
  children: React.ReactNode;
  loading?: boolean;
  type?: "primary" | "default";
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: (e: ITouchEvent) => void;
};
const Index = (props: MMButton) => {
  const {
    loading = false,
    type = "default",
    children,
    size = "medium",
    className = "",
  } = props;

  const _className = cs("mm-button", {
    [className]: className,
    small: size === "small",
    large: size === "large",
    medium: size === "medium",
  });

  return (
    <View
      className={`${_className}`}
      onClick={(e) => {
        !loading && props.onClick?.(e);
      }}
    >
      {loading ? (
        <>
          加载中...
          <View className="sequential-dots" />
        </>
      ) : (
        children
      )}
    </View>
  );
};

export default Index;
