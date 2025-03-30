import React from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface AssetCardProps {
  netAssets: string;
  totalAssets: string;
  totalLiabilities: string;
  isAmountVisible: boolean;
  onToggleVisibility: () => void;
  formatAmount: (amount: string, showXXX?: boolean) => React.ReactNode;
}

const AssetCard: React.FC<AssetCardProps> = ({
  netAssets,
  totalAssets,
  totalLiabilities,
  isAmountVisible,
  onToggleVisibility,
  formatAmount,
}) => {
  return (
    <View className={styles.assetCard}>
      <View className={styles.netAsset}>
        <View className={styles.labelWrapper}>
          <Text className={styles.label}>净资产</Text>
          <IconFont
            type={isAmountVisible ? "icon-xianshikejian" : "icon-yincang"}
            size={22}
            color="#666"
            onClick={onToggleVisibility}
            className={styles.eyeIcon}
          />
        </View>
        <Text className={styles.amount}>
          {formatAmount(netAssets)}
        </Text>
      </View>
      <View className={styles.totalAssets}>
        <View className={styles.assetItem}>
          <Text className={styles.assetLabel}>总资产</Text>
          <Text className={styles.assetValue}>{formatAmount(totalAssets)}</Text>
        </View>
        <View className={styles.assetItem}>
          <Text className={styles.liabilityLabel}>总负债</Text>
          <Text className={styles.liabilityValue}>{formatAmount(totalLiabilities)}</Text>
        </View>
      </View>
    </View>
  );
};

export default AssetCard;