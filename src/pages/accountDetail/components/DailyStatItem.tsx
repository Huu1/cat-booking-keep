import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import styles from "../index.module.less";
import { DailyStats } from "../types";
import RecordItem from "./RecordItem";

interface DailyStatItemProps {
  dailyStats: DailyStats;
}

const DailyStatItem: React.FC<DailyStatItemProps> = ({ dailyStats }) => {
  return (
    <View className={styles.dailyStatsItem}>
      <View className={styles.dailyHeader}>
        <View className={styles.dateWrapper}>
          <Text className={styles.date}>
            {dayjs(dailyStats.date).format("MM-DD")}
          </Text>
          <Text className={styles.weekday}>
            {dayjs(dailyStats.date).format("ddd")}
          </Text>
        </View>
        <View className={styles.dailySummary}>
          <Text className={styles.expenseAmount}>
            流出: ¥{dailyStats.expense}
          </Text>
          <Text className={styles.incomeAmount}>
            流入: ¥{dailyStats.income}
          </Text>
        </View>
      </View>

      {dailyStats.records &&
        dailyStats.records.map((record) => (
          <RecordItem key={record.id} record={record} />
        ))}
    </View>
  );
};

export default DailyStatItem;