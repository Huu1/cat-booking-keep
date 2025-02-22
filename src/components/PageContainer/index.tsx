import { ScrollView, View } from "@tarojs/components";
import React from "react";
import cs from "classnames";
import styles from "./index.module.scss";

type TPageBoxType = {
  navBar: React.ReactElement;
  children: React.ReactNode;
  bodyClassName?: string;
  wrapClassName?: string;
};
const Index = ({
  navBar,
  children,
  bodyClassName,
  wrapClassName,
}: TPageBoxType) => {
  const _className = cs(styles.pageContainer, wrapClassName);

  return (
    <View
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
      catchMove
    >
      <ScrollView
        scrollY
        enhanced
        scrollWithAnimation
        lowerThreshold={20}
        upperThreshold={20}
        className={_className}
        bounces={false}
        showScrollbar={false}
      >
        {navBar}
        <View className={`${bodyClassName}`}>{children}</View>
      </ScrollView>
    </View>
  );
};

export default Index;
