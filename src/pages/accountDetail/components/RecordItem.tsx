import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import cs from "classnames";
import IconFont from "@/components/Iconfont";
import styles from "../index.module.less";
import { StatisticsRecord } from "../types";

interface RecordItemProps {
  record: StatisticsRecord;
}

const RecordItem: React.FC<RecordItemProps> = ({ record }) => {
  return (
    <View className={styles.recordItem}>
      <View className={styles.recordContent}>
        <View
          className={cs(styles.recordIcon, {
            [styles.expenseCategoryIcon]: record.type === "expense",
            [styles.incomeCategoryIcon]: record.type === "income",
          })}
        >
          <IconFont type={record.category.icon} size={20} />
        </View>
        <View className={styles.recordInfo}>
          <View className={styles.recordLeft}>
            <Text className={styles.recordType}>{record.category.name}</Text>
            <Text className={styles.recordTime}>
              {dayjs(record.recordDate).format("MM月DD日 HH:mm")}
            </Text>
          </View>
          <View className={styles.recordRight}>
            <Text
              className={styles.recordAmount}
              style={{
                color: record.type === "expense" ? "#f27166" : "#53cc7e",
              }}
            >
              {record.type === "expense" ? "-" : "+"}¥{record.amount}
            </Text>
            <Text className={styles.recordNote}>{record.note}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecordItem;
