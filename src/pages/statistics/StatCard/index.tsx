import React from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface StatItemData {
  label: string;
  value: string;
}

interface StatCardProps {
  title: string;
  icon: string;
  data: StatItemData[];
  onCardClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, data, onCardClick }) => {
  return (
    <View className={styles.statCard} onClick={onCardClick}>
      <View className={styles.cardHeader}>
        <View className={styles.cardTitle}>
          <View className={styles.iconWrapper}>
            <IconFont type={icon} size={14} color="#fff"  />
          </View>
          <Text>{title}</Text>
        </View>
      </View>
      <View className={styles.cardContent}>
        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={styles.statLabel}>
              {data[0].label}
              {/* {data[0].label === "支出" || data[0].label === "收入" ? ">" : ""} */}
            </Text>
            <Text className={styles.statValue}>¥{data[0].value}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statLabel}>
              {data[1].label}
              {/* {data[1].label === "支出" || data[1].label === "收入" ? ">" : ""} */}
            </Text>
            <Text className={styles.statValue}>¥{data[1].value}</Text>
          </View>
        </View>
        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={styles.statLabel}>
              {data[2].label}
              {/* {data[2].label === "支出" || data[2].label === "收入" ? ">" : ""} */}
            </Text>
            <Text className={styles.statValue}>¥{data[2].value}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statLabel}>
              {data[3].label}
              {/* {data[3].label === "支出" || data[3].label === "收入" ? ">" : ""} */}
            </Text>
            <Text className={styles.statValue}>¥{data[3].value}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatCard;
