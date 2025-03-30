import React, { useEffect, useState } from "react";
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
import { useAppStore } from "@/store";

const Index = () => {
  const { user } = useAppStore();

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

  const { data = [], run: run_getAccounts } = useRequest(getAccounts, {
    ready: !!user,
  });

  const {
    data: summary = {
      netAssets: "0.00",
      totalAssets: "0.00",
      totalLiabilities: "0.00",
    },
    run: run_getAccountsSummary,
  } = useRequest(getAccountsSummary, {
    ready: !!user,
  });

  useEffect(() => {
    const handleRecordSuccess = () => {
      run_getAccounts();
      run_getAccountsSummary();
    };
    // 使用相同的字符串事件名
    Taro.eventCenter.on("account_index_page", handleRecordSuccess);
    return () => {
      Taro.eventCenter.off("account_index_page", handleRecordSuccess);
    };
  }, []);

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
      url: "/pages/accountType/index",
    });
  };

  // 处理账户点击，跳转到详情页
  const handleAccountClick = (account) => {
    Taro.navigateTo({
      url: `/pages/accountDetail/index?id=${account.id}`,
    });
  };

  return (
    <Layout
      currentTab="account"
      navBar={
        <NavBar
          back={
            user && (
              <IconFont
                style={{ marginLeft: 20 }}
                type="icon-a-mti-tianjiamti-xinzeng"
                // color="#f27166"
                size={20}
                onClick={handleAddAccount}
              />
            )
          }
          title="资产"
          color="#000"
          // background="white"
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
            onAccountClick={handleAccountClick} // 添加点击回调
          />
        ))}
      </View>
    </Layout>
  );
};

export default Index;
