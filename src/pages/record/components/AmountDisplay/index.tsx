import React, { memo } from "react";
import { View, Text } from "@tarojs/components";
import styles from "./index.module.less";

interface AmountDisplayProps {
  amount: string;
  recordType: string;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount, recordType }) => {
  return (
    <View className={styles.amountSection}>
      <Text className={`${styles.currencySymbol} ${styles[`${recordType}Text`]}`}>
        ¥
      </Text>
      <Text className={`${styles.amountDisplay} ${styles[`${recordType}Text`]}`}>
        {amount || "0"}
      </Text>
    </View>
  );
};

// 使用memo包装组件，避免不必要的重渲染
export default memo(AmountDisplay);
