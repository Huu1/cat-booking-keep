import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { SafeArea, ActionSheet } from "@nutui/nutui-react-taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import { deleteBook, getBooks, setDefaultBookApi } from "./service";
import { useAppStore } from "@/store";

export interface Book {
  id: number;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  description?: string;
  isSystemDefault:boolean;
}

// 添加骨架屏组件
const BookSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          className={`${styles.bookCard} ${styles.skeletonCard}`}
        >
          <View className={styles.bookHeader}>
            <View
              className={`${styles.bookIcon} ${styles.skeletonIcon}`}
            ></View>
            <View
              className={`${styles.moreIcon} ${styles.skeletonMore}`}
            ></View>
          </View>
          <View className={styles.bookContent}>
            <View
              className={`${styles.bookName} ${styles.skeletonName}`}
            ></View>
          </View>
        </View>
      ))}
    </>
  );
};

const Books = () => {
  const { defaultBook, setDefaultBook } = useAppStore();
  // 添加ActionSheet相关状态
  const [isVisible, setIsVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  // 定义ActionSheet选项
  const options: Record<string, string | boolean>[] = [
    {
      name: "修改账本",
    },
    ...(currentBook?.isSystemDefault ? [] : [{ name: "删除账本" }]),
  ];

  // 获取所有账本
  const {
    data: books = [],
    loading,
    refresh,
  } = useRequest<Book[], [string]>(getBooks);

  // 监听刷新事件
  useEffect(() => {
    const reloadListener = () => {
      refresh();
    };
    Taro.eventCenter.on("reload_books_page", reloadListener);
    return () => {
      Taro.eventCenter.off("reload_books_page", reloadListener);
    };
  }, [refresh]);

  // 设置默认账本
  const handleSetDefault = async (book: Book) => {
    if (book.id === defaultBook?.id) return;
    try {
      // 这里应该有一个API调用来设置默认账本
      await setDefaultBookApi(book.id);
      // 更新全局状态
      setDefaultBook(book);

      setTimeout(() => {
        Taro.navigateBack();
      }, 300);
    } catch (error) {
      Taro.showToast({
        title: "设置失败",
        icon: "error",
      });
    }
  };

  // 创建新账本
  const createNewBook = () => {
    Taro.navigateTo({
      url: "/pages/addBook/index",
    });
  };

  // 处理更多按钮点击
  const handleMoreClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发设置默认账本
    setCurrentBook(book);
    setIsVisible(true);
  };

  // 处理选项点击
  const handleSelect = (option: Record<string, string | boolean>) => {
    if (!currentBook) return;

    switch (option.name) {
      case "修改账本":
        Taro.navigateTo({
          url: `/pages/addBook/index?id=${currentBook.id}`,
        });
        break;
      case "删除账本":
        Taro.showModal({
          title: "提示",
          content: "确定要删除该账本吗？",
          success: async function (res) {
            if (res.confirm) {
              try {
                await deleteBook(currentBook.id);
                Taro.showToast({
                  title: "删除成功",
                  icon: "success",
                });
                refresh();
              } catch (error) {}


            }
          },
        });
        break;
    }
    setIsVisible(false);
  };

  return (
    <Layout
      showTabBar={false}
      navBar={<NavBar title="我的账本" back color="#000" background="" />}
      bodyClassName={styles.container}
    >
      <View className={styles.bookList}>
        {loading ? (
          <BookSkeleton />
        ) : (
          <>
            {books.map((book) => (
              <View
                key={book.id}
                className={styles.bookCard}
                onClick={() => handleSetDefault(book)}
              >
                <View className={styles.bookSpine} style={{ backgroundColor: book.color }}></View>
                <View className={styles.bookInner}>
                  <View className={styles.bookHeader}>
                    <View
                      className={styles.bookIcon}
                      style={{ backgroundColor: book.color }}
                    >
                      <IconFont type={book.icon} size={22}  />
                    </View>

                    <IconFont
                      type="icon-gengduo"
                      size={22}
                      color="#666"
                      className={styles.moreIcon}
                      onClick={((e) => handleMoreClick(e, book)) as any}
                    />
                  </View>

                  <View className={styles.bookContent}>
                    <Text className={styles.bookName}>{book.name}</Text>

                    <View className={styles.bookActions}>
                      {defaultBook?.id === book.id ? (
                        <View className={styles.checkIcon}>
                          <IconFont
                            type="icon-xuanze"
                            size={18}
                            color={book.color}
                          />
                        </View>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* 新建账本卡片 */}
            <View
              className={`${styles.bookCard} ${styles.addBookCard}`}
              onClick={createNewBook}
            >
              <View className={styles.addBookContent}>
                <View className={styles.addBookIcon}>
                  <IconFont type="icon-xinjian" size={24} color="#fff" />
                </View>
                <Text className={styles.addBookText}>新建账本</Text>
              </View>
            </View>
          </>
        )}
      </View>

      <SafeArea position="bottom" />

      {/* 添加ActionSheet组件 */}
      <ActionSheet
        visible={isVisible}
        cancelText="取消"
        options={options}
        onSelect={handleSelect}
        onCancel={() => setIsVisible(false)}
      />
    </Layout>
  );
};

export default Books;
