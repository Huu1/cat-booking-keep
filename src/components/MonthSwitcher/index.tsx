import { Text, View } from "@tarojs/components";
import styles from "./index.module.less";
import IconFont from "../Iconfont";
import dayjs from "dayjs";

const Index = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate;
  setCurrentDate;
}) => {
  // 切换上月
  const handlePrevMonth = () => {
    const newDate = dayjs(currentDate).subtract(1, 'month').toDate();
    setCurrentDate(newDate);
  };

  // 切换下月
  const handleNextMonth = () => {
    const newDate = dayjs(currentDate).add(1, 'month').toDate();
    setCurrentDate(newDate);
  };

  return (
    <View className={styles["month-switcher"]}>
      <View className={styles["arrow-button"]} onClick={handlePrevMonth}>
        <View className={styles["icon-wrapper"]}>
          <IconFont type="icon-zuo" size={20} color="#898989"  />
        </View>
      </View>

      <Text className={styles["month-text"]}>
        {formatDate(currentDate)?.text}
      </Text>

      <View className={styles["arrow-button"]} onClick={handleNextMonth}>
        <View className={styles["icon-wrapper"]}>
          <IconFont type="icon-you" color="#898989" size={20} />
        </View>
      </View>
    </View>
  );
};

export const formatDate = (date: Date) => {
  const year = dayjs(date).year();
  const month = dayjs(date).format('MM');

  return {
    text: `${year}-${month}`,
    year: year.toString(),
    month: month,
  };
};

export default Index;
