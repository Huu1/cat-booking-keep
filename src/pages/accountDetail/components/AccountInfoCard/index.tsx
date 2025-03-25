import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface AccountInfoCardProps {
  name: string;
  balance: string;
  icon: string;
  onMoreClick?: () => void;
  onAddRecord?: () => void; // 添加记一笔回调
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({
  name,
  balance,
  icon,
  onMoreClick,
  onAddRecord,
}) => {
  return (
    <View className={styles.accountCard}>
      <View className={styles.accountHeader}>
        <View className={styles.accountIcon}>
          <IconFont type={icon} size={36} color="#4285f4" />
        </View>
        <Text className={styles.accountName}>{name}</Text>
        {/* <Text className={styles.addRecordBtn} onClick={onAddRecord}>记一笔</Text> */}
        <Text className={styles.moreBtn} onClick={onMoreClick}>更多</Text>
      </View>

      <View className={styles.balanceSection}>
        <Text className={styles.balanceLabel}>账户余额</Text>
        <View className={styles.balanceAmount}>
          <Text className={styles.currencySymbol}>¥</Text>
          <Text className={styles.amount}>{balance}</Text>
          <IconFont type="icon-edit" size={20} color="#999" style={{ marginLeft: 8 }} />
        </View>
      </View>
    </View>
  );
};

export default AccountInfoCard;