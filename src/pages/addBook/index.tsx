import { useState, useEffect } from "react";
import { View, Text, Input, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { SafeArea } from "@nutui/nutui-react-taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { useRequest } from "taro-hooks";
import { addBook, getBookDetail, updateBook } from "./service";
import { getIcons } from "@/utils/iconUtils";

interface Book {
  id?: number;
  name: string;
  icon: string;
  color: string;
}

// 颜色选项
const colorOptions = [
  "#F27166", // 红色
  "#FF7F50", // 珊瑚色
  "#FFA500", // 橙色
  "#F8D949", // 黄色
  "#53CC7E", // 绿色
  "#00CBA9", // 青绿色
  "#00BCD4", // 青色
  "#2196F3", // 蓝色
  "#3F51B5", // 靛蓝色
  "#673AB7", // 深紫色
];

const AddBook = () => {
  // 使用自定义Hook获取图标，可以指定分组
  const icons = getIcons("bookIcon");

  const [bookName, setBookName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [isEdit, setIsEdit] = useState(false);
  const [bookId, setBookId] = useState<number | null>(null);

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};

    if (params.id) {
      setIsEdit(true);
      setBookId(Number(params.id));
      fetchBookDetail(Number(params.id));
    }
  }, []);

  // 获取账本详情
  const { run: fetchBookDetail } = useRequest(getBookDetail, {
    manual: true,
    onSuccess: (data) => {
      setBookName(data.name || "");
      setSelectedColor(data.color || "#F8D949");
      setSelectedIcon(data.icon || "icon-canyin");
    },
  });

  // 保存账本
  const { loading, run: saveBook } = useRequest(
    (params) => (isEdit ? updateBook(params) : addBook(params)),
    {
      manual: true,
      onSuccess: () => {
        Taro.showToast({
          title: isEdit ? "更新成功" : "创建成功",
          icon: "success",
        });

        // 触发刷新事件
        Taro.eventCenter.trigger("reload_books_page");

        // 返回上一页
        setTimeout(() => {
          Taro.navigateBack();
        }, 2000);
      },
      onError: () => {
        Taro.showToast({
          title: isEdit ? "更新失败" : "创建失败",
          icon: "error",
        });
      },
    }
  );

  // 处理账本名称变更
  const handleNameChange = (e) => {
    setBookName(e.detail.value);
  };

  // 处理颜色选择
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // 处理图标选择
  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
  };

  // 提交表单
  const handleSubmit = () => {
    if(loading) return;
    if (!bookName.trim()) {
      Taro.showToast({
        title: "请输入账本名称",
        icon: "none",
      });
      return;
    }

    const params: Book = {
      name: bookName,
      icon: selectedIcon,
      color: selectedColor,
    };

    if (isEdit && bookId) {
      params.id = bookId;
    }

    saveBook(params);
  };

  return (
    <Layout
      showTabBar={false}
      navBar={
        <NavBar
          title={isEdit ? "编辑账本" : "新建账本"}
          back
          color="#000"
          // background="white"
          right={
            <Text
              style={{ color: "#1890ff", fontSize: "14px" }}
              onClick={handleSubmit}
            >
              保存
            </Text>
          }
        />
      }
      bodyClassName={styles.container}
    >
      <ScrollView scrollY className={styles.content}>
        {/* 账本名称输入 */}
        <View className={styles.inputSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>图标和名称</Text>
            <View
              className={styles.saveButton}
              onClick={handleSubmit}
            >
              保存账本
            </View>
          </View>
          <View className={styles.inputCard}>
            <View
              className={styles.iconPreview}
              style={{ backgroundColor: selectedColor }}
            >
              <IconFont type={selectedIcon} size={28} color="#fff" />
            </View>
            <Input
              className={styles.nameInput}
              value={bookName}
              onInput={handleNameChange}
              placeholder="请输入账本名称"
              placeholderClass={styles.placeholder}
              maxlength={20}
            />
          </View>
        </View>

        {/* 颜色选择 */}
        <View className={styles.colorSection}>
          <Text className={styles.sectionTitle}>颜色</Text>
          <View className={styles.colorGrid}>
            {colorOptions.map((color) => (
              <View
                key={color}
                className={`${styles.colorItem} ${
                  selectedColor === color ? styles.colorItemSelected : ""
                }`}
                style={{ backgroundColor: color, color: color }}
                onClick={() => handleColorSelect(color)}
              >
                {selectedColor === color && (
                  <IconFont type="icon-check" size={16} color="#fff" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 图标选择 - 单一组展示 */}
        <View className={styles.iconSection}>
          <Text className={styles.sectionTitle}>图标</Text>

          <View className={styles.iconGrid}>
            {icons.map((icon) => (
              <View
                key={icon}
                className={`${styles.iconItem} ${
                  selectedIcon === icon ? styles.iconItemSelected : ""
                }`}
                onClick={() => handleIconSelect(icon)}
              >
                <IconFont type={icon} size={24} color="#333" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SafeArea position="bottom" />
    </Layout>
  );
};

export default AddBook;
