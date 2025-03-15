import { useState, useCallback, useMemo, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import NumberKeyboard from "@/pages/record/components/NumberKeyboard";
import styles from "./index.module.less";
import useRequest from "@/hooks/useRequest";
import { getCategories, saveRecord } from "./service";
import Switcher from "@/components/Switcher";
import CategoryList from "./components/CategoryList";
import AmountDisplay from "./components/AmountDisplay";
import DateNote from "./components/DateNote";
import { SafeArea } from "@nutui/nutui-react-taro";
import dayjs from "dayjs";

// 在组件中使用
const recordTypeOptions = [
  { value: "expense", label: "支出" },
  { value: "income", label: "收入" },
];

const Index = () => {

  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategory] = useState<number | null>(
    null
  );
  const [note, setNote] = useState("");

  // 修改日期状态，使用当前日期作为默认值
  const [date, setDate] = useState(dayjs().format("YYYY/MM/DD HH:mm:ss"));

  const [recordType, setRecordType] = useState("expense");

  const { loading, run } = useRequest(saveRecord, {
    manual: true,
    onSuccess: (data) => {
      console.log("记账成功", data);
      Taro.redirectTo({
        url: "/pages/index/index",
      });
    },
    onError: (error) => {
      console.log("记账失败", error);
    },
  });

  // 使用useCallback缓存函数引用
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category.id);
  }, []);

  // 添加 bookId 状态
  const [bookId, setBookId] = useState<number | null>(null);

  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const eventChannel = instance?.page?.getOpenerEventChannel?.();

    if (eventChannel) {
      eventChannel.on(
        "acceptDataFromOpenerPage",
        (data: { bookId: number }) => {
          setBookId(data.bookId);
        }
      );
    }
  }, []);

  // 在 handleDone 中使用 bookId
  const handleDone = useCallback(
    (result: string) => {
      const params = {
        amount: Number(result),
        categoryId: selectedCategoryId!,
        note,
        recordDate: dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
        accountId: 1,
        type: recordType,
        bookId: bookId!, // 使用传递过来的 bookId，如果没有则使用默认值
      };
      run(params);
    },
    [amount, selectedCategoryId, note, date, bookId] // 添加 bookId 依赖
  );

  // 使用useCallback缓存函数引用
  const handleAgain = useCallback(() => {
    setSelectedCategory(null);
    setNote("");
  }, []);

  // 使用useCallback缓存函数引用
  const handleNoteChange = useCallback((value: string) => {
    setNote(value);
  }, []);

  // 使用useCallback缓存函数引用
  const handleRecordTypeChange = useCallback((value: string) => {
    setRecordType(value);
  }, []);

  // 添加日期变更处理函数
  const handleDateChange = useCallback((value: string) => {
    setDate(value);
  }, []);

  const { data: categories = [] } = useRequest(
    () => getCategories(recordType),
    {
      refreshDeps: [recordType],
      onSuccess: (data) => {
        !selectedCategoryId && setSelectedCategory(data?.[0]?.id);
      },
    }
  );

  // 使用useMemo缓存NavBar组件
  const navBarComponent = useMemo(
    () => (
      <NavBar
        title={
          <Switcher
            className={styles.switchBox}
            options={recordTypeOptions}
            value={recordType}
            onChange={handleRecordTypeChange}
          />
        }
        back
        color="#000"
        background={"white"}
      />
    ),
    [recordType, handleRecordTypeChange]
  );

  return (
    <Layout
      currentTab="home"
      showTabBar={false}
      navBar={navBarComponent}
      bodyClassName={styles.recordContainer}
    >
      <CategoryList
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        recordType={recordType}
        onCategorySelect={handleCategorySelect}
      />

      <View className={styles.inputContainer}>
        <AmountDisplay amount={amount} recordType={recordType} />
        <View className={styles.divider} />
        <DateNote
          note={note}
          date={date}
          onNoteChange={handleNoteChange}
          onDateChange={handleDateChange}
        />
      </View>

      <NumberKeyboard
        amount={amount}
        setAmount={setAmount}
        recordType={recordType}
        onDone={handleDone}
        onAgain={handleAgain}
      />

      {/* 动态安全区域 */}
      <SafeArea position="bottom" />
    </Layout>
  );
};

export default Index;
