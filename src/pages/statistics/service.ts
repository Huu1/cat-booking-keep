import { request } from "@/utils/request";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

// Register the weekOfYear plugin to enable week() function
dayjs.extend(weekOfYear);

// 定义统计数据的接口类型
export interface StatisticsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  incomeCategories: CategorySummary[];
  expenseCategories: CategorySummary[];
}

interface CategorySummary {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  total: number;
  records: RecordItem[];
}

interface RecordItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: "income" | "expense";
  amount: string;
  note: string;
  recordDate: string;
  category: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    type: string;
    icon: string;
    sort: number;
  };
  account: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    type: string;
    balance: string;
    icon: string;
    description: string | null;
    isDefault: boolean;
  };
  book: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    icon: string;
    color: string;
    description: string;
    isDefault: boolean;
    isSystemDefault: boolean;
  };
}

const handleDate = (dateType, date, customStartDate?, customEndDate?) => {
  // 根据日期类型计算开始日期和结束日期
  let startDate: string;
  let endDate: string;

  if (dateType === "range" && customStartDate && customEndDate) {
    // 使用自定义的日期范围
    startDate = customStartDate;
    endDate = customEndDate;
  } else if (dateType === "week") {
    // 获取本周的开始和结束日期
    const weekStart = dayjs(date).startOf("week");
    const weekEnd = dayjs(date).endOf("week");
    startDate = weekStart.format("YYYY-MM-DD");
    endDate = weekEnd.format("YYYY-MM-DD");
  } else if (dateType === "month") {
    // 获取本月的开始和结束日期
    const monthStart = dayjs(date).startOf("month");
    const monthEnd = dayjs(date).endOf("month");
    startDate = monthStart.format("YYYY-MM-DD");
    endDate = monthEnd.format("YYYY-MM-DD");
  } else if (dateType === "year") {
    // 获取本年的开始和结束日期
    const yearStart = dayjs(date).startOf("year");
    const yearEnd = dayjs(date).endOf("year");
    startDate = yearStart.format("YYYY-MM-DD");
    endDate = yearEnd.format("YYYY-MM-DD");
  } else {
    // 默认使用当前月
    const monthStart = dayjs(date).startOf("month");
    const monthEnd = dayjs(date).endOf("month");
    startDate = monthStart.format("YYYY-MM-DD");
    endDate = monthEnd.format("YYYY-MM-DD");
  }
  return { startDate, endDate };
};

// 获取统计数据
export const getStatistics = (
  dateType: string,
  date: Date,
  customStartDate?: string,
  customEndDate?: string,
  bookIds?: number[],
  accountIds?: number[]
) => {
  const { startDate, endDate } = handleDate(
    dateType,
    date,
    customStartDate,
    customEndDate
  );
  // 返回请求，使用 startDate 和 endDate 作为参数
  return request.post("/statistics/rangeDetails", {
    startDate,
    endDate,
    bookIds,
    accountIds,
  });
};

export const getIncomeAndExpenseTrend = (
  dateType: string,
  date: Date,
  bookIds?: number[],
  accountIds?: number[]
) => {
  const { startDate, endDate } = handleDate(dateType, date);

  // 返回请求，使用 startDate 和 endDate 作为参数
  return request.post("/statistics/incomeAndExpendTrend", {
    type: dateType,
    startDate,
    endDate,
    bookIds,
    accountIds,
  });
};
export const getAssetsTrend = (
  dateType: string,
  date: Date,
  bookIds?: number[],
  accountIds?: number[]
) => {
  const { startDate, endDate } = handleDate(dateType, date);

  // 返回请求，使用 startDate 和 endDate 作为参数
  return request.post("/statistics/assetsTrend", {
    type: dateType,
    startDate,
    endDate,
    bookIds,
    accountIds,
  });
};
