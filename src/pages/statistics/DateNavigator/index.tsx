import React from "react";
import { View, Text, Picker } from "@tarojs/components";
import dayjs from "dayjs";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface DateNavigatorProps {
  dateType: string;
  currentDate: Date;
  startDate: string;
  endDate: string;
  onDateChange: (newDate: Date) => void;
  onDatePicker: (type: "start" | "end", e: any) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  dateType,
  currentDate,
  startDate,
  endDate,
  onDateChange,
  onDatePicker,
}) => {
  // 格式化当前显示的日期文本
  const getFormattedDate = () => {
    if (dateType === "week") {
      const weekStart = dayjs(currentDate).startOf("week");
      const weekEnd = dayjs(currentDate).endOf("week");
      return `${weekStart.format("YYYY年M月D日")} ~ ${weekEnd.format("D日")}`;
    } else if (dateType === "month") {
      return `${dayjs(currentDate).year()}年${
        dayjs(currentDate).month() + 1
      }月`;
    } else if (dateType === "year") {
      return `${dayjs(currentDate).year()}年`;
    } else if (dateType === "range") {
      return "自定义范围";
    }
  };

  // 上一个时间段
  const handlePrevDate = () => {
    if (dateType === "week") {
      onDateChange(dayjs(currentDate).subtract(1, "week").toDate());
    } else if (dateType === "month") {
      onDateChange(dayjs(currentDate).subtract(1, "month").toDate());
    } else if (dateType === "year") {
      onDateChange(dayjs(currentDate).subtract(1, "year").toDate());
    }
  };

  // 下一个时间段
  const handleNextDate = () => {
    if (dateType === "week") {
      onDateChange(dayjs(currentDate).add(1, "week").toDate());
    } else if (dateType === "month") {
      onDateChange(dayjs(currentDate).add(1, "month").toDate());
    } else if (dateType === "year") {
      onDateChange(dayjs(currentDate).add(1, "year").toDate());
    }
  };

  return (
    <View className={styles.dateNavigator}>
      {dateType !== "range" ? (
        // 非范围模式显示上一个/下一个按钮和当前日期
        <>
          <View className={styles.navButton} onClick={handlePrevDate}>
            <IconFont type="icon-left-arrow" size={12} color="#fff" />
          </View>
          <Text className={styles.currentDate}>{getFormattedDate()}</Text>
          <View className={styles.navButton} onClick={handleNextDate}>
            <IconFont type="icon-right-arrow" size={12} color="#fff" />
          </View>
        </>
      ) : (
        // 范围模式显示两个日期选择器
        <View className={styles.rangeDatePicker}>
          <View className={styles.datePickerItem}>
            <Picker
              mode="date"
              value={startDate.replace(/\//g, "-")}
              onChange={(e) => onDatePicker("start", e)}
            >
              <View className={styles.datePickerContent}>
                <Text className={styles.dateText}>{startDate}</Text>
                <IconFont type="icon-down" size={12} color="#4285f4" />
              </View>
            </Picker>
          </View>
          <Text className={styles.rangeSeparator}>~</Text>
          <View className={styles.datePickerItem}>
            <Picker
              mode="date"
              value={endDate.replace(/\//g, "-")}
              onChange={(e) => onDatePicker("end", e)}
            >
              <View className={styles.datePickerContent}>
                <Text className={styles.dateText}>{endDate}</Text>
                <IconFont type="icon-down" size={12} color="#4285f4" />
              </View>
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
};

export default DateNavigator;