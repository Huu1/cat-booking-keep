import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface TabItem {
  key: string;
  title: string;
  iconType: string;
  path: string;
}

interface TabBarProps {
  current: string;
  tabs: TabItem[];
  onChange?: (key: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ current, tabs, onChange }) => {
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  useEffect(() => {
    // 获取系统信息，计算安全区域
    const systemInfo = Taro.getSystemInfoSync();
    const bottom = systemInfo.safeArea
      ? systemInfo.screenHeight - systemInfo.safeArea.bottom
      : 0;
    setSafeAreaBottom(bottom);
  }, []);

  const handleTabClick = (tab: TabItem) => {
    if (tab.key !== current) {
      if (onChange) {
        onChange(tab.key);
      }
      Taro.redirectTo({
        url: tab.path,
      });
    }
  };

  return (
    <View
      className={styles.tabBarContainer}
      style={{
        paddingBottom: `${safeAreaBottom}px`,
        height:
          safeAreaBottom > 0 ? `calc(56px + ${safeAreaBottom}px)` : "56px",
      }}
    >
      {tabs.map((tab) => (
        <View
          key={tab.key}
          className={styles.tabItem}
          onClick={() => handleTabClick(tab)}
        >
          <View
            className={`${styles.iconWrapper} ${
              current === tab.key ? styles.active : ""
            }`}
          >
            <IconFont
              type={tab.iconType}
              size={22}
              color={current === tab.key ? "#4285f4" : "#999999"}
            />
          </View>
          <Text
            className={`${styles.tabTitle} ${
              current === tab.key ? styles.active : ""
            }`}
          >
            {tab.title}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default TabBar;
