import { useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // 导入中文语言包
import NavBar from "@/components/Navbar";
import MonthSwitcher, { formatDate } from "@/components/MonthSwitcher";
import MonthStatic from "./components/monthStatic";
import Layout from "@/components/Layout";
import styles from "./index.module.less";
import { getMonthlyStats, getMonthlyStatsDetail } from "./service";
import RecordList from "./components/RecordList";
import { useLoadMore } from "@/hooks/useLoadMore";
import AddRecordButton from "./components/AddRecordButton";
import Taro from "@tarojs/taro";
import { useAppStore } from "@/store";
import { useRequest } from "taro-hooks";

// 设置 dayjs 使用中文
dayjs.locale("zh-cn");

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateType] = useState<"year" | "month">("month");

  const { defaultBook, user } = useAppStore();

  const { data, run } = useRequest(
    () => {
      const { year, month } = formatDate(currentDate);
      return getMonthlyStats(dateType, year, month, defaultBook?.id);
    },
    {
      refreshDeps: [currentDate, defaultBook?.id],
      manual: true,
      ready: !!defaultBook?.id, // 添加ready参数
    }
  );

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
    ready: !!defaultBook?.id, // 添加ready参数，只有当defaultBook存在时才开始加载
    fetchData: async (page, pageSize) => {
      const { year, month } = formatDate(currentDate);
      return getMonthlyStatsDetail(
        dateType,
        year,
        month,
        page,
        pageSize,
        defaultBook?.id
      );
    },
    onRefreshExtra: async () => {
      return run();
    },
  });

  // 首次加载和日期变化或账本变化时重置列表
  useEffect(() => {
    if (currentDate) {
      reset();
    }
  }, [currentDate, defaultBook?.id]); // 添加defaultBook.id作为依赖

  // 添加事件监听，只在记账成功后刷新页面
  useEffect(() => {
    const handleRecordSuccess = () => {
      reset();
    };
    // 使用相同的字符串事件名
    Taro.eventCenter.on("reload_index_page", handleRecordSuccess);
    return () => {
      Taro.eventCenter.off("reload_index_page", handleRecordSuccess);
    };
  }, [handleRefresh]);

  const handleAddRecord = () => {
    if (!user) {
      Taro.navigateTo({
        url: "/pages/login/index",
      });
      return;
    }

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
      url: `/pages/recordDetail/index?id=${id}`,
    });
  };

  // 添加跳转到账本页面的函数
  const handleBookClick = () => {
    Taro.navigateTo({
      url: "/pages/books/index",
    });
  };

  return (
    <Layout
      currentTab="home"
      navBar={<NavBar title="" color="#000" />}
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
        refresherBackground="transparent"
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
      >
        <View className={styles.topTitle}>
          <View className={styles.wellcomeTitle} onClick={handleBookClick}>
            {defaultBook?.name}
          </View>
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
