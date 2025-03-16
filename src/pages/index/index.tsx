import { useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // 导入中文语言包
import NavBar from "@/components/Navbar";
import MonthSwitcher, { formatDate } from "@/components/MonthSwitcher";
import MonthStatic from "./components/monthStatic";
import Layout from "@/components/Layout";
import styles from "./index.module.less";
import {
  getMonthlyStats,
  getMonthlyStatsDetail,
} from "./service";
import RecordList from "./components/RecordList";
import { useLoadMore } from "@/hooks/useLoadMore";
import AddRecordButton from "./components/AddRecordButton";
import Taro from "@tarojs/taro";
import { useAppStore } from '@/store';
import { useRequest } from "taro-hooks";

// 设置 dayjs 使用中文
dayjs.locale("zh-cn");

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateType] = useState<"year" | "month">("month");

  const { data, run } = useRequest(
    () => {
      const { year, month } = formatDate(currentDate);
      return getMonthlyStats(dateType, year, month);
    },
    {
      refreshDeps: [currentDate],
      manual: true,
    }
  );

  const { defaultBook } = useAppStore();

  // 使用新的 useLoadMore hook
  const {
    list: recordList,
    loading,
    hasMore,
    refreshing,
    handleRefresh,
    handleLoadMore,
    reset,
  } = useLoadMore({
    pageSize: 5,
    fetchData: async (page, pageSize) => {
      const { year, month } = formatDate(currentDate);
      return getMonthlyStatsDetail(dateType, year, month, page, pageSize);
    },
    // 将 run 包装成返回 Promise 的函数
    onRefreshExtra: async () => {
      return run();
    },
  });

  // 首次加载和日期变化时重置列表
  useEffect(() => {
    if (currentDate) {
      reset();
    }
  }, [currentDate]);

  // 添加事件监听，只在记账成功后刷新页面
  useEffect(() => {
    const handleRecordSuccess = () => {
      reset();
    };
    // 使用相同的字符串事件名
    Taro.eventCenter.on('reload_index_page', handleRecordSuccess);
    return () => {
      Taro.eventCenter.off('reload_index_page', handleRecordSuccess);
    };
  }, [handleRefresh]);

  const handleAddRecord = () => {
    Taro.navigateTo({
      url: "/pages/record/index",
      success: function (res) {
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          bookId: defaultBook?.id,
        });
      },
    });
  };

  // 添加处理记录点击的函数
  const handleRecordClick = (id: number) => {
    Taro.navigateTo({
      url: `/pages/recordDetail/index?id=${id}`
    });
  };

  return (
    <Layout
      currentTab="home"
      navBar={<NavBar title="首页" color="#000" background={"white"} />}
      bodyClassName={styles.homeWrapBox}
    >
      <ScrollView
        className={styles.recordList}
        scrollY
        enhanced
        scrollWithAnimation
        lowerThreshold={50}
        upperThreshold={20}
        bounces={true}
        showScrollbar={true}
        refresherEnabled={true}
        refresherThreshold={100}
        refresherDefaultStyle="black"
        refresherBackground="#f4f4f4"
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
      >
        <View className={styles.topTitle}>
          <View className={styles.wellcomeTitle}>{defaultBook?.name}</View>
          <MonthSwitcher
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </View>

        <MonthStatic {...data} />
        <RecordList
          recordList={recordList}
          loading={loading}
          hasMore={hasMore}
          handleClick={handleRecordClick}
        />
      </ScrollView>

      <AddRecordButton onAddRecord={handleAddRecord} />
    </Layout>
  );
};

export default Index;
