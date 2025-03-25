import { View } from "@tarojs/components";
import { useState } from "react";
import styles from "../index.module.less";
import { Statistics } from "../types";
import MonthHeader from "./MonthHeader";
import DailyStatItem from "./DailyStatItem";

interface MonthCardProps {
  month: Statistics;
}

const MonthCard: React.FC<MonthCardProps> = ({ month }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (monthStr: string) => {
    setIsExpanded(prev => !prev);
  };

  return (
    <View className={styles.monthCard}>
      <MonthHeader
        month={month}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
      />

      {isExpanded &&
        month.dailyStats &&
        month.dailyStats.map((dailyStats) => (
          <DailyStatItem key={dailyStats.date} dailyStats={dailyStats} />
        ))}
    </View>
  );
};

export default MonthCard;