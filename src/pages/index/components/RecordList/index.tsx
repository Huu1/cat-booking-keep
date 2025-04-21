import React, { useState } from "react";
import { View } from "@tarojs/components";
import dayjs from "dayjs";
import RecordCard from "../recordCard";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import { deleteRecord } from "@/pages/recordDetail/service";
import Taro from "@tarojs/taro";

interface RecordListProps {
  recordList: any[];
  loading: boolean;
  hasMore: boolean;
  handleClick: (recordId: number) => void;
}

const LoadingComp = () => {
  return (
    <View className={styles.loadingMore}>
      <View className={styles.loadingDot}></View>
      <View className={styles.loadingDot}></View>
      <View className={styles.loadingDot}></View>
    </View>
  );
};

const RecordList: React.FC<RecordListProps> = ({
  recordList,
  loading,
  hasMore,
  handleClick,
}) => {
  // 使用 dayjs 将日期转换为星期几
  const getWeekday = (dateStr: string) => {
    return dayjs(dateStr).format("dddd");
  };

  // 计算所有记录的总数
  const getTotalRecordsCount = () => {
    return recordList.reduce((total, dayRecord) => {
      return total + (dayRecord.records?.length || 0);
    }, 0);
  };

  const [currentSwiperOpenId, setCurrentSwiperOpenId] = useState<number | null>(
    null
  );

  // 删除记录
  const { loading: deleteLoading, run: runDelete } = useRequest(deleteRecord, {
    manual: true,
    onSuccess: () => {
      Taro.showToast({
        title: "删除成功",
        icon: "success",
        duration: 1000,
      });
      Taro.eventCenter.trigger("reload_index_page");
    },
    onError: (error) => {
      Taro.showToast({
        title: "删除记录失败",
        icon: "error",
        duration: 2000,
      });
    },
  });

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
              handleClick={handleClick}
              currentSwiperOpenId={currentSwiperOpenId}
              setCurrentSwiperOpenId={setCurrentSwiperOpenId}
              onDelete={(recordId) => {
                Taro.showModal({
                  title: "确认删除",
                  content: "确定要删除这笔账单吗？",
                  success: function (res) {
                    if (res.confirm) {
                      runDelete(recordId);
                    }
                  },
                  fail: function () {
                    setCurrentSwiperOpenId(null);
                  },
                });
              }}
            />
          ))}

          {/* 加载状态显示 */}
          <View className={styles.loadingWrapper}>
            {loading && <LoadingComp />}
            {/* 没有更多数据提示 - 只在非加载状态下显示 */}
            {!hasMore && !loading && getTotalRecordsCount() >= 6 && (
              <View className={styles.noMoreData}>没有更多数据了</View>
            )}
          </View>
        </>
      ) : !hasMore ? (
        <View className={styles.noData}>暂无记录</View>
      ) : (
        <LoadingComp />
      )}
    </>
  );
};

export default RecordList;
