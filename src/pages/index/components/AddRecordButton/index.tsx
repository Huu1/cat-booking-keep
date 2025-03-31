import { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface AddRecordButtonProps {
  onAddRecord?: () => void;
}

const AddRecordButton = ({ onAddRecord }: AddRecordButtonProps) => {
  const [buttonBottom, setButtonBottom] = useState(120);

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    const tabBarHeight = 56;
    const safeAreaBottom = systemInfo.safeArea
      ? systemInfo.screenHeight - systemInfo.safeArea.bottom
      : 0;
    setButtonBottom(tabBarHeight + safeAreaBottom + 20);
  }, []);

  return (
    <View
      className={styles.addRecordButton}
      style={{ bottom: buttonBottom + "px" }}
      onClick={onAddRecord}
    >
      <View className={styles.addButtonInner}>
        <IconFont type="icon-tianjia" size={20} color="#333" />
        <Text className={styles.addButtonText}>记一笔</Text>
      </View>
    </View>
  );
};

export default AddRecordButton;
