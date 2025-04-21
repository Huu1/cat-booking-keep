import React, { useState, useRef, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import dayjs from "dayjs";
import {
  Image,
  ImagePreview,
  Space,
  Swipe,
  SwipeInstance,
} from "@nutui/nutui-react-taro";

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  icon: string | null;
}

interface Record {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: string;
  amount: string;
  note: string;
  recordDate: string;
  category: Category;
  account: Account;
  images: string[];
}

interface RecordCardProps {
  date: string;
  weekday: string;
  income: number;
  expense: number;
  records: Record[];
  handleClick: (recordId: number) => void;
  onDelete?: (recordId: number) => void; // 添加删除回调
  currentSwiperOpenId?: any; // 添加删除回调
  setCurrentSwiperOpenId?: (recordId: number) => void;
}

const RecordCard: React.FC<RecordCardProps> = ({
  date,
  weekday,
  income,
  expense,
  records,
  handleClick,
  onDelete,
  setCurrentSwiperOpenId,
  currentSwiperOpenId
}) => {
  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // 添加状态控制展开收起
  const [isExpanded, setIsExpanded] = useState(true);


  return (
    <View className={styles.recordCard}>
      <View
        className={styles.cardHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <View className={styles.dateInfo}>
          <Text className={styles.date}>{formatDate(date)}</Text>
          <Text className={styles.weekday}>{weekday}</Text>
        </View>
        <View className={styles.amountInfo}>
          {income ? (
            <View className={styles.incomeItem}>
              <Text className={styles.label}>收</Text>
              <Text className={`${styles.value} ${styles.incomeValue}`}>
                ¥{income.toFixed(2)}
              </Text>
            </View>
          ) : (
            <></>
          )}

          {expense ? (
            <View className={styles.expenseItem}>
              <Text className={styles.label}>支</Text>
              <Text className={`${styles.value} ${styles.expenseValue}`}>
                ¥{expense.toFixed(2)}
              </Text>
            </View>
          ) : (
            <></>
          )}

          <View
            className={`${styles.expandButton} ${
              isExpanded ? styles.expanded : ""
            }`}
          >
            <IconFont type="icon-right" size={13} />
          </View>
        </View>
      </View>

      {/* 根据展开状态控制记录列表显示 */}
      {isExpanded && (
        <View className={styles.recordList}>
          {records.map((record) => (
            <SwiperItemBox
              key={record.id}
              record={record}
              setCurrentId={setCurrentSwiperOpenId}
              currentId={currentSwiperOpenId}
              handleClick={handleClick}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const SwiperItemBox = ({
  record,
  handleClick,
  onDelete,
  currentId,
  setCurrentId,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const ref = useRef<any>(null);

  // 处理删除
  const handleDelete = (recordId: number) => {
    onDelete?.(recordId);
  };

  const isOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpenRef.current) {
      return;
    }
    // 只有当其他项被打开时，当前打开的项才需要关闭
    if (currentId && currentId !== record.id) {
      ref.current?.close();
      isOpenRef.current = false;
    }

  }, [currentId, record.id]);

  // 处理滑动打开事件
  const handleSwipeOpen = (recordId: number) => {
    setCurrentId(recordId);
    isOpenRef.current = true;
  };

  // 处理滑动关闭事件
  const handleSwipeClose = () => {
    if (currentId === record.id) {
      setCurrentId(null);
    }
    isOpenRef.current = false;
  };
  return (
    <Swipe
      key={record.id}
      ref={ref}
      rightAction={
        <View
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(record.id);
          }}
        >
          删除
        </View>
      }
      onOpen={() => handleSwipeOpen(record.id)}
      onClose={handleSwipeClose}
    >
      <View
        className={styles.recordItem}
        onClick={() => handleClick(record.id)}
      >
        <View
          className={`${styles.iconWrapper}  ${
            record.type === "expense" ? styles.expenseIcon : styles.incomeIcon
          }
        ${record.images?.length > 0 ? styles.hasImage : ""}
      `}
        >
          <IconFont type={record.category.icon} size={32} />
        </View>
        <View className={styles.recordInfo}>
          <Text className={styles.category}>{record.category.name}</Text>
          <Text>
            {record.recordDate && (
              <Text className={styles.subCategory}>
                {dayjs(record.recordDate).format("HH:mm")}
              </Text>
            )}
            {record.note && (
              <Text className={styles.subCategory}>{` · ${record.note}`}</Text>
            )}
          </Text>
          {record.images?.length ? (
            <Space>
              {record.images?.map((i) => {
                return (
                  <Image
                    key={i}
                    src={i}
                    mode="scaleToFill"
                    width={36}
                    height={36}
                    radius={6}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(true);
                    }}
                  />
                );
              })}
            </Space>
          ) : (
            <></>
          )}
        </View>
        <ImagePreview
          images={record.images?.map((i) => ({ src: i }))}
          visible={showPreview}
          onClose={() => setShowPreview(false)}
        />
        <Text
          className={`${styles.amount} ${
            record.type === "expense" ? styles.expense : styles.income
          }
           ${record.images?.length > 0 ? styles.hasImage : ""}
      `}
        >
          {record.type === "expense" ? "-" : "+"}
          {parseFloat(record.amount).toFixed(2)}
        </Text>
      </View>
    </Swipe>
  );
};

export default RecordCard;
