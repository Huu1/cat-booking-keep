import { Text, View, Swiper, SwiperItem } from "@tarojs/components";
import styles from "./index.module.less";
import cs from "classnames";
import { useState } from "react";

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
      <Text className={styles.currency}>¥</Text>
      <Text>{value}</Text>
    </View>
  );
};

const Index = (props) => {
  const { totalIncome = 0, totalExpense = 0, balance = 0 } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View className={styles.monthStaticWrapper}>
      <Swiper
        className={styles.swiper}
        onChange={(e) => setCurrentIndex(e.detail.current)}
        circular={false}
        previousMargin="8px"  /* 添加前边距 */
        nextMargin="8px"      /* 添加后边距 */
        displayMultipleItems={1}
      >
        {/* 第一屏：基本统计 */}
        <SwiperItem>
          <View className={styles.monthStatic}>
            {/* 内容保持不变 */}
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>总支出</Text>
              <AmountBox
                value={totalExpense}
                className={styles.expenseNumber}
              />
            </View>

            <View className={styles.statRow}>
              <View className={styles.statItem}>
                <Text className={styles.statLabel}>总收入</Text>
                <AmountBox
                  value={totalIncome}
                  className={styles.incomeNumber}
                />
              </View>

              <View className={styles.divider}></View>

              <View className={styles.statItem}>
                <Text className={styles.statLabel}>结余</Text>
                <AmountBox value={balance} className={styles.balanceNumber} />
              </View>
            </View>
          </View>
        </SwiperItem>

        {/* 第二屏：更多统计数据 */}
        <SwiperItem>
          <View className={styles.monthStatic}>
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>本月预算</Text>
              <AmountBox
                value={props.budget || 0}
                className={styles.budgetNumber}
              />
            </View>

            <View className={styles.statRow}>
              <View className={styles.statItem}>
                <Text className={styles.statLabel}>日均支出</Text>
                <AmountBox
                  value={props.dailyAvg || 0}
                  className={styles.avgNumber}
                />
              </View>

              <View className={styles.divider}></View>

              <View className={styles.statItem}>
                <Text className={styles.statLabel}>记账笔数</Text>
                <Text className={styles.recordCount}>
                  {props.recordCount || 0}
                </Text>
              </View>
            </View>
          </View>
        </SwiperItem>
      </Swiper>

      {/* 指示器 */}
      <View className={styles.indicators}>
        <View
          className={`${styles.indicator} ${
            currentIndex === 0 ? styles.active : ""
          }`}
        ></View>
        <View
          className={`${styles.indicator} ${
            currentIndex === 1 ? styles.active : ""
          }`}
        ></View>
      </View>
    </View>
  );
};

export default Index;
