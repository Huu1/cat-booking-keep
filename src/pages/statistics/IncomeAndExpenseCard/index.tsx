import * as React from "react";
import { View } from "@tarojs/components";
import styles from "../index.module.less";
import CategoryHeader from "../CategoryHeader";
import ExpenseIncomeChart from "./ExpenseIncomeChart";
import { useRequest } from "taro-hooks";
import { getIncomeAndExpenseTrend } from "../service";
import { TDateType } from "..";

const Index = ({
  dateType,
  currentDate,
  style={},
  bookIds,
  accountIds
}: {
  dateType: TDateType;
  currentDate: Date;
  style?: React.CSSProperties;
  bookIds?: number[];
  accountIds?: number[];
}) => {
  // // 添加一个状态来控制显示支出还是收入 收入支出
  const [showType, setshowType] = React.useState<"expense" | "income">(
    "expense"
  );

  const { data=[] } = useRequest(
    () => getIncomeAndExpenseTrend(dateType, currentDate,bookIds,accountIds),
    {
      refreshDeps: [dateType, currentDate,bookIds,accountIds],
      ready:dateType!=='range'
    }
  );

  return (
    <View className={styles.Card} style={{...style}}>
      <CategoryHeader
        showType={showType}
        options={[]}
        onTypeChange={setshowType}
        title={`收入支出统计图`}
        icon="icon-zhichu"
      />

      <View className={styles.chartWrapper}>
        <ExpenseIncomeChart
          title=""
          data={data}
          dateType={dateType}
        />
      </View>
    </View>
  );
};

export default Index;
