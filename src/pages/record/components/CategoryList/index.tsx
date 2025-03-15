import React, { memo } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface CategoryListProps {
  categories: any[];
  selectedCategoryId: number | null;
  recordType: string;
  onCategorySelect: (category: any) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId,
  recordType,
  onCategorySelect,
}) => {
  return (
    <ScrollView scrollY className={styles.categoriesScroll}>
      <View className={styles.categoriesGrid}>
        {categories.map((category) => (
          <View
            key={category.id}
            className={`${styles.categoryItem} ${
              selectedCategoryId === category.id ? styles.selectedCategory : ""
            }`}
            onClick={() => onCategorySelect(category)}
          >
            <View
              className={`${styles.categoryIcon} ${
                selectedCategoryId === category.id
                  ? styles[`${recordType}CategoryIcon`]
                  : ""
              }`}
            >
              <IconFont type={category.icon} size={24} />
            </View>
            <Text className={styles.categoryName}>{category.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// 使用memo包装组件，避免不必要的重渲染
export default memo(CategoryList);