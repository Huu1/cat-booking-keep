import React, { useState, useCallback } from "react";
import { View } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

interface NumberKeyboardProps {
  amount: string;
  setAmount: (amount: any) => void;
  recordType: string;
  onDone: (result: string) => void;
  onAgain: () => void;
}

const NumberKeyboard: React.FC<NumberKeyboardProps> = ({
  amount,
  setAmount,
  recordType,
  onDone,
  onAgain,
}) => {
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
  const checkExpression = (value: string) => {
    const match = value.match(/^([\d.]+)([+\-×÷])([\d.]*)$/);
    if (match) {
      setExpression({
        firstNum: match[1],
        operator: match[2],
        secondNum: match[3] || "",
      });
    }
  };

  const canCalculate = () => {
    return expression.firstNum && expression.operator && expression.secondNum;
  };

  const calculate = () => {
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
  };

  // 处理按键按下效果
  const handleKeyDown = useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  // 处理按键释放效果
  const handleKeyUp = useCallback(() => {
    setActiveKey(null);
  }, []);

  // 处理按键
  const handleKeyPress = (key) => {
    if (key === "delete") {
      setAmount((prev) => {
        const newAmount = prev.slice(0, -1);
        checkExpression(newAmount);
        return newAmount;
      });
    } else if (key === "done") {
      if (canCalculate()) {
        const result = calculate();
        setAmount(result.toString());
        setExpression({ firstNum: "", operator: "", secondNum: "" });
      } else {
        onDone(amount);
      }
    } else if (["+", "-", "×", "÷"].includes(key)) {
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
        setAmount((prev) => prev + key);
        setExpression((prev) => ({
          ...prev,
          firstNum: amount,
          operator: key,
        }));
      }
    } else if (key === "again") {
      setAmount("");
      setExpression({ firstNum: "", operator: "", secondNum: "" });
      onAgain();
    } else {
      // 添加检查小数位数的辅助函数
      const checkDecimalLimit = (value: string): boolean => {
        const numbers = value.split(/[+\-×÷]/);
        return numbers.some((num) => {
          const dotIndex = num.indexOf(".");
          return dotIndex !== -1 && num.length - dotIndex > 3;
        });
      };
      // 处理数字和小数点输入
      if (key === "." && amount.includes(".")) return; // 防止多个小数点
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
    }
  };

  // 处理操作符切换
  const handleOperatorToggle = (type: "plus" | "minus") => {
    let newOperator = "";

    if (type === "plus") {
      newOperator = currentOperator.plus ? "×" : "+";
    } else {
      newOperator = currentOperator.minus ? "÷" : "-";
    }

    if (canCalculate()) {
      // 如果可以计算，先计算结果
      const result = calculate();
      setAmount(result.toString() + newOperator);
      setExpression({
        firstNum: result.toString(),
        operator: newOperator,
        secondNum: "",
      });
    } else if (amount) {
      // 如果有数字但不满足计算条件
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
      current: newOperator,
    }));
  };

  return (
    <View className={styles.keyboardSection}>
      <View className={styles.keyboardRow}>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "1" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("1")}
          onTouchStart={() => handleKeyDown("1")}
          onTouchEnd={handleKeyUp}
        >
          1
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "2" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("2")}
          onTouchStart={() => handleKeyDown("2")}
          onTouchEnd={handleKeyUp}
        >
          2
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "3" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("3")}
          onTouchStart={() => handleKeyDown("3")}
          onTouchEnd={handleKeyUp}
        >
          3
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "delete" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("delete")}
          onTouchStart={() => handleKeyDown("delete")}
          onTouchEnd={handleKeyUp}
        >
          <IconFont type="icon-shanchu1" size={20} />
        </View>
      </View>
      <View className={styles.keyboardRow}>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "4" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("4")}
          onTouchStart={() => handleKeyDown("4")}
          onTouchEnd={handleKeyUp}
        >
          4
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "5" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("5")}
          onTouchStart={() => handleKeyDown("5")}
          onTouchEnd={handleKeyUp}
        >
          5
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "6" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("6")}
          onTouchStart={() => handleKeyDown("6")}
          onTouchEnd={handleKeyUp}
        >
          6
        </View>
        <View
          className={`${styles.keyboardKey} ${styles.operatorKey} ${activeKey === "plus" ? styles.activeKey : ""}`}
          onClick={() => handleOperatorToggle("plus")}
          onTouchStart={() => handleKeyDown("plus")}
          onTouchEnd={handleKeyUp}
        >
          {currentOperator.plus ? `+ ×` : `× +`}
        </View>
      </View>
      <View className={styles.keyboardRow}>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "7" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("7")}
          onTouchStart={() => handleKeyDown("7")}
          onTouchEnd={handleKeyUp}
        >
          7
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "8" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("8")}
          onTouchStart={() => handleKeyDown("8")}
          onTouchEnd={handleKeyUp}
        >
          8
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "9" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("9")}
          onTouchStart={() => handleKeyDown("9")}
          onTouchEnd={handleKeyUp}
        >
          9
        </View>
        <View
          className={`${styles.keyboardKey} ${styles.operatorKey} ${activeKey === "minus" ? styles.activeKey : ""}`}
          onClick={() => handleOperatorToggle("minus")}
          onTouchStart={() => handleKeyDown("minus")}
          onTouchEnd={handleKeyUp}
        >
          {currentOperator.minus ? `- ÷` : `÷ -`}
        </View>
      </View>
      <View className={styles.keyboardRow}>
        <View 
          className={`${styles.keyboardKey} ${styles.saveKey} ${activeKey === "again" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("again")}
          onTouchStart={() => handleKeyDown("again")}
          onTouchEnd={handleKeyUp}
        >
          保存再记
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "0" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("0")}
          onTouchStart={() => handleKeyDown("0")}
          onTouchEnd={handleKeyUp}
        >
          0
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "." ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress(".")}
          onTouchStart={() => handleKeyDown(".")}
          onTouchEnd={handleKeyUp}
        >
          .
        </View>
        <View 
          className={`${styles.keyboardKey} ${activeKey === "done" ? styles.activeKey : ""}`}
          onClick={() => handleKeyPress("done")}
          onTouchStart={() => handleKeyDown("done")}
          onTouchEnd={handleKeyUp}
        >
          <View className={`${styles.doneButton} ${styles[`${recordType}Button`]}`}>
            {canCalculate() ? "=" : "完成"}
          </View>
        </View>
      </View>
    </View>
  );
};

export default NumberKeyboard;