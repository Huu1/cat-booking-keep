import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import IconFont from "@/components/Iconfont";
import styles from "../index.module.less";
import { Statistics } from "../types";

interface MonthHeaderProps {
  month: Statistics;
  isExpanded?: boolean;
  onToggle: (month: string) => void;
}

const MonthHeader: React.FC<MonthHeaderProps> = ({
  month,
  isExpanded = false,
  onToggle
}) => {
  return (
    <View
      className={styles.monthHeader}
      onClick={() => onToggle(month.month)}
    >
      <View className={styles.monthTitle}>
        <Text className={styles.monthName}>
          {dayjs(month.month).format("YYYY年MM月")}
        </Text>
        <Text className={styles.dateRange}>
          {dayjs(month.month).startOf("M").format("MM月DD日")} -{" "}
          {dayjs(month.month).endOf("M").format("MM月DD日")}
        </Text>
      </View>
      <View className={styles.monthSummary}>
        <View className={styles.flowItem}>
          <Text className={styles.flowLabel}>流出:</Text>
          <Text className={styles.flowAmount}>¥{month.expense}</Text>
        </View>
        <View className={styles.flowItem}>
          <Text className={styles.flowLabel}>流入:</Text>
          <Text className={styles.flowAmount}>¥{month.income}</Text>
        </View>
      </View>
      <View className={styles.arrowIcon}>
        <IconFont
          type={isExpanded ? "icon-down" : "icon-right"}
          size={14}
          color="#999"
        />
      </View>
    </View>
  );
};

export default MonthHeader;