import { View } from "@tarojs/components";
import React from "react";
import  "./index.scss";

type TPageBoxType = {
  navBar: React.ReactElement;
  children: React.ReactNode;
  bodyClassName?: string;
};
const Index = ({ navBar, children ,bodyClassName}: TPageBoxType) => {
  return (
    <View className="page-container">
      {navBar}
      <View className={`${bodyClassName}`}>{children}</View>
    </View>
  );
};

export default Index;
