import React, { useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import TabBar from "@/components/TabBar";
import styles from "./index.module.less";
import cs from "classnames";

// 定义底部导航栏配置
const tabs = [
  {
    key: "home",
    title: "首页",
    iconType: "icon-weijianzichanbiao",
    path: "/pages/index/index",
  },
  // {
  //   key: "account",
  //   title: "资产",
  //   iconType: "icon-zichan",
  //   path: "/pages/account/index",
  // },
  {
    key: "statistics",
    title: "统计",
    iconType: "icon-zichanfuzhaibiao",
    path: "/pages/statistics/index",
  },
  {
    key: "my",
    title: "我的",
    iconType: "icon-geren",
    path: "/pages/my/index",
  },
];

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: string;
  showTabBar?: boolean;
  navBar?: React.ReactNode;
  bodyClassName?: string;
  wrapClassName?: string;
}

// 在 Layout 组件中
const Layout: React.FC<LayoutProps> = ({
  children,
  navBar,
  bodyClassName,
  wrapClassName,
}) => {
  const [contentHeight, setContentHeight] = useState();
  const [navBarHeight, setNavBarHeight] = useState(48); // 默认导航栏高度
  const _className = cs(styles.pageContainer, wrapClassName);

  // 处理导航栏高度变化的回调
  const handleNavBarHeightChange = (height) => {
    setNavBarHeight(height);
  };

  // 包装 navBar 元素，添加高度回调
  const wrappedNavBar = React.isValidElement(navBar)
    ? React.cloneElement(navBar, {
        // @ts-ignore
        onHeightChange: handleNavBarHeightChange,
      })
    : navBar;

  useEffect(() => {
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync();

    // 不显示TabBar时，内容区域高度 = 屏幕高度 - 导航栏高度
    const calculatedHeight =
      systemInfo.windowHeight - (navBar ? navBarHeight : 0);
    setContentHeight(`${calculatedHeight}px`);
  }, [navBarHeight]); // 添加 navBarHeight 作为依赖

  return (
    <View className={styles.layoutContainer}>
      <ScrollView
        className={_className}
        scrollY
        enhanced
        scrollWithAnimation
        lowerThreshold={20}
        upperThreshold={20}
        bounces={false}
        showScrollbar={false}
      >
        {wrappedNavBar} {/* 使用包装后的 navBar */}
        <View
          className={bodyClassName}
          style={{
            height: contentHeight,
            overflow: "auto",
          }}
        >
          {children}
        </View>
      </ScrollView>
      {/* {showTabBar && <TabBar current={currentTab as any} tabs={tabs} />} */}
    </View>
  );
};

export default Layout;
