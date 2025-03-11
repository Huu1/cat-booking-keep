import React, { useState } from "react";
import { View, Text, ScrollView, Input } from "@tarojs/components";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import useRequest from "@/hooks/useRequest";
import { getCategories } from "./service";

const Index = () => {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState("03/10"); // 默认日期，可以根据实际需求修改
  const [currentOperator, setCurrentOperator] = useState({
    plus: true, // true 表示显示 +，false 表示显示 ×
    minus: true, // true 表示显示 -，false 表示显示 ÷
  });

  const { data: categories = [] } = useRequest(getCategories);

  // 处理数字键盘输入
  // 添加新的状态
  const [expression, setExpression] = useState({
    firstNum: "",
    operator: "",
    secondNum: "",
  });

  // 修改 handleKeyPress 函数
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
        console.log("记账完成", { amount, selectedCategory, note, date });
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
      setSelectedCategory(null);
      setNote("");
      setExpression({ firstNum: "", operator: "", secondNum: "" });
    } else {

        // 添加检查小数位数的辅助函数
        const checkDecimalLimit = (value: string): boolean => {
          const numbers = value.split(/[+\-×÷]/);
          return numbers.some(num => {
            const dotIndex = num.indexOf('.');
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

  // 添加辅助函数
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

  // 选择类别
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

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
    <Layout
      currentTab="home"
      showTabBar={false}
      navBar={<NavBar title="记账" back color="#000" background={"white"} />}
      bodyClassName={styles.recordContainer}
    >
      <ScrollView scrollY className={styles.categoriesScroll}>
        <View className={styles.categoriesGrid}>
          {categories.map((category) => (
            <View
              key={category.id}
              className={`${styles.categoryItem} ${
                selectedCategory?.id === category.id
                  ? styles.selectedCategory
                  : ""
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <View className={styles.categoryIcon}>
                <IconFont type={category.icon} size={24} />
              </View>
              <Text className={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.amountSection}>
        <Text className={styles.currencySymbol}>¥</Text>
        <Text className={styles.amountDisplay}>{amount || "0"}</Text>
      </View>

      <View className={styles.dateNoteSection}>
        <View className={styles.dateWrapper}>
          <Text className={styles.dateLabel}>{date}</Text>
        </View>
        <Input
          className={styles.noteInput}
          placeholder="请输入备注"
          value={note}
          onInput={(e) => setNote(e.detail.value)}
        />
      </View>

      <View className={styles.keyboardSection}>
        <View className={styles.keyboardRow}>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("1")}
          >
            1
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("2")}
          >
            2
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("3")}
          >
            3
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("delete")}
          >
            <IconFont type="icon-delete" size={20} />
          </View>
        </View>
        <View className={styles.keyboardRow}>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("4")}
          >
            4
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("5")}
          >
            5
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("6")}
          >
            6
          </View>
          <View
            className={`${styles.keyboardKey} ${styles.operatorKey}`}
            onClick={() => handleOperatorToggle("plus")}
          >
            {currentOperator.plus ? "+×" : "×+"}
          </View>
        </View>
        <View className={styles.keyboardRow}>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("7")}
          >
            7
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("8")}
          >
            8
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("9")}
          >
            9
          </View>
          <View
            className={`${styles.keyboardKey} ${styles.operatorKey}`}
            onClick={() => handleOperatorToggle("minus")}
          >
            {currentOperator.minus ? "-÷" : "÷-"}
          </View>
        </View>
        <View className={styles.keyboardRow}>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("again")}
          >
            再记
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("0")}
          >
            0
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress(".")}
          >
            .
          </View>
          <View
            className={styles.keyboardKey}
            onClick={() => handleKeyPress("done")}
          >
            <View className={styles.doneButton}>
              {canCalculate() ? "=" : "完成"}
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default Index;
