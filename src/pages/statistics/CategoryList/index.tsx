import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { cssGradients } from "../CategoryChart";

type CategoryItemType = {
  id: string | number;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
  count: number;
};

interface CategoryListProps {
  categories: CategoryItemType[];
  onItemClick: (id: string | number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onItemClick,
}) => {
  // 添加展开/收起状态
  const [expanded, setExpanded] = useState(false);
  // 设置默认显示的条目数
  const defaultShowCount = 5;

  // 获取分类颜色 - 使用从ExpenseChart导入的渐变色
  const getCategoryStyle = (index: number) => {
    return {
      background: cssGradients[index % cssGradients.length],
    };
  };

  // 根据展开状态决定显示的分类数量
  const displayCategories = expanded
    ? categories
    : categories.slice(0, defaultShowCount);

  return (
    <View className={styles.categoryList}>
      {displayCategories.map((category, index) => (
        <View
          key={category.id || index}
          className={styles.categoryItem}
          onClick={() => onItemClick(category.id)}
        >
          <View className={styles.categoryInfo}>
            <View
              className={styles.categoryIcon}
              style={getCategoryStyle(index)}
            >
              <IconFont type={category.icon} size={26} color="#fff" />
            </View>
            <View className={styles.categoryDetail}>
              <View className={styles.categoryName}>
                <Text className={styles.nameText}>{category.name}</Text>
                <Text className={styles.percentage}>
                  {category.percentage?.toFixed(1) || 0}%
                </Text>
              </View>
              <View className={styles.progressBar}>
                <View
                  className={styles.progressFill}
                  style={{
                    width: `${category.percentage || 0}%`,
                    background: cssGradients[index % cssGradients.length],
                    opacity: 0.6,
                  }}
                />
              </View>
            </View>
          </View>
          <View className={styles.categoryAmount}>
            <Text className={styles.amount}>
              ¥{category.amount?.toFixed(2) || 0}
            </Text>
            <View className={styles.countWrapper}>
              <Text className={styles.count}>{category.count || 0}笔</Text>
            </View>
          </View>
        </View>
      ))}

      {/* 当分类数量超过默认显示数量时，显示展开/收起按钮 */}
      {categories.length > defaultShowCount && (
        <View
          className={styles.expandButton}
          onClick={() => setExpanded(!expanded)}
        >
          <Text className={styles.expandText}>
            {expanded ? "收起" : "展开"}
          </Text>
          <IconFont
            type={expanded ? "icon-arrow-up" : "icon-arrow-down"}
            size={16}
            color="#999"
          />
        </View>
      )}
    </View>
  );
};

export default CategoryList;
