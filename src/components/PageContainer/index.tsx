import { ScrollView, View } from "@tarojs/components";
import React from "react";
import "./index.scss";

type TPageBoxType = {
  navBar: React.ReactElement;
  children: React.ReactNode;
  bodyClassName?: string;
};
const Index = ({ navBar, children, bodyClassName }: TPageBoxType) => {
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
        className="page-container"
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
