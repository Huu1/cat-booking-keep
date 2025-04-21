import * as React from "react";
import { useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import { SafeArea } from "@nutui/nutui-react-taro";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import Popup from "@/components/Popup";
import { getBooks } from "@/pages/books/service";

interface Book {
  id: number;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  description?: string;
  isSystemDefault: boolean;
}

interface BookSelectorProps {
  selectedBookId?: number;
  onSelect: (bookId: number) => void;
  className?: string;
}

const BookSelector: React.FC<BookSelectorProps> = ({
  selectedBookId,
  onSelect,
  className=''
}) => {
  const [visible, setVisible] = useState(false);

  // 获取账本列表
  const { data: bookList = [] } = useRequest(getBooks);

  // 根据ID查找当前选中的账本
  const selectedBook =
    bookList.find((book) => book.id === selectedBookId) ||
    bookList.find((book) => book.isDefault);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSelect = (book: Book) => {
    onSelect(book.id);
    handleClose();
  };

  return (
    <>
      <View className={`${styles.bookSelector } ${ className}`} onClick={handleOpen}>
        <IconFont type="icon-shouzhizhangben" />
      </View>

      <Popup
        visible={visible}
        position="bottom"
        round
        onClose={handleClose}
        style={{ height: "30vh", display: "flex", flexDirection: "column" }}
      >
        <View className={styles.popupHeader}>
          <View className={styles.closeBtn}></View>
          <Text className={styles.popupTitle}>选择账本</Text>
          <View className={styles.rightAction}>
            <IconFont
              type="icon-close"
              size={20}
              color="#666"
              onClick={handleClose}
              className={styles.closeIcon}
            />
          </View>
        </View>

        <ScrollView
          className={styles.bookListContainer}
          scrollY
          scrollWithAnimation
        >
          <View className={styles.bookList}>
            {bookList.map((book) => (
              <View
                key={book.id}
                className={styles.bookItem}
                onClick={() => handleSelect(book)}
              >
                <View className={styles.bookItemLeft}>
                  <View
                    className={styles.bookIcon}
                    style={{ backgroundColor: book.color }}
                  >
                    <IconFont type={book.icon} size={20} color="#fff" />
                  </View>
                  <Text className={styles.bookItemName}>{book.name}</Text>
                </View>

                {selectedBook?.id === book.id && (
                  <View className={styles.checkIcon}>
                    <IconFont type="icon-xuanze" size={20} color="#4285f4" />
                  </View>
                )}
              </View>
            ))}
          </View>
          <SafeArea position="bottom" />
        </ScrollView>
      </Popup>
    </>
  );
};

export default BookSelector;
