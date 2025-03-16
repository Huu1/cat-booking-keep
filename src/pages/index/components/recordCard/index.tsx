import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import dayjs from "dayjs";

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
  handleClick: (recordId: number) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({
  date,
  weekday,
  income,
  expense,
  records,
  handleClick
}) => {
  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // 添加状态控制展开收起
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View className={styles.recordCard}>
      <View className={styles.cardHeader}>
        <View className={styles.dateInfo}>
          <Text className={styles.date}>{formatDate(date)}</Text>
          <Text className={styles.weekday}>{weekday}</Text>
        </View>
        <View className={styles.amountInfo}>
          {income ? (
            <View className={styles.incomeItem}>
              <Text className={styles.label}>收</Text>
              <Text className={`${styles.value} ${styles.incomeValue}`}>
                ¥ {income.toFixed(2)}
              </Text>
            </View>
          ) : (
            <></>
          )}

          {expense ? (
            <View className={styles.expenseItem}>
              <Text className={styles.label}>支</Text>
              <Text className={`${styles.value} ${styles.expenseValue}`}>
                ¥ {expense.toFixed(2)}
              </Text>
            </View>
          ) : (
            <></>
          )}

          <View
            className={`${styles.expandButton} ${
              isExpanded ? styles.expanded : ""
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* <IconFont type="icon-arrow-down" size={16} /> */}
            {">"}
          </View>
        </View>
      </View>

      {/* 根据展开状态控制记录列表显示 */}
      {isExpanded && (
        <View className={styles.recordList}>
          {records.map((record) => (
            <View key={record.id} className={styles.recordItem} onClick={()=>handleClick(record.id)}>
              <View
                className={`${styles.iconWrapper} ${
                  record.type === "expense"
                    ? styles.expenseIcon
                    : styles.incomeIcon
                }`}
              >
                <IconFont type={record.category.icon} size={20} />
              </View>
              <View className={styles.recordInfo}>
                <Text className={styles.category}>{record.category.name}</Text>
                {record.recordDate && (
                  <Text className={styles.subCategory}>
                    {dayjs(record.recordDate).format("HH:mm")}
                  </Text>
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
          ))}
        </View>
      )}
    </View>
  );
};

export default RecordCard;
