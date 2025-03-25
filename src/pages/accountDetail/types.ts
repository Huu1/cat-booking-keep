export interface StatisticsRecord {
  amount: string;
  id: number;
  note: string;
  recordDate: string;
  type: "expense" | "income";
  category: {
    icon: string;
    name: string;
  };
}

export interface DailyStats {
  date: string;
  expense: number;
  income: number;
  records?: StatisticsRecord[];
}

export interface Statistics {
  expense: number;
  income: number;
  month: string;
  dailyStats: DailyStats[];
}

export interface Account {
  id: number;
  name: string;
  balance: string;
  icon: string;
}