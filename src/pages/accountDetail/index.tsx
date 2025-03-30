import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { ActionSheet, SafeArea } from "@nutui/nutui-react-taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import styles from "./index.module.less";
import AccountInfoCard from "./components/AccountInfoCard";
import MonthCard from "./components/MonthCard";
import AccountDetailSkeleton from "./components/AccountDetailSkeleton";
import { deleteAccount, getAccountDetail } from "./service";
import { useRequest } from "taro-hooks";
import { Account, Statistics } from "./types";
import { getAccount } from "../addAccount/service";

const AccountDetail = () => {
  // 获取账户统计数据
  const {
    data: statistics,
    loading: statisticsLoading,
    run: run_getAccountDetail,
  } = useRequest<Statistics[], [string]>(getAccountDetail, {
    manual: true,
  });

  // 获取账户基本信息
  const {
    data: accountData = {} as Account,
    loading: accountLoading,
    run: run_getAccount,
    refresh: refresh_getAccount,
  } = useRequest<Account, [string]>(getAccount, {
    manual: true,
  });

  // 获取账户详情
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};
    if (params.id) {
      run_getAccountDetail(params.id);
      run_getAccount(params.id);
    }
  }, []);

  useEffect(() => {
    const handleRecordSuccess = () => {
      refresh_getAccount();
    };
    // 使用相同的字符串事件名
    Taro.eventCenter.on("account_detail_page", handleRecordSuccess);
    return () => {
      Taro.eventCenter.off("account_detail_page", handleRecordSuccess);
    };
  }, [accountData]);

  // 编辑账户
  const handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/addAccount/index?id=${accountData.id}`,
    });
  };

  const [isVisible, setIsVisible] = useState(false);
  const options: Record<string, string | boolean>[] = [
    {
      name: "修改账户",
    },
    {
      name: "删除账户",
    },
  ];

  // 处理更多按钮点击
  const handleMoreClick = () => {
    setIsVisible(true);
  };

  const { run: run_delete } = useRequest(deleteAccount, {
    manual: true,
    onSuccess() {
      Taro.eventCenter.trigger("account_index_page");
      Taro.navigateBack();
    },
  });

  // 处理选项点击
  const handleSelect = (option: Record<string, string | boolean>) => {
    switch (option.name) {
      case "修改账户":
        handleEdit();
        break;
      case "删除账户":
        Taro.showModal({
          title: "提示",
          content: "确定要删除该账户吗？",
          success: function (res) {
            if (res.confirm) {
              run_delete(accountData.id);
            }
          },
        });
        break;
    }
    setIsVisible(false);
  };

  // 处理记一笔点击
  const handleAddRecord = () => {
    Taro.navigateTo({
      url: `/pages/addRecord/index?accountId=${accountData.id}`,
    });
  };

  // 判断是否正在加载
  const isLoading = statisticsLoading || accountLoading;

  return (
    <Layout
      showTabBar={false}
      navBar={
        <NavBar
          title="账户详情"
          back
          color="#000"
          // background="white"
          right={
            <Text
              style={{ color: "#1890ff", fontSize: "14px" }}
              onClick={handleEdit}
            >
              编辑
            </Text>
          }
        />
      }
      bodyClassName={styles.container}
    >
      {isLoading ? (
        <AccountDetailSkeleton />
      ) : (
        <>
          <AccountInfoCard
            name={accountData?.name}
            balance={accountData?.balance}
            icon={accountData.icon}
            onMoreClick={handleMoreClick}
            onAddRecord={handleAddRecord}
          />

          {/* 月度记录列表 */}
          {statistics && statistics.length > 0 ? (
            statistics.map((month) => (
              <MonthCard key={month.month} month={month} />
            ))
          ) : (
            <View className={styles.emptyContainer}>
              <Text className={styles.emptyText}>暂无记录</Text>
            </View>
          )}

          <SafeArea position="bottom" />
        </>
      )}

      <ActionSheet
        visible={isVisible}
        cancelText="取消"
        options={options}
        onSelect={handleSelect}
        onCancel={() => setIsVisible(false)}
      />
    </Layout>
  );
};

export default AccountDetail;
