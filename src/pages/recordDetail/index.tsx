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
  const [recordId, setRecordId] = useState<number | null>(null);
  const [recordDetail, setRecordDetail] = useState<TRecordType | null>(null);

  // 获取路由参数
  useEffect(() => {
    const instance = Taro.getCurrentInstance();
    const params = instance?.router?.params || {};
    if (params.id) {
      setRecordId(Number(params.id));
    }
  }, []);

  // 获取记录详情
  const { loading, run: fetchDetail ,refresh} = useRequest(getRecordDetail, {
    manual: true,
    onSuccess: (data) => {
      setRecordDetail(data);
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

    console.log('recordDetail',recordDetail);

    Taro.navigateTo({
      url: `/pages/record/index?id=${recordId}&type=${
        recordDetail.type
      }&amount=${recordDetail.amount}&note=${recordDetail.note || ""}&recordDate=${
        recordDetail.recordDate
      }&bookId=${recordDetail.book.id}&categoryId=${
        recordDetail.category.id
      }&accountId=${recordDetail.account?.id}&images=${recordDetail.images??[]}`,
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
      navBar={<NavBar title="账单详情" back color="#000" background="white" />}
      bodyClassName={styles.container}
    >
      {loading ? (
        <View className={styles.loading}>加载中...</View>
      ) : recordDetail ? (
        <>
          {/* 操作按钮 */}
          <View className={styles.actionButtons}>
            <View className={styles.actionButton} onClick={handleEdit}>
              <IconFont type="icon-bianji" size={24} color="#0086F6" />
              <Text className={styles.actionText} style={{ color: "#0086F6" }}>
                编辑
              </Text>
            </View>
            <View className={styles.actionButton} onClick={handleDelete}>
              <IconFont type="icon-top1" size={24} color="#FF5252" />
              <Text className={styles.actionText} style={{ color: "#FF5252" }}>
                删除
              </Text>
            </View>
            {/* <View className={styles.actionButton} onClick={handleRefund}>
              <IconFont type="icon-tuikuan" size={24} color="#2196F3" />
              <Text className={styles.actionText} style={{ color: "#2196F3" }}>
                退款
              </Text>
            </View>
            <View
              className={styles.actionButton}
              onClick={handleSaveAsTemplate}
            >
              <IconFont type="icon-mti-fuzhi" size={24} color="#FF9800" />
              <Text className={styles.actionText} style={{ color: "#FF9800" }}>
                存为模板
              </Text>
            </View> */}
          </View>

          {/* 详情信息 */}
          <View className={styles.detailCard}>
            {renderDetailItem(
              "类型",
              `(${recordDetail.type === "expense" ? "支出" : "收入"}) ${
                recordDetail.category.name || "未分类"
              }`,
              undefined,
              () => {
                // Taro.navigateTo({ url: `/pages/categories/index?type=${recordDetail.type}` });
              }
            )}

            {renderDetailItem(
              "账本",
              recordDetail.book.name || "默认账本",
              undefined,
              () => {
                // Taro.navigateTo({ url: '/pages/books/index' });
              }
            )}
          </View>

          <View className={styles.detailCard}>
            {renderDetailItem(
              "时间",
              dayjs(recordDetail.recordDate).format("YYYY年MM月DD日 HH:mm"),
              undefined,
              () => {
                // 可以跳转到日期选择页面
              }
            )}

            {renderDetailItem(
              "金额",
              `¥${recordDetail.amount}`,
              undefined,
              () => {
                // 可以跳转到金额编辑页面
              }
            )}

            {renderDetailItem(
              "账户",
              recordDetail?.account?.name || "未选择账户",
              undefined,
              () => {
                // Taro.navigateTo({ url: "/pages/accounts/index" });
              }
            )}
          </View>

          <View className={styles.detailCard}>
            {renderDetailItem(
              "备注",
              recordDetail.note || "无",
              undefined,
              () => {
                // 可以跳转到备注编辑页面
              }
            )}

            {/* {renderDetailItem("标签", recordDetail.tags?.join(', ') || '无', undefined, () => {
              // 可以跳转到标签编辑页面
            })}

            {renderDetailItem("图片", recordDetail.images?.length ? `${recordDetail.images.length}张图片` : '无', undefined, () => {
              // 可以跳转到图片查看页面
            })}

            {renderDetailItem("位置", recordDetail.location || '无', undefined, () => {
              // 可以跳转到位置选择页面
            })} */}
          </View>
        </>
      ) : (
        <View className={styles.empty}>记录不存在或已被删除</View>
      )}

      <SafeArea position="bottom" />
    </Layout>
  );
};

export default RecordDetail;
