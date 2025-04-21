import React, { useState, useCallback, memo } from "react";
import { View ,Text} from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { DatePicker, PickerOption } from "@nutui/nutui-react-taro";
import dayjs from "dayjs";

// 在 NumberKeyboard 组件中添加 disabled 属性
// 修改接口定义，添加 isEditMode 属性
interface NumberKeyboardProps {
  amount: string;
  setAmount: (amount: string) => void;
  recordType: string;
  onDone: (result: string) => void;
  onAgain: (result: string, callback: () => void) => void;
  disabled?: boolean; // 添加禁用属性
  isEditMode?: boolean; // 添加编辑模式属性
  date: string;
  onDateChange: (value: string) => void;
}

const NumberKeyboard = ({
  amount,
  setAmount,
  recordType,
  onDone,
  onAgain,
  disabled = false, // 默认为 false
  isEditMode = false, // 默认为 false
  onDateChange,
  date
}: NumberKeyboardProps) => {
  // 将表达式状态和操作符状态移到键盘组件内部
  const [expression, setExpression] = useState({
    firstNum: "",
    operator: "",
    secondNum: "",
  });

  const [currentOperator, setCurrentOperator] = useState({
    plus: true, // true 表示显示 +，false 表示显示 ×
    minus: true, // true 表示显示 -，false 表示显示 ÷
  });

  // 添加按键激活状态
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // 辅助函数
  const checkExpression = useCallback((value: string) => {
    const match = value.match(/^([\d.]+)([+\-×÷])([\d.]*)$/);
    if (match) {
      setExpression({
        firstNum: match[1],
        operator: match[2],
        secondNum: match[3] || "",
      });
    }
  }, []);

  const canCalculate = useCallback(() => {
    return expression.firstNum && expression.operator && expression.secondNum;
  }, [expression]);

  const calculate = useCallback(() => {
    const num1 = parseFloat(expression.firstNum);
    const num2 = parseFloat(expression.secondNum);
    let result = 0;

    switch (expression.operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "×":
        result = num1 * num2;
        break;
      case "÷":
        result = num2 !== 0 ? num1 / num2 : 0;
        break;
    }

    // 保留两位小数
    return Number(result.toFixed(2));
  }, [expression]);

  // 处理按键按下效果
  const handleKeyDown = useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  // 处理按键释放效果
  const handleKeyUp = useCallback(() => {
    setActiveKey(null);
  }, []);

  // 处理删除操作
  const handleDelete = useCallback(() => {
    // @ts-ignore
    setAmount((prev) => {
      const newAmount = prev.slice(0, -1);
      checkExpression(newAmount);
      return newAmount;
    });
  }, [setAmount, checkExpression]);

  // 处理完成操作
  const handleDone = useCallback(() => {
    if (canCalculate()) {
      const result = calculate();
      setAmount(result.toString());
      setExpression({ firstNum: "", operator: "", secondNum: "" });
    } else {
      // 处理末尾有操作符的情况
      let finalAmount = amount;
      if (["+", "-", "×", "÷"].includes(amount.charAt(amount.length - 1))) {
        finalAmount = amount.slice(0, -1);
        setAmount(finalAmount);
      }
      onDone(finalAmount);
    }
  }, [amount, canCalculate, calculate, onDone, setAmount]);

  // 处理保存再记操作
  const handleAgain = useCallback(() => {
    // 处理末尾有操作符的情况
    let finalAmount = amount;
    if (["+", "-", "×", "÷"].includes(amount.charAt(amount.length - 1))) {
      finalAmount = amount.slice(0, -1);
    } else if (canCalculate()) {
      // 如果可以计算，先计算结果
      finalAmount = calculate().toString();
    }

    onAgain(finalAmount, () => {
      setExpression({ firstNum: "", operator: "", secondNum: "" });
    });
  }, [amount, canCalculate, calculate, onAgain]);

  // 处理操作符输入
  const handleOperatorInput = useCallback(
    (key: string) => {
      if (canCalculate()) {
        // 如果已经可以计算，先计算结果
        const result = calculate();
        setAmount(result.toString() + key);
        setExpression({
          firstNum: result.toString(),
          operator: key,
          secondNum: "",
        });
      } else if (amount) {
        // 检查是否已有操作符
        const lastChar = amount.charAt(amount.length - 1);
        if (["+", "-", "×", "÷"].includes(lastChar)) {
          // 替换已有操作符
          setAmount(amount.slice(0, -1) + key);
          setExpression((prev) => ({
            ...prev,
            operator: key,
          }));
        } else {
          // 添加新操作符
          setAmount(amount + key);
          setExpression({
            firstNum: amount,
            operator: key,
            secondNum: "",
          });
        }
      }
    },
    [amount, canCalculate, calculate, setAmount]
  );

  // 处理数字和小数点输入
  // 添加 isFirstInput 状态
  const [isFirstInput, setIsFirstInput] = useState(true);

  const handleNumberInput = useCallback(
    (key: string) => {
      const checkDecimalLimit = (value: string): boolean => {
        const numbers = value.split(/[+\-×÷]/);
        return numbers.some((num) => {
          const dotIndex = num.indexOf(".");
          return dotIndex !== -1 && num.length - dotIndex > 3;
        });
      };

      // 编辑模式下的第一次数字输入时重置金额
      if (isEditMode && isFirstInput && amount && !isNaN(Number(key))) {
        setAmount(key);
        setExpression({ firstNum: "", operator: "", secondNum: "" });
        setIsFirstInput(false);
        return;
      }

      // 处理数字和小数点输入
      if (key === ".") {
        // 分割表达式，检查当前操作的数字部分
        const parts = amount.split(/([+\-×÷])/);
        const currentPart = parts[parts.length - 1];
        // 如果当前数字部分已经包含小数点，则不允许再添加
        if (currentPart.includes(".")) return;
      }
      if (key === "0" && amount === "0") return; // 防止多个前导零

      const newAmount = amount === "0" && key !== "." ? key : amount + key;

      // 检查是否有任何数字部分超过两位小数
      if (key !== "." && checkDecimalLimit(newAmount)) {
        return;
      }

      if (amount === "0" && key !== ".") {
        setAmount(key);
      } else {
        setAmount(newAmount);
        checkExpression(newAmount);
      }
    },
    [amount, setAmount, checkExpression, isEditMode, isFirstInput]
  );

  // 处理按键
  const handleKeyPress = useCallback(
    (key) => {
      if (key === "delete") {
        handleDelete();
      } else if (key === "done") {
        handleDone();
      } else if (["+", "-", "×", "÷"].includes(key)) {
        handleOperatorInput(key);
      } else if (key === "again") {
        handleAgain();
      } else {
        // 处理数字和小数点
        handleNumberInput(key);
      }
    },
    [
      handleDelete,
      handleDone,
      handleOperatorInput,
      handleAgain,
      handleNumberInput,
    ]
  );

  // 处理操作符切换
  const handleOperatorToggle = useCallback(
    (type: "plus" | "minus") => {
      let newOperator = "";

      if (type === "plus") {
        // 修改为先使用 + 再使用 ×
        newOperator = currentOperator.plus ? "+" : "×";
      } else {
        // 修改为先使用 - 再使用 ÷
        newOperator = currentOperator.minus ? "-" : "÷";
      }

      if (canCalculate()) {
        // 如果已经可以计算，先计算结果
        const result = calculate();
        setAmount(result.toString() + newOperator);
        setExpression({
          firstNum: result.toString(),
          operator: newOperator,
          secondNum: "",
        });
      } else if (amount) {
        // 如果有数字但不满足计算条件
        // @ts-ignore
        setAmount((prev) => {
          const lastChar = prev[prev.length - 1];
          if (["+", "-", "×", "÷"].includes(lastChar)) {
            return prev.slice(0, -1) + newOperator;
          }
          return prev + newOperator;
        });
        setExpression((prev) => ({
          ...prev,
          firstNum: amount,
          operator: newOperator,
          secondNum: "",
        }));
      }

      setCurrentOperator((prev) => ({
        ...prev,
        [type]: !prev[type],
      }));
    },
    [amount, canCalculate, calculate, setAmount]
  );

  // 使用数组渲染数字按键
  const renderNumberKey = useCallback(
    (num: string) => (
      <View
        key={num}
        className={`${styles.keyboardKey} ${
          activeKey === num ? styles.activeKey : ""
        }`}
        onClick={() => handleKeyPress(num)}
        onTouchStart={() => handleKeyDown(num)}
        onTouchEnd={handleKeyUp}
      >
        {num}
      </View>
    ),
    [activeKey, handleKeyPress, handleKeyDown, handleKeyUp]
  );

  const [show, setShow] = useState(false);

  const confirm = (values: (string | number)[], options: PickerOption[]) => {
    setShow(false);

    // 从选择器获取年月日时分
    const [year, month, day, hour, minute] = values;

    // 构建格式化的日期字符串 (YYYY-MM-DD HH:MM)
    const formattedDate = `${year}/${String(month).padStart(2, "0")}/${String(
      day
    ).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;

    // 调用父组件的回调函数
    onDateChange(formattedDate);
  };

  const formatter = (type: string, option: PickerOption) => {
    switch (type) {
      case "year":
        option.text += "";
        break;
      case "month":
        option.text += "月";
        break;
      case "day":
        option.text += "日";
        break;
      case "hour":
        option.text += "时";
        break;
      case "minute":
        option.text += "分";
        break;
      default:
        option.text += "";
    }
    return option;
  };

  return (
    <View className={styles.keyboardSection}>
      <DatePicker
        title="时间选择"
        type="datetime"
        startDate={new Date(2020, 0, 1)}
        endDate={new Date()}
        visible={show}
        defaultValue={date ? new Date(date) : new Date()}
        formatter={formatter}
        onClose={() => setShow(false)}
        onConfirm={(options, values) => confirm(values, options)}
      />

      <View className={styles.keyboardRow}>
        {renderNumberKey("1")}
        {renderNumberKey("2")}
        {renderNumberKey("3")}
        <View
          className={`${styles.keyboardKey} ${styles.dateBtn} ${
            activeKey === "date" ? styles.activeKey : ""
          }`}
          onClick={() => setShow(true)}
          onTouchStart={() => setShow(true)}
          onTouchEnd={handleKeyUp}
        >
          {dayjs(date).year() === dayjs().year() && (
            <IconFont type="icon-rili1" size={22} style={{marginRight:4}} color="#fff" />
          )}
          <Text className={styles.dateText}>
            {(() => {
              const today = dayjs();
              const selectedDate = dayjs(date);

              // 如果是今天
              if (selectedDate.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')) {
                return '今天';
              }

              // 如果是今年
              if (selectedDate.year() === today.year()) {
                return selectedDate.format('MM.DD');
              }

              // 如果不是今年
              return selectedDate.format('YYYY.MM.DD');
            })()}
          </Text>
        </View>
      </View>
      <View className={styles.keyboardRow}>
        {renderNumberKey("4")}
        {renderNumberKey("5")}
        {renderNumberKey("6")}
        <View
          className={`${styles.keyboardKey} ${styles.operatorKey} ${
            activeKey === "plus" ? styles.activeKey : ""
          }`}
          onClick={() => handleOperatorToggle("plus")}
          onTouchStart={() => handleKeyDown("plus")}
          onTouchEnd={handleKeyUp}
        >
          {currentOperator.plus ? `+ ×` : `× +`}
        </View>
      </View>
      <View className={styles.keyboardRow}>
        {renderNumberKey("7")}
        {renderNumberKey("8")}
        {renderNumberKey("9")}
        <View
          className={`${styles.keyboardKey} ${styles.operatorKey} ${
            activeKey === "minus" ? styles.activeKey : ""
          }`}
          onClick={() => handleOperatorToggle("minus")}
          onTouchStart={() => handleKeyDown("minus")}
          onTouchEnd={handleKeyUp}
        >
          {currentOperator.minus ? `- ÷` : `÷ -`}
        </View>
      </View>
      <View className={styles.keyboardRow}>
        {/* <View
          className={`${styles.keyboardKey} ${styles.saveKey} ${
            activeKey === "again" ? styles.activeKey : ""
          } ${disabled ? styles.disabledKey : ""}`}
          onClick={() => handleKeyPress("again")}
          onTouchStart={() => !disabled && handleKeyDown("again")}
          onTouchEnd={handleKeyUp}
        >
          保存再记
        </View> */}
        {renderNumberKey("0")}
        {renderNumberKey(".")}
        <View
          className={`${styles.keyboardKey} ${
            activeKey === "delete" ? styles.activeKey : ""
          }`}
          onClick={() => handleKeyPress("delete")}
          onTouchStart={() => handleKeyDown("delete")}
          onTouchEnd={handleKeyUp}
        >
          <IconFont type="icon-shanchu1" size={20} />
        </View>
        <View
          className={`${styles.keyboardKey} ${
            activeKey === "done" ? styles.activeKey : ""
          } ${disabled ? styles.disabledKey : ""}`}
          onClick={() => handleKeyPress("done")}
          onTouchStart={() => !disabled && handleKeyDown("done")}
          onTouchEnd={handleKeyUp}
        >
          <View
            className={`${styles.doneButton} ${styles[`${recordType}Button`]} ${
              disabled ? styles.disabledButton : ""
            }`}
          >
            {canCalculate() ? "=" : "完成"}
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(NumberKeyboard);
