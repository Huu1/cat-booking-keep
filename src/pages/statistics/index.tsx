import { useState, useCallback, useEffect } from "react";
import { View, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "taro-hooks";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

// Register the weekOfYear plugin
dayjs.extend(weekOfYear);
import IconFont from "@/components/Iconfont";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import Switcher from "@/components/Switcher";
import CategoryChart from "@/pages/statistics/CategoryChart"; // 确保这个路径正确
import styles from "./index.module.less";
import { getStatistics } from "./service";
import CategoryList from "./CategoryList";
import DateNavigator from "./DateNavigator";
import StatCard from "./StatCard";
import CategoryHeader from "./CategoryHeader";
import IncomeAndExpenseCard from "./IncomeAndExpenseCard";
import AssetTrendsCard from "./AssetTrendsCard";
import FilterPopup from "./FilterPopup";
import { getAccountList } from "../addAccount/service";
import { getBooks } from "../books/service";
import { useAppStore } from "@/store";

// 日期类型选项
const dateTypeOptions = [
  { value: "week", label: "周" },
  { value: "month", label: "月" },
  { value: "year", label: "年" },
  { value: "range", label: "范围" },
];

export type TDateType = "week" | "month" | "year" | "range";

// 在 Statistics 组件内添加状态
const Statistics = () => {
  const { user } = useAppStore();

  const { data: accountList = [] } = useRequest(getAccountList, {
    ready: !!user,
  });
  const { data: bookList = [] } = useRequest(getBooks, {
    ready: !!user,
  });

  // 当前选中的日期类型
  const [dateType, setDateType] = useState<TDateType>("week");
  // 当前日期
  const [currentDate, setCurrentDate] = useState(new Date());

  const [bookIds, setBookIds] = useState<number[]>([]);
  const [accountIds, setAccountIds] = useState<number[]>([]);

  // 在组件顶部添加两个状态
  const [startDate, setStartDate] = useState(
    dayjs().subtract(1, "year").format("YYYY/MM/DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY/MM/DD"));

  // 添加一个状态来控制显示支出还是收入 分类详情
  const [showCategoryType, setShowCategoryType] = useState<
    "expense" | "income"
  >("expense");

  // 处理日期类型变化
  const handleDateTypeChange = (type) => {
    setDateType(type);
  };

  // 处理日期变化
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // 修改处理日期选择器的函数
  const handleDatePicker = (type: "start" | "end", e) => {
    const formattedDate = dayjs(e.detail.value).format("YYYY/MM/DD");
    if (type === "start") {
      setStartDate(formattedDate);
    } else {
      setEndDate(formattedDate);
    }
  };

  // 获取统计数据
  const { data: statsData, loading } = useRequest(
    () => {
      if (dateType === "range") {
        // 范围模式直接传入自定义的开始和结束日期
        return getStatistics(
          dateType,
          currentDate,
          startDate.replace(/\//g, "-"),
          endDate.replace(/\//g, "-")
        );
      }
      // 其他模式使用原来的逻辑
      return getStatistics(dateType, currentDate, "", "", bookIds, accountIds);
    },
    {
      refreshDeps: [
        dateType,
        currentDate,
        startDate,
        endDate,
        bookIds,
        accountIds,
      ],
      ready: !!user,
    }
  );

  // 计算日均支出
  const calculateDailyExpense = () => {
    if (!statsData) return "0.00";

    const { summary, period } = statsData;
    const startDate = dayjs(period.startDate);
    const endDate = dayjs(period.endDate);
    const days = endDate.diff(startDate, "day") + 1;

    return days > 0 ? (summary.totalExpense / days).toFixed(2) : "0.00";
  };

  // 处理卡片点击
  const handleCardClick = (type) => {
    Taro.navigateTo({
      url: `/pages/statisticsDetail/index?type=${type}&dateType=${dateType}&date=${dayjs(
        currentDate
      ).format("YYYY-MM-DD")}`,
    });
  };

  // 计算分类百分比
  const calculatePercentage = (amount: number, total: number) => {
    if (!total) return 0;
    return (amount / total) * 100;
  };

  // 准备图表数据
  const prepareChartData = useCallback(() => {
    if (!statsData) return [];

    const categories =
      showCategoryType === "expense"
        ? statsData.expenseCategories
        : statsData.incomeCategories;

    return categories.map((category) => ({
      name: category.categoryName,
      value: parseFloat(category.total.toFixed(2)),
    }));
  }, [statsData, showCategoryType]);

  // 准备列表数据
  const prepareCategoryList = () => {
    if (!statsData) return [];

    const categories =
      showCategoryType === "expense"
        ? statsData.expenseCategories
        : statsData.incomeCategories;

    const total =
      showCategoryType === "expense"
        ? statsData.summary.totalExpense
        : statsData.summary.totalIncome;

    return categories.map((category) => ({
      id: category.categoryId,
      name: category.categoryName,
      icon: category.categoryIcon,
      amount: category.total,
      percentage: calculatePercentage(category.total, total),
      count: category.records.length,
    }));
  };

  // 处理分类项点击
  const handleCategoryItemClick = (categoryId) => {
    handleCardClick(`category-${categoryId}`);
  };

  // 在组件顶部其他 state 声明后添加
  const [showTrendCards, setShowTrendCards] = useState(true);

  // 添加 useEffect 监听 dateType 变化
  useEffect(() => {
    setShowTrendCards(dateType !== "range");
  }, [dateType]);

  // 添加状态控制筛选弹窗
  const [showFilter, setShowFilter] = useState(false);

  // 处理筛选确认
  const handleFilterConfirm = (
    selectedBooks: number[],
    selectedAccounts: number[]
  ) => {
    setAccountIds(selectedAccounts);
    setBookIds(selectedBooks);
  };

  return (
    <Layout
      currentTab="statistics"
      navBar={<NavBar title="统计" color="#000" background="" />}
      bodyClassName={styles.statisticsContainer}
    >
      <View className={styles.dateFilterContainer}>
        <Switcher
          options={dateTypeOptions}
          value={dateType}
          onChange={handleDateTypeChange}
          className={styles.dateSwitcher}
        />
        {user && (
          <View
            className={styles.filterIcon}
            onClick={() => setShowFilter(true)}
          >
            <IconFont type="icon-mti-shaixuan" size={16} color="#666" />
          </View>
        )}
      </View>

      {/* 使用抽离出的日期导航组件 */}
      <DateNavigator
        dateType={dateType}
        currentDate={currentDate}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onDatePicker={handleDatePicker}
      />

      <ScrollView
        className={styles.statsContent}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {/* 收支统计卡片 */}
        <StatCard
          title="收支统计"
          icon="icon-tongji"
          data={[
            {
              label: "支出",
              value: statsData?.summary?.totalExpense?.toFixed(2) || "0.00",
            },
            {
              label: "收入",
              value: statsData?.summary?.totalIncome?.toFixed(2) || "0.00",
            },
            {
              label: "结余",
              value: statsData?.summary?.balance?.toFixed(2) || "0.00",
            },
            {
              label: "日均支出",
              value: calculateDailyExpense(),
            },
          ]}
          onCardClick={() => handleCardClick("income-expense")}
        />

        {/* 资产趋势卡片 */}
        {/* <AssetTrendsCard
          style={{ display: showTrendCards ? "block" : "none" }}
          dateType={dateType}
          currentDate={currentDate}
          accountIds={accountIds}
          bookIds={bookIds}
        /> */}

        {/* 收入支出卡片 */}
        <IncomeAndExpenseCard
          style={{ display: showTrendCards ? "block" : "none" }}
          dateType={dateType}
          currentDate={currentDate}
          accountIds={accountIds}
          bookIds={bookIds}
        />

        <View className={styles.Card}>
          <CategoryHeader
            showType={showCategoryType}
            options={[
              { value: "expense", label: "支出" },
              { value: "income", label: "收入" },
            ]}
            onTypeChange={setShowCategoryType}
            title={`${
              showCategoryType === "expense" ? "支出" : "收入"
            }分类详情`}
            icon="icon-weijianzichanbiao"
          />

          <View className={styles.chartWrapper}>
            <CategoryChart
              data={prepareChartData()}
              title={`¥${
                showCategoryType === "expense"
                  ? statsData?.summary?.totalExpense?.toFixed(2)
                  : statsData?.summary?.totalIncome?.toFixed(2)
              }`}
            />
          </View>

          {/* 使用抽离出的分类列表组件 */}
          <CategoryList
            categories={prepareCategoryList()}
            onItemClick={handleCategoryItemClick}
          />
        </View>
      </ScrollView>

      <FilterPopup
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onConfirm={handleFilterConfirm}
        books={bookList}
        accounts={accountList}
        selectedAccounts={accountIds}
        selectedBooks={bookIds}
      />
    </Layout>
  );
};

export default Statistics;
