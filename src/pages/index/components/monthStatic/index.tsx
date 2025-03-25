import React from "react";
import { Text, View } from "@tarojs/components";
import styles from "./index.module.less";
import cs from "classnames";

const AmountBox = ({
  value,
  className,
}: {
  value: any;
  className?: string;
}) => {
  const _className = cs(styles.amountBox, className);

  return (
    <View className={_className}>
      <Text>¥</Text>
      <Text>{value}</Text>
    </View>
  );
};


const Index = (props) => {
  const { totalIncome, totalExpense, balance } = props;


  return (
    <View className={styles.monthStatic}>
      <View>总支出</View>

      <AmountBox value={totalExpense} className={styles.expenseNumber} />
      <View className={styles.bottomRow}>
        <View>
          <Text>总收入</Text>
          <AmountBox value={totalIncome} />
        </View>
        <View>
          <Text>结余</Text>
          <AmountBox value={balance} />
        </View>
      </View>
    </View>
  );
};

export default Index;
