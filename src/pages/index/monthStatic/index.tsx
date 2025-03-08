import { Text, View } from "@tarojs/components";
import React from "react";
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
  const { income, expense, net_surplus } = props;
  return (
    <View className={styles.monthStatic}>
      <View>月支出</View>
      <AmountBox value={expense} className={styles.expenseNumber} />
      <View className={styles.bottomRow}>
        <View>
          <Text>月收入</Text>
          <AmountBox value={income} />
        </View>
        <View>
          <Text>月结余</Text>
          <AmountBox value={net_surplus} />
        </View>
      </View>
    </View>
  );
};

export default Index;
