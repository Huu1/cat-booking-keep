import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import styles from "./index.module.less";
import NavBar from "@/components/Navbar";
import Layout from "@/components/Layout";
import cs from "classnames";
import { useRequest } from "taro-hooks";
import { getAccounts, getAccountsSummary } from "./service";
import AccountSection from "./components/AccountSection";
import Taro from "@tarojs/taro";
import AssetCard from "./components/AssetCard";
import IconFont from "@/components/Iconfont";

const Index = () => {
  // 从本地存储读取状态，默认为 true
  const [isAmountVisible, setIsAmountVisible] = useState(() => {
    const stored = Taro.getStorageSync("isAmountVisible");
    return stored === null ? true : stored;
  });

  // 处理金额显示/隐藏，并保存到本地存储
  const toggleAmountVisibility = () => {
    setIsAmountVisible((prev) => {
      const newValue = !prev;
      Taro.setStorageSync("isAmountVisible", newValue);
      return newValue;
    });
  };

  const { data = [] } = useRequest(getAccounts);

  const {
    data: summary = {
      netAssets: "0.00",
      totalAssets: "0.00",
      totalLiabilities: "0.00",
    },
  } = useRequest(getAccountsSummary);

  // 格式化金额显示
  const formatAmount = (amount: string, showXXX: boolean = true) => {
    const text = isAmountVisible ? `¥${amount}` : showXXX ? "***" : <></>;
    return (
      <Text
        style={cs(styles.amountValue, {
          [styles.hide]: !isAmountVisible,
        })}
      >
        {text}
      </Text>
    );
  };

  const handleAddAccount = () => {
    Taro.navigateTo({
      url: '/pages/accountType/index'
    });
  };

  return (
    <Layout
      currentTab="account"
      navBar={
        <NavBar
          back={
            <IconFont 
              style={{ marginLeft: 20 }} 
              type="icon-jia1" 
              color="red" 
              onClick={handleAddAccount}
            />
          }
          title="资产"
          color="#000"
          background="white"
        />
      }
      bodyClassName={styles.homeWrapBox}
    >
      <View className={styles.container}>
        <AssetCard
          netAssets={summary.netAssets}
          totalAssets={summary.totalAssets}
          totalLiabilities={summary.totalLiabilities}
          isAmountVisible={isAmountVisible}
          onToggleVisibility={toggleAmountVisibility}
          formatAmount={formatAmount}
        />

        {data?.map((item) => (
          <AccountSection
            key={item.type}
            data={item}
            isAmountVisible={isAmountVisible}
            formatAmount={formatAmount}
          />
        ))}
      </View>
    </Layout>
  );
};

export default Index;
