import { View } from "@tarojs/components";
import styles from "../skeleton.module.less";

const AccountDetailSkeleton = () => {
  return (
    <View className={styles.skeletonContainer}>
      {/* 账户信息卡片骨架 */}
      <View className={styles.accountCardSkeleton}>
        <View className={styles.accountIconSkeleton} />
        <View className={styles.accountInfoSkeleton}>
          <View className={styles.accountNameSkeleton} />
          <View className={styles.accountBalanceSkeleton} />
        </View>
      </View>

      {/* 月度记录骨架 */}
      {[1, 2].map((item) => (
        <View key={item} className={styles.monthCardSkeleton}>
          <View className={styles.monthHeaderSkeleton}>
            <View className={styles.monthTitleSkeleton} />
            <View className={styles.monthSummarySkeleton}>
              <View className={styles.flowItemSkeleton} />
              <View className={styles.flowItemSkeleton} />
            </View>
          </View>

          {/* 日记录骨架 */}
          {[1, ].map((daily) => (
            <View key={daily} className={styles.dailyStatSkeleton}>
              <View className={styles.dailyHeaderSkeleton}>
                <View className={styles.dateSkeleton} />
                <View className={styles.summarySkeleton} />
              </View>

              {/* 交易记录骨架 */}
              {[1,2].map((record) => (
                <View key={record} className={styles.recordItemSkeleton}>
                  <View className={styles.recordIconSkeleton} />
                  <View className={styles.recordInfoSkeleton}>
                    <View className={styles.recordTypeSkeleton} />
                    <View className={styles.recordAmountSkeleton} />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default AccountDetailSkeleton;