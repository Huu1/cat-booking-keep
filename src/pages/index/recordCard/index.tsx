import React from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { Button, Swipe } from "@nutui/nutui-react-taro";

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  icon: string | null;
}

interface Record {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: string;
  amount: string;
  note: string;
  recordDate: string;
  category: Category;
  account: Account;
}

interface RecordCardProps {
  date: string;
  weekday: string;
  income: number;
  expense: number;
  records: Record[];
}

const RecordCard: React.FC<RecordCardProps> = ({
  date,
  weekday,
  income,
  expense,
  records,
}) => {
  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <View className={styles.recordCard}>
      <View className={styles.cardHeader}>
        <View className={styles.dateInfo}>
          <Text className={styles.date}>{formatDate(date)}</Text>
          <Text className={styles.weekday}>{weekday}</Text>
        </View>
        <View className={styles.amountInfo}>
          <View className={styles.incomeItem}>
            <Text className={styles.label}>收</Text>
            <Text className={`${styles.value} ${styles.incomeValue}`}>
              ¥ {income.toFixed(2)}
            </Text>
          </View>
          <View className={styles.expenseItem}>
            <Text className={styles.label}>支</Text>
            <Text className={`${styles.value} ${styles.expenseValue}`}>
              ¥ {expense.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.recordList}>
        {records.map((record) => (
          <Swipe
            key={record.id}
            rightAction={
              <Button type="primary" shape="square">
                删除
              </Button>
            }
          >
            <View className={styles.recordItem}>
              <View className={styles.iconWrapper}>
                <IconFont type={record.category.icon} size={24} />
              </View>
              <View className={styles.recordInfo}>
                <Text className={styles.category}>{record.category.name}</Text>
                {record.note && (
                  <Text className={styles.subCategory}>{record.note}</Text>
                )}
              </View>
              <Text
                className={`${styles.amount} ${
                  record.type === "expense" ? styles.expense : styles.income
                }`}
              >
                {record.type === "expense" ? "-" : "+"}
                {parseFloat(record.amount).toFixed(2)}
              </Text>
            </View>
          </Swipe>
        ))}
      </View>
    </View>
  );
};

export default RecordCard;
