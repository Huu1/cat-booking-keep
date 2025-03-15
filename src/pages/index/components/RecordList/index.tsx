import React from "react";
import { View } from "@tarojs/components";
import dayjs from "dayjs";
import RecordCard from "../recordCard";
import styles from "./index.module.less";

interface RecordListProps {
  recordList: any[];
  loading: boolean;
  hasMore: boolean;
}

const RecordList: React.FC<RecordListProps> = ({
  recordList,
  loading,
  hasMore,
}) => {
  // 使用 dayjs 将日期转换为星期几
  const getWeekday = (dateStr: string) => {
    return dayjs(dateStr).format("dddd");
  };

  return (
    <>
      {recordList && recordList.length > 0 ? (
        <>
          {recordList.map((dayRecord) => (
            <RecordCard
              key={dayRecord.date}
              date={dayRecord.date}
              weekday={getWeekday(dayRecord.date)}
              income={dayRecord.income}
              expense={dayRecord.expense}
              records={dayRecord.records}
            />
          ))}

          {/* 加载状态显示 */}
          <View className={styles.loadingWrapper}>
            {loading && (
              <View className={styles.loadingMore}>
                <View className={styles.loadingDot}></View>
                <View className={styles.loadingDot}></View>
                <View className={styles.loadingDot}></View>
              </View>
            )}

            {/* 没有更多数据提示 - 只在非加载状态下显示 */}
            {!hasMore && !loading && (
              <View className={styles.noMoreData}>没有更多数据了</View>
            )}
          </View>
        </>
      ) : (
        <View className={styles.noData}>暂无记录</View>
      )}
    </>
  );
};

export default RecordList;
