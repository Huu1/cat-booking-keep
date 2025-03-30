import React from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import Switcher from "@/components/Switcher";
import styles from "./index.module.less";

interface CategoryHeaderProps {
  showType: "expense" | "income";
  onTypeChange: (type: "expense" | "income") => void;
  options: { value: string; label: string }[];
  title: string;
  icon?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  showType,
  onTypeChange,
  options,
  title,
  icon
}) => {
  return (
    <View className={styles.categoryHeader}>
      <View className={styles.categoryTitle}>
        <View className={styles.iconWrapper}>
          <IconFont type={icon!} size={12} color="#FFF" />
        </View>
        <Text className={styles.titleText}>{title}</Text>
      </View>
      {options.length > 0 && (
        <Switcher
          options={options}
          value={showType}
          onChange={onTypeChange}
          className={styles.typeSwitcher}
        />
      )}
    </View>
  );
};

export default CategoryHeader;
