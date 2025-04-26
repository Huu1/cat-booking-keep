import { Text, View, Swiper, SwiperItem } from "@tarojs/components";
import styles from "./index.module.less";
import cs from "classnames";
import { useState, useEffect } from "react";
import IconFont from "@/components/Iconfont";
import Taro from "@tarojs/taro";
import { Input, Button } from "@nutui/nutui-react-taro";

const AmountBox = ({
  value,
  className,
}: {
  value: any;
  className?: string;
}) => {
  const _className = cs(styles.amountBox, className);

  return (
    <View className={_className}>
      <Text>{value.toFixed(2)}</Text>
    </View>
  );
};

const Index = (props) => {
  const { totalIncome = 0, totalExpense = 0, balance = 0 } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 添加预算相关状态
  const [budget, setBudget] = useState(3000);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  
  // 从本地存储加载预算
  useEffect(() => {
    const loadBudget = async () => {
      try {
        const storedBudget = Taro.getStorageSync('monthlyBudget');
        if (storedBudget) {
          setBudget(Number(storedBudget));
        }
      } catch (error) {
        console.error('加载预算失败', error);
      }
    };
    
    loadBudget();
  }, []);
  
  // 保存预算到本地存储
  const saveBudget = (value) => {
    try {
      Taro.setStorageSync('monthlyBudget', value.toString());
      setBudget(Number(value));
      setShowBudgetPopup(false);
      Taro.showToast({
        title: '预算设置成功',
        icon: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('保存预算失败', error);
      Taro.showToast({
        title: '预算设置失败',
        icon: 'error',
        duration: 2000
      });
    }
  };
  
  // 处理预算设置
  const handleBudgetSubmit = () => {
    const budgetValue = Number(newBudget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      Taro.showToast({
        title: '请输入有效金额',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    saveBudget(budgetValue);
  };
  
  // 计算预算使用百分比
  const budgetUsagePercent = Math.min((totalExpense / budget) * 100, 100);
  
  // 计算剩余预算
  const remainingBudget = budget - totalExpense;
  const isOverBudget = remainingBudget < 0;

  // 打开预算设置弹窗
  const openBudgetModal = () => {
    setNewBudget(budget.toString());
    Taro.showModal({
      title: '设置月度预算',
      editable: true,
      placeholderText: '请输入预算金额',
      content: budget.toString(),
      success: function (res) {
        if (res.confirm) {
          const budgetValue = Number(res.content);
          if (isNaN(budgetValue) || budgetValue <= 0) {
            Taro.showToast({
              title: '请输入有效金额',
              icon: 'none',
              duration: 2000
            });
            return;
          }
          saveBudget(budgetValue);
        }
      }
    });
  };

  return (
    <View className={styles.monthStaticWrapper}>
      <Swiper
        className={styles.swiper}
        onChange={(e) => setCurrentIndex(e.detail.current)}
        circular={false}
        previousMargin="8px"
        nextMargin="8px"
        displayMultipleItems={1}
      >
        {/* 第一屏：基本统计 */}
        <SwiperItem>
          <View className={styles.monthStatic}>
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>本月支出</Text>
              <AmountBox
                value={totalExpense}
                className={styles.expenseNumber}
              />
            </View>

            <View className={styles.statRow}>
              <View className={styles.rowStatItem}>
                <Text className={styles.statLabel}>本月收入</Text>
                <AmountBox
                  value={totalIncome}
                  className={styles.incomeNumber}
                />
              </View>

              <View className={styles.rowStatItem}>
                <Text className={styles.statLabel}>本月结余</Text>
                <AmountBox value={balance} className={styles.balanceNumber} />
              </View>
            </View>
          </View>
        </SwiperItem>

        {/* 第二屏：更多统计数据 */}
        <SwiperItem>
          <View className={styles.monthStatic}>
            <View className={styles.budgetPanel}>
              <View className={styles.budgetHeader}>
                <Text className={styles.budgetTitle}>本月预算</Text>
                <View 
                  className={styles.budgetAction}
                  onClick={openBudgetModal}
                >
                  <Text className={styles.budgetActionText}>设置</Text>
                  <IconFont type="icon-arrow-right" size={12} color="#999" />
                </View>
              </View>

              <View className={styles.budgetProgress}>
                <View className={styles.progressBar}>
                  <View
                    className={styles.progressFill}
                    style={{ width: `${budgetUsagePercent}%` }}
                  ></View>
                </View>
                <View className={styles.budgetInfo}>
                  <Text className={styles.budgetUsed}>已用: ¥{totalExpense.toFixed(2)}</Text>
                  <Text className={styles.budgetTotal}>总额: ¥{budget.toLocaleString()}</Text>
                </View>
              </View>

              <View className={styles.budgetTips}>
                {isOverBudget ? (
                  <View className={styles.overBudget}>
                    <IconFont type="icon-warning" size={16} color="#ff6b6b" />
                    <Text className={styles.overBudgetText}>已超出预算 ¥{Math.abs(remainingBudget).toFixed(2)}</Text>
                  </View>
                ) : (
                  <View className={styles.remainBudget}>
                    <IconFont type="icon-smile" size={16} color="#51cf66" />
                    <Text className={styles.remainBudgetText}>剩余预算 ¥{remainingBudget.toFixed(2)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </SwiperItem>
      </Swiper>

      {/* 指示器 */}
      <View className={styles.indicators}>
        <View
          className={`${styles.indicator} ${
            currentIndex === 0 ? styles.active : ""
          }`}
        ></View>
        <View
          className={`${styles.indicator} ${
            currentIndex === 1 ? styles.active : ""
          }`}
        ></View>
      </View>
    </View>
  );
};

export default Index;
