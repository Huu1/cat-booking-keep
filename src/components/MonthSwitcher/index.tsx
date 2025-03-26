import { Text, View } from "@tarojs/components";
import React, { useState } from "react";
import styles from "./index.module.less";
import IconFont from "../Iconfont";

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
        <View className={styles["icon-wrapper"]}>
          <IconFont type="icon-zuo" size={16} color="#898989"  />
        </View>
      </View>

      <Text className={styles["month-text"]}>
        {formatDate(currentDate)?.text}
      </Text>

      <View className={styles["arrow-button"]} onClick={handleNextMonth}>
        <View className={styles["icon-wrapper"]}>
          <IconFont type="icon-youbian" color="#898989" size={16} />
        </View>
      </View>
    </View>
  );
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  return {
    text: `${year}-${month}`,
    year: year.toString(),
    month: month.toString(),
  };
};

export default Index;
