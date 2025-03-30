import * as React from "react";
import { View } from "@tarojs/components";
import styles from "../index.module.less";
import CategoryHeader from "../CategoryHeader";
import AssetTrendsChart from "./AssetTrendsChart";
import { useRequest } from "taro-hooks";
import { getAssetsTrend } from "../service";
import { TDateType } from "..";
import { useAppStore } from "@/store";

const Index = ({
  dateType,
  currentDate,
  style = {},
  bookIds,
  accountIds,
}: {
  dateType: TDateType;
  currentDate: Date;
  style?: React.CSSProperties;
  bookIds?: number[];
  accountIds?: number[];
}) => {
  const { user } = useAppStore();
  // // 添加一个状态来控制显示支出还是收入 收入支出
  const [showType, setshowType] = React.useState<"expense" | "income">(
    "expense"
  );

  const { data } = useRequest(
    () => getAssetsTrend(dateType, currentDate, bookIds, accountIds),
    {
      refreshDeps: [dateType, currentDate, bookIds, accountIds],
      ready: !!user && dateType !== "range",
    }
  );

  return (
    <View className={styles.Card} style={{ ...style }}>
      <CategoryHeader
        showType={showType}
        options={[]}
        onTypeChange={setshowType}
        // title={`${showType === "expense" ? "支出" : "收入"}统计图`}
        title={`资产趋势图`}
        icon="icon-shouru"
      />
      <View className={styles.chartWrapper}>
        <AssetTrendsChart title="" data={data} dateType={dateType} />
      </View>
    </View>
  );
};

export default Index;
