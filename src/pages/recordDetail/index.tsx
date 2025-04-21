import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { SafeArea } from "@nutui/nutui-react-taro";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import { getRecordDetail, deleteRecord } from "./service";
import styles from "./index.module.less";
import dayjs from "dayjs";
import { useRequest } from "taro-hooks";

// 定义基础实体类型
type BaseEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// 定义账户类型
type Account = BaseEntity & {
  // 可以根据实际情况添加账户的其他字段
  name?: string;
};

// 定义账本类型
type Book = BaseEntity & {
  // 可以根据实际情况添加账本的其他字段
  name?: string;
};

// 定义分类类型
type Category = BaseEntity & {
  // 可以根据实际情况添加分类的其他字段
  name?: string;
  icon?: string;
};

// 定义记录类型
export type TRecordType = BaseEntity & {
  amount: string;
  note: string;
  recordDate: string;
  type: "expense" | "income";
  account: Account;
  book: Book;
  category: Category;
  tags?: string[];
  images?: string[];
  location?: string;
};

const RecordDetail = () => {
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  // 获取安全距离
  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    const safeArea = systemInfo.safeArea;
    if (safeArea) {
      const bottom = systemInfo.screenHeight - safeArea.bottom;
      setSafeAreaBottom(bottom);
    }
  }, []);

  const [recordId, setRecordId] = useState<number | null>(null);
  const [recordDetail, setRecordDetail] = useState<TRecordType | null>(null);

  const [showBill, setShowBill] = useState(false);

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};
    if (params.id) {
      setRecordId(Number(params.id));
    }
  }, []);

  // 获取记录详情
  const {
    loading,
    run: fetchDetail,
    refresh,
  } = useRequest(getRecordDetail, {
    manual: true,
    onSuccess: (data) => {
      setRecordDetail(data);

      setTimeout(() => setShowBill(true), 100);
    },
    onError: (error) => {
      console.log("获取记录详情失败", error);
      Taro.showToast({
        title: "获取记录详情失败",
        icon: "error",
        duration: 2000,
      });
    },
  });

  useEffect(() => {
    const handleRecordSuccess = () => {
      refresh();
    };
    // 使用相同的字符串事件名
    Taro.eventCenter.on("reload_record_detail_page", handleRecordSuccess);
    return () => {
      Taro.eventCenter.off("reload_record_detail_page", handleRecordSuccess);
    };
  }, []);

  // 删除记录
  const { loading: deleteLoading, run: runDelete } = useRequest(deleteRecord, {
    manual: true,
    onSuccess: () => {
      Taro.showToast({
        title: "删除成功",
        icon: "success",
        duration: 1000,
      });
      // 返回上一页
      setTimeout(() => {
        Taro.eventCenter.trigger("reload_index_page");
        Taro.navigateBack();
      }, 1000);
    },
    onError: (error) => {
      console.log("删除记录失败", error);
      Taro.showToast({
        title: "删除记录失败",
        icon: "error",
        duration: 2000,
      });
    },
  });

  // 加载记录详情
  useEffect(() => {
    if (recordId) {
      fetchDetail(recordId);
    }
  }, [recordId]);

  // 处理编辑
  const handleEdit = () => {
    if (!recordDetail) return;

    Taro.navigateTo({
      url: `/pages/record/index?id=${recordId}&type=${
        recordDetail.type
      }&amount=${recordDetail.amount}&note=${
        recordDetail.note || ""
      }&recordDate=${recordDetail.recordDate}&bookId=${
        recordDetail.book.id
      }&categoryId=${recordDetail.category.id}&accountId=${
        recordDetail.account?.id
      }&images=${recordDetail.images ?? []}`,
    });
  };

  // 处理删除
  const handleDelete = () => {
    if (!recordId) return;

    Taro.showModal({
      title: "确认删除",
      content: "确定要删除这笔账单吗？",
      success: function (res) {
        if (res.confirm) {
          runDelete(recordId);
        }
      },
    });
  };

  // 处理退款
  const handleRefund = () => {
    if (!recordDetail) return;

    // Taro.navigateTo({
    //   url: `/pages/record/index?recordType=${
    //     recordDetail.type === "expense" ? "income" : "expense"
    //   }&amount=${recordDetail.amount}&note=退款: ${
    //     recordDetail.note || ""
    //   }&bookId=${recordDetail.bookId}&categoryId=${
    //     recordDetail.categoryId
    //   }&accountId=${recordDetail.accountId}`,
    // });
  };

  // 处理存为模板
  const handleSaveAsTemplate = () => {
    if (!recordDetail) return;

    // 这里可以实现存为模板的逻辑
    Taro.showToast({
      title: "已存为模板",
      icon: "success",
      duration: 1000,
    });
  };

  // 渲染详情项
  const renderDetailItem = (
    label: string,
    value: string | number | null,
    icon?: string,
    onClick?: () => void
  ) => {
    return (
      <View className={styles.detailItem} onClick={onClick}>
        <Text className={styles.itemLabel}>{label}</Text>
        <View className={styles.itemValue}>
          <Text>{value || "无"}</Text>
          {/* {onClick && (
            <IconFont
              type="icon-you"
              style={{ marginTop: 2 }}
              size={16}
              color="#999"
            />
          )} */}
        </View>
      </View>
    );
  };

  return (
    <Layout
      showTabBar={false}
      navBar={
        <NavBar title="账单详情" back color="#000" background="transparent" />
      }
      bodyClassName={styles.container}
    >
      {loading ? (
        <View className={styles.loading}>加载中...</View>
      ) : recordDetail ? (
        <>
          <View
            className={`${styles.billBox} ${showBill ? styles.billShow : ""}`}
          >
            <View className={styles.billTop}>
              <View className={styles.billHeader}>
                <View className={`${styles.iconWrapper} ${styles[recordDetail.type]}`}>
                  <IconFont type={recordDetail.category.icon!} size={40} />
                </View>
                <Text className={styles.categoryName}>
                  {recordDetail.category.name}
                </Text>
              </View>

              <View className={styles.billContent}>
                <View className={styles.detailItem}>
                  <Text className={styles.itemLabel}>类型</Text>
                  <Text className={styles.itemValue}>
                    {recordDetail.type === "expense" ? "支出" : "收入"}
                  </Text>
                </View>

                <View className={styles.detailItem}>
                  <Text className={styles.itemLabel}>账户</Text>
                  <Text className={styles.itemValue}>
                    {recordDetail?.account?.name || "不计入账户"}
                  </Text>
                </View>

                <View className={styles.detailItem}>
                  <Text className={styles.itemLabel}>金额</Text>
                  <Text className={`${styles.itemValue} ${styles.amount}`}>
                    ¥{recordDetail.amount}
                  </Text>
                </View>

                <View className={styles.detailItem}>
                  <Text className={styles.itemLabel}>时间</Text>
                  <Text className={styles.itemValue}>
                    {dayjs(recordDetail.recordDate).format(
                      "YYYY年MM月DD日 HH:mm"
                    )}
                  </Text>
                </View>

                <View className={styles.detailItem}>
                  <Text className={styles.itemLabel}>账本</Text>
                  <Text className={styles.itemValue}>
                    {recordDetail.book.name || "默认账本"}
                  </Text>
                </View>

                <View className={styles.detailItem}>
                  <Text className={styles.itemLabel}>备注</Text>
                  <Text className={styles.itemValue}>
                    {recordDetail.note || "暂无备注内容~"}
                  </Text>
                </View>
              </View>
            </View>
            {/* <View className={styles.billBottom}></View> */}
          </View>
        </>
      ) : (
        <View className={styles.empty}>记录不存在或已被删除</View>
      )}

      <View
        className={styles.footer}
        style={{
          height: `${safeAreaBottom ? 32 + safeAreaBottom : 42}px`,
        }}
      >
        <View
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={handleDelete}
        >
          删除
        </View>
        <View
          className={`${styles.actionButton} ${styles.editButton}`}
          onClick={handleEdit}
        >
          编辑
        </View>
      </View>
    </Layout>
  );
};

export default RecordDetail;
