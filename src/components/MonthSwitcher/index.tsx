import { Text, View } from "@tarojs/components";
import React, { useState } from "react";
import styles from "./index.module.less";

const Index = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate;
  setCurrentDate;
}) => {
  // 切换上月
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // 切换下月
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <View className={styles["month-switcher"]}>
      <View className={styles["arrow-button"]} onClick={handlePrevMonth}>
        {"<"}
      </View>

      <Text className={styles["month-text"]}>{formatDate(currentDate)}</Text>

      <Text className={styles["arrow-button"]} onClick={handleNextMonth}>
        {">"}
      </Text>
    </View>
  );
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

export default Index;
