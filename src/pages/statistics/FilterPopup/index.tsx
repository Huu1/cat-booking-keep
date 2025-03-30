import { View, ScrollView } from "@tarojs/components";
import { useState, useEffect } from "react";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import Popup from "@/components/Popup";
import { Book } from "@/pages/books";
import { Account } from "@/pages/account/components/AccountSection";
import { SafeArea } from "@nutui/nutui-react-taro";

export type TFilterOption = {
  id: number;
  name: string;
  icon: string;
  subName?: string;
  selected?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedBooks: number[], selectedAccounts: number[]) => void;
  books?: Book[];
  accounts?: Account[];
  selectedBooks: number[];
  selectedAccounts: number[];
};

const FilterPopup: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  books = [],
  accounts = [],
  selectedBooks: initialSelectedBooks = [],
  selectedAccounts: initialSelectedAccounts = [],
}) => {
  // 将 Book 和 Account 类型转换为组件内部使用的 TFilterOption 类型
  const bookOptions = books.map((book) => ({
    id: book.id,
    name: book.name,
    icon: book.icon,
  }));

  const accountOptions = accounts.map((account) => ({
    id: account.id,
    name: account.name,
    icon: account.icon,
  }));

  const [selectedBooks, setSelectedBooks] = useState<number[]>(initialSelectedBooks);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>(initialSelectedAccounts);

  // 当父组件传入的选中状态变化时，更新内部状态
  useEffect(() => {
    if (visible) {
      setSelectedBooks(initialSelectedBooks);
      setSelectedAccounts(initialSelectedAccounts);
    }
  }, [visible, initialSelectedBooks, initialSelectedAccounts]);

  const handleSelect = (type: "books" | "accounts", id: number) => {
    if (type === "books") {
      setSelectedBooks((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedAccounts((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedBooks, selectedAccounts);
    onClose();
  };

  const handleReset = (type: "books" | "accounts") => {
    if (type === "books") {
      setSelectedBooks([]);
    } else {
      setSelectedAccounts([]);
    }
  };

  // 渲染选项
  const renderOption = (item: any, type: "books" | "accounts") => {
    const isSelected =
      type === "books"
        ? selectedBooks.includes(item.id)
        : selectedAccounts.includes(item.id);

    return (
      <View
        key={item.id}
        className={`${styles.optionItem} ${isSelected ? styles.selected : ""}`}
        onClick={() => handleSelect(type, item.id)}
      >
        <View className={styles.iconWrapper}>
          <IconFont type={item.icon} size={24} />
        </View>
        <View className={styles.optionContent}>
          <View className={styles.name}>{item.name}</View>
        </View>
        <View className={styles.checkbox}>
          {isSelected ? (
            <View className={styles.checkedBox}>
              <IconFont type="icon-xuanze" size={14} color="#fff" />
            </View>
          ) : (
            <View className={styles.uncheckedBox}></View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Popup
      visible={visible}
      position="bottom"
      onClose={onClose}
      style={{ zIndex: 1000 }}
      // className={styles.filterPopup}
    >
      <View className={styles.container}>
        <View className={styles.header}>
          <View className={styles.close} onClick={onClose}>
            <IconFont type="icon-close" size={16} color="#333" />
          </View>
          <View className={styles.title}>筛选</View>
          <View className={styles.complete} onClick={handleConfirm}>
            完成
          </View>
        </View>

        <ScrollView
          className={styles.content}
          showScrollbar={false}
          scrollY
          style={{ maxHeight: 'calc(70vh - 100px)' }}
        >
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>筛选账本</View>
              <View
                className={styles.resetBtn}
                onClick={() => handleReset("books")}
              >
                <IconFont type="icon-refresh" size={16} color="#1677FF" />
                <View className={styles.resetText}>重置</View>
              </View>
            </View>
            <View className={styles.optionList}>
              {bookOptions.map((book) => renderOption(book, "books"))}
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>筛选账户</View>
              <View
                className={styles.resetBtn}
                onClick={() => handleReset("accounts")}
              >
                <IconFont type="icon-refresh" size={16} color="#1677FF" />
                <View className={styles.resetText}>重置</View>
              </View>
            </View>
            <View className={styles.optionList}>
              {accountOptions.map((account) =>
                renderOption(account, "accounts")
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <SafeArea position="bottom" />
    </Popup>
  );
};

export default FilterPopup;
