import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "@tarojs/components";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // 导入中文语言包
import NavBar from "@/components/Navbar";
import MonthSwitcher, { formatDate } from "@/components/MonthSwitcher";
import MonthStatic from "./monthStatic";
import Layout from "@/components/Layout";
import styles from "./index.module.less";
import useRequest from "@/hooks/useRequest";
import { getMonthlyStats, getMonthlyStatsDetail } from "./service";
import RecordCard from "./recordCard";
import Taro from "@tarojs/taro";
import IconFont from "@/components/Iconfont";

// 设置 dayjs 使用中文
dayjs.locale("zh-cn");

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateType] = useState<"year" | "month">("month");
  const [refreshing, setRefreshing] = useState(false); // 刷新状态
  const [loading, setLoading] = useState(false); // 添加加载状态
  const [page, setPage] = useState(1); // 添加页码状态
  const [hasMore, setHasMore] = useState(true); // 添加是否有更多数据状态
  const [pageSize] = useState(10); // 添加页面大小状态
  const [totalPages, setTotalPages] = useState(1); // 添加总页数状态

  const [buttonBottom, setButtonBottom] = useState(120);

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

  const { data: recordsData, run: getRecords } = useRequest(
    () => {
      const { year, month } = formatDate(currentDate);
      return getMonthlyStatsDetail(dateType, year, month, page, pageSize);
    },
    {
      refreshDeps: [currentDate, page, pageSize],
      manual: true,
    }
  );

  // 提取记录列表和分页信息
  const [recordList, setRecordList] = useState<any[]>([]);

  useEffect(() => {
    if (recordsData) {
      // 处理分页信息
      const { pagination, details } = recordsData;

      if (pagination) {
        setTotalPages(pagination.totalPages || 1);
        setHasMore(page < (pagination.totalPages || 1));
      }

      // 如果是第一页，直接设置数据
      if (page === 1) {
        setRecordList(details || []);
      } else {
        // 如果不是第一页，追加数据
        setRecordList((prevList) => [...prevList, ...(details || [])]);
      }
    }
  }, [recordsData, page]);

  useEffect(() => {
    run();
    // 重置分页状态并获取第一页数据
    setPage(1);
    setHasMore(true);
    getRecords();
  }, [currentDate]);

  // 处理下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 重置分页状态
      setPage(1);
      setHasMore(true);

      // 先获取统计数据
      await run();

      // 然后获取第一页的详细记录
      const { year, month } = formatDate(currentDate);
      const firstPageData = await getMonthlyStatsDetail(
        dateType,
        year,
        month,
        1,
        pageSize
      );

      // 手动处理返回的数据
      if (firstPageData) {
        const { pagination, details } = firstPageData;

        if (pagination) {
          setTotalPages(pagination.totalPages || 1);
          setHasMore(1 < (pagination.totalPages || 1));
        }

        // 重置记录列表为第一页数据
        setRecordList(details || []);
      }
    } catch (error) {
      console.error("刷新失败:", error);
      Taro.showToast({
        title: "刷新失败",
        icon: "error",
        duration: 1500,
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 处理上拉加载更多
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      console.log("加载更多，当前页码:", page, "下一页:", nextPage);

      // 检查是否还有更多页
      if (nextPage > totalPages) {
        setHasMore(false);
        Taro.showToast({
          title: "没有更多数据了",
          icon: "none",
          duration: 1500,
        });
      } else {
        // 直接调用API获取下一页数据，而不是依赖状态更新
        const { year, month } = formatDate(currentDate);
        const nextPageData = await getMonthlyStatsDetail(
          dateType,
          year,
          month,
          nextPage,
          pageSize
        );

        // 处理返回的数据
        if (nextPageData) {
          const { pagination, details } = nextPageData;

          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
            setHasMore(nextPage < (pagination.totalPages || 1));
          }

          // 追加新数据到现有列表
          setRecordList((prevList) => [...prevList, ...(details || [])]);
        }

        // 更新页码状态
        setPage(nextPage);
      }
    } catch (error) {
      console.error("加载更多失败:", error);
      Taro.showToast({
        title: "加载失败",
        icon: "error",
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  // 添加滚动状态
  const [isScrolling, setIsScrolling] = useState(false);

  // 添加一个函数来处理滚动结束
  const handleScrollEnd = () => {
    // 使用 setTimeout 确保在滚动完全停止后检查位置
    // setTimeout(() => {
    // 获取当前滚动视图的实例
    const query = Taro.createSelectorQuery();
    query
      .select(`.${styles.recordList}`)
      .scrollOffset((res) => {
        if (res && res.scrollTop <= 0) {
          setIsScrolling(false);
        }
      })
      .exec();
    // }, 100);
  };

  {
    /* 计算按钮底部距离 */
  }
  useEffect(() => {
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync();
    // 获取TabBar高度（假设为50px）
    const tabBarHeight = 56;
    // 计算安全区域
    const safeAreaBottom = systemInfo.safeArea
      ? systemInfo.screenHeight - systemInfo.safeArea.bottom
      : 0;

    // 设置按钮距离底部的距离
    setButtonBottom(tabBarHeight + safeAreaBottom + 20); // 20是额外的间距
  }, []);

  // 在 Index 组件中添加跳转函数
  const handleAddRecord = () => {
    Taro.navigateTo({
      url: "/pages/record/index",
    });
  };

  return (
    <Layout
      currentTab="home"
      // showTabBar={false}
      navBar={<NavBar title="首页" color="#000" background={"white"} />}
      bodyClassName={styles.homeWrapBox}
    >
      <View className={styles.topTitle}>
        <View className={styles.wellcomeTitle}>Hi早上好!</View>
        <MonthSwitcher
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </View>

      <MonthStatic {...data} />

      {/* 添加一个包装容器，根据滚动状态应用不同样式 */}
      <View
        className={`${styles.scrollContainer} ${
          isScrolling ? styles.scrolling : ""
        }`}
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
          refresherThreshold={45}
          refresherDefaultStyle="black"
          refresherBackground="#f4f4f4"
          refresherTriggered={refreshing}
          onRefresherRefresh={handleRefresh}
          onScrollToLower={handleLoadMore}
          // 然后在 ScrollView 中添加
          onScrollToUpper={handleScrollEnd}
          onScroll={(e) => {
            // 获取滚动位置
            const scrollTop = e.detail.scrollTop;

            // 只有当滚动位置为0时才设置为非滚动状态
            if (scrollTop <= 0) {
              setIsScrolling(false);
            } else {
              setIsScrolling(true);
            }
          }}
        >
          {recordList && recordList.length > 0 ? (
            <>
              {recordList.map((dayRecord) => (
                <RecordCard
                  key={dayRecord.date}
                  date={dayRecord.date}
                  weekday={getWeekday(dayRecord.date)}
                  income={dayRecord.income}
                  expense={dayRecord.expense}
                  records={dayRecord.records}
                />
              ))}

              {/* 加载状态显示 */}
              <View className={styles.loadingWrapper}>
                {loading && (
                  <View className={styles.loadingMore}>
                    <View className={styles.loadingDot}></View>
                    <View className={styles.loadingDot}></View>
                    <View className={styles.loadingDot}></View>
                  </View>
                )}

                {/* 没有更多数据提示 */}
                {!hasMore && (
                  <View className={styles.noMoreData}>没有更多数据了</View>
                )}
              </View>
            </>
          ) : (
            <View className={styles.noData}>暂无记录</View>
          )}
        </ScrollView>
      </View>

      {/* 添加记一笔按钮，使用计算的底部距离 */}
      {/* 添加记一笔按钮，放在右下角 */}
      <View
        className={styles.addRecordButton}
        style={{ bottom: buttonBottom + "px" }}
        onClick={handleAddRecord}
      >
        <View className={styles.addButtonInner}>
          <IconFont type="icon-add" size={24} color="#fff" />
          <Text className={styles.addButtonText}>记一笔</Text>
        </View>
      </View>
    </Layout>
  );
};

// 使用 dayjs 将日期转换为星期几
const getWeekday = (dateStr) => {
  return dayjs(dateStr).format("dddd"); // 返回完整的星期名称，如"星期一"
};

export default Index;
