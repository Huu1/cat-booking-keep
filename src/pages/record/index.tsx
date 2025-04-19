import { useState, useCallback, useMemo, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import NumberKeyboard from "@/pages/record/components/NumberKeyboard";
import styles from "./index.module.less";
import { getCategories, saveRecord } from "./service";
import Switcher from "@/components/Switcher";
import CategoryList from "./components/CategoryList";
import AmountDisplay from "./components/AmountDisplay";
import DateNote from "./components/DateNote";
import { SafeArea } from "@nutui/nutui-react-taro";
import dayjs from "dayjs";
import { useRequest } from "taro-hooks";
import AccountSelector from "./components/AcccountSelector";
import BookSelector from "./components/BookSelector";
import ChooseImage from "./components/ChooseImage";

// 在组件中使用
const recordTypeOptions = [
  { value: "expense", label: "支出" },
  { value: "income", label: "收入" },
];


// 基础状态管理
interface FormState {
  amount: string;
  note: string;
  date: string;
  recordType: "expense" | "income";
  selectedCategoryId: number | null;
  bookId: number | null;
  accountId: number | null;
  images: string[];
}
const Index = () => {
  const [formState, setFormState] = useState<FormState>({
    amount: "",
    note: "",
    date: dayjs().format("YYYY/MM/DD HH:mm:ss"),
    recordType: "expense" as "expense" | "income",
    selectedCategoryId: null as number | null,
    bookId: null as number | null,
    accountId: null as number | null,
    images: [],
  });

  // 编辑模式状态管理
  const [editState, setEditState] = useState({
    isEditMode: false,
    recordId: null as number | null,
    initialized: false,
    categorySetFromParams: false,
  });

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 状态更新函数
  const updateFormState = useCallback((updates: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  // 获取分类列表
  const { data: categories = [] } = useRequest(
    () => getCategories(formState.recordType),
    {
      refreshDeps: [formState.recordType],
      ready: !editState.isEditMode || editState.initialized,
      onSuccess: (data) => {
        if (!data?.length) return;

        if (editState.isEditMode && editState.categorySetFromParams) {
          const categoryExists = data.some(
            (cat) => cat.id === formState.selectedCategoryId
          );
          if (!categoryExists) {
            updateFormState({ selectedCategoryId: data[0].id });
          }
        } else if (!editState.isEditMode || !editState.categorySetFromParams) {
          updateFormState({ selectedCategoryId: data[0].id });
        }
      },
    }
  );

  // 初始化处理
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};

    if (params.id) {
      const updates = {
        amount: params.amount || "",
        note: params.note || "",
        recordType: (params.type as "expense" | "income") || "expense",
        date: params.recordDate || formState.date,
        bookId: params.bookId ? Number(params.bookId) : null,
        accountId: params.accountId ? Number(params.accountId) : null,
        images: params.images ? params.images?.split(",") : [],
        selectedCategoryId: params.categoryId
          ? Number(params.categoryId)
          : null,
      };

      setEditState({
        isEditMode: true,
        recordId: Number(params.id),
        initialized: true,
        categorySetFromParams: !!params.categoryId,
      });

      updateFormState(updates);
    }

    // 处理从其他页面传递的 bookId
    const eventChannel = instance?.page?.getOpenerEventChannel?.();
    if (eventChannel) {
      eventChannel.on(
        "acceptDataFromOpenerPage",
        (data: { bookId: number }) => {
          updateFormState({ bookId: data.bookId });
        }
      );
    }
  }, []);

  // 保存记录
  const { loading, run } = useRequest(saveRecord, {
    manual: true,
    debounceWait: 300,
    onBefore: () => setIsSubmitting(true),
    onSuccess: (data, params: any) => {
      Taro.showToast({
        title: editState.isEditMode ? "修改成功" : "保存成功",
        icon: "success",
        duration: 1000,
      });

      // 编辑模式下直接返回，非编辑模式且有回调时执行回调
      if (editState.isEditMode || !params?.[0]?.callback) {
        Taro.eventCenter.trigger("reload_index_page");
        Taro.eventCenter.trigger("reload_record_detail_page");
        setTimeout(() => Taro.navigateBack(), 1000);
      } else {
        params[0].callback?.();
        updateFormState({ amount: "" });
      }
    },
    onError: (error) => {
      console.log("记账失败", error);
      Taro.showToast({
        title: editState.isEditMode ? "修改失败" : "记账失败",
        icon: "error",
        duration: 2000,
      });
    },
    onFinally: () => setIsSubmitting(false),
  });

  // 提交处理
  const submit = useCallback(
    (params) => {
      if (isSubmitting || !params.bookId) {
        !params.bookId &&
          Taro.showToast({ title: "请选择账本", icon: "error" });
        return;
      }

      if (editState.isEditMode && editState.recordId) {
        params.id = editState.recordId;
      }

      run(params);
    },
    [isSubmitting, editState.isEditMode, editState.recordId, run]
  );

  // 处理函数
  const handlers = {
    handleDone: useCallback(
      (result: string) => {
        submit({
          amount: Number(result),
          categoryId: formState.selectedCategoryId,
          note: formState.note,
          recordDate: dayjs(formState.date).format("YYYY-MM-DD HH:mm:ss"),
          accountId: formState.accountId,
          type: formState.recordType,
          bookId: formState.bookId,
          images: formState.images ?? [],
        });
      },
      [formState, submit]
    ),

    handleAgain: useCallback(
      (result: string, callback: () => void) => {
        // if (editState.isEditMode) return;

        submit({
          amount: Number(result),
          categoryId: formState.selectedCategoryId,
          note: formState.note,
          recordDate: dayjs(formState.date).format("YYYY-MM-DD HH:mm:ss"),
          accountId: formState.accountId,
          type: formState.recordType,
          bookId: formState.bookId,
          callback,
        });
      },
      [formState, editState.isEditMode, submit]
    ),

    handleCategorySelect: useCallback(
      (category) => {
        updateFormState({ selectedCategoryId: category.id });
      },
      [updateFormState]
    ),

    handleRecordTypeChange: useCallback(
      (value: string) => {
        updateFormState({ recordType: value as "expense" | "income" });
      },
      [updateFormState]
    ),

    handleNoteChange: useCallback(
      (value: string) => {
        updateFormState({ note: value });
      },
      [updateFormState]
    ),

    handleDateChange: useCallback(
      (value: string) => {
        updateFormState({ date: value });
      },
      [updateFormState]
    ),

    handleAccountChange: useCallback(
      (value: number) => {
        updateFormState({ accountId: value });
      },
      [updateFormState]
    ),

    handleBookChange: useCallback(
      (value: number) => {
        updateFormState({ bookId: value });
      },
      [updateFormState]
    ),
  };

  // 渲染 NavBar
  const navBarComponent = useMemo(
    () => (
      <NavBar
        title={
          <Switcher
            className={styles.switchBox}
            options={recordTypeOptions}
            value={formState.recordType}
            onChange={handlers.handleRecordTypeChange}
          />
        }
        back
        color="#000"
        // background="white"
      />
    ),
    [
      formState.recordType,
      editState.isEditMode,
      handlers.handleRecordTypeChange,
    ]
  );

  // 添加一个专门处理 amount 更新的函数，支持函数式更新
  const handleAmountChange = useCallback(
    (value: string | ((prev: string) => string)) => {
      if (typeof value === "function") {
        // 处理函数式更新
        setFormState((prev) => ({
          ...prev,
          amount: value(prev.amount),
        }));
      } else {
        // 处理直接赋值
        updateFormState({ amount: value });
      }
    },
    [updateFormState]
  );

  const getImages=()=>{
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};
    if (params.images) {
      return params.images?.split(",");
    }
    return [];
  }

  return (
    <Layout
      currentTab="home"
      showTabBar={false}
      navBar={navBarComponent}
      bodyClassName={styles.recordContainer}
    >
      <CategoryList
        categories={categories}
        selectedCategoryId={formState.selectedCategoryId}
        recordType={formState.recordType}
        onCategorySelect={handlers.handleCategorySelect}
      />

      <View className={styles.actrionPanel}>
        {/* <AccountSelector
          selectedAccountId={formState.accountId as any}
          onSelect={handlers.handleAccountChange}
        /> */}

        <ChooseImage
          onImageSelected={(urls: string[]) => {
            updateFormState({ images: urls });
          }}
          images={formState.images as string[]}
          maxCount={3}
        />
        <BookSelector
          selectedBookId={formState.bookId as any}
          onSelect={handlers.handleBookChange}
        />
      </View>

      <View className={styles.inputContainer}>
        <AmountDisplay
          amount={formState.amount}
          recordType={formState.recordType}
        />
        <View className={styles.divider} />
        <DateNote
          note={formState.note}
          date={formState.date}
          onNoteChange={handlers.handleNoteChange}
          onDateChange={handlers.handleDateChange}
        />
      </View>

      <NumberKeyboard
        amount={formState.amount}
        setAmount={handleAmountChange}
        recordType={formState.recordType}
        onDone={handlers.handleDone}
        onAgain={handlers.handleAgain}
        disabled={isSubmitting}
        isEditMode={editState.isEditMode} // 传递编辑模式状态
      />

      <SafeArea position="bottom" />
    </Layout>
  );
};

export default Index;
