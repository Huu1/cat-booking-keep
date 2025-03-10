import React, { useState } from "react";
import { View, Text, ScrollView, Input } from "@tarojs/components";
import Layout from "@/components/Layout";
import NavBar from "@/components/Navbar";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";

const Index = () => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState('03/10'); // 默认日期，可以根据实际需求修改

  // 消费类别数据
  const categories = [
    { id: 1, name: '餐饮', icon: 'icon-food' },
    { id: 2, name: '休闲娱乐', icon: 'icon-entertainment' },
    { id: 3, name: '购物', icon: 'icon-shopping' },
    { id: 4, name: '穿搭美容', icon: 'icon-beauty' },
    { id: 5, name: '水果零食', icon: 'icon-fruit' },
    { id: 6, name: '交通', icon: 'icon-transport' },
    { id: 7, name: '生活日用', icon: 'icon-daily' },
    { id: 8, name: '人情社交', icon: 'icon-social' },
    { id: 9, name: '宠物', icon: 'icon-pet' },
    { id: 10, name: '养娃', icon: 'icon-baby' },
    { id: 11, name: '运动', icon: 'icon-sports' },
    { id: 12, name: '生活服务', icon: 'icon-service' },
    { id: 13, name: '买菜', icon: 'icon-vegetables' },
    { id: 14, name: '住房', icon: 'icon-house' },
    { id: 15, name: '爱车', icon: 'icon-car' },
    { id: 16, name: '发红包', icon: 'icon-redpacket' },
    { id: 17, name: '转账', icon: 'icon-transfer' },
    { id: 18, name: '教育的', icon: 'icon-education' },
    { id: 19, name: '网络虚拟', icon: 'icon-virtual' },
    { id: 20, name: '烟酒', icon: 'icon-wine' },
    { id: 21, name: '医疗保健', icon: 'icon-medical' },
    { id: 22, name: '金融保险', icon: 'icon-insurance' },
    { id: 23, name: '家居家电', icon: 'icon-furniture' },
    { id: 24, name: '酒店旅行', icon: 'icon-travel' },
    { id: 25, name: '公益', icon: 'icon-charity' },
  ];

  // 处理数字键盘输入
  const handleKeyPress = (key) => {
    if (key === 'delete') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === 'done') {
      // 处理完成记账逻辑
      console.log('记账完成', { amount, selectedCategory, note, date });
    } else if (key === 'again') {
      // 再记一笔
      setAmount('');
      setSelectedCategory(null);
      setNote('');
    } else {
      // 处理数字和小数点输入
      if (key === '.' && amount.includes('.')) return; // 防止多个小数点
      if (key === '0' && amount === '0') return; // 防止多个前导零
      if (amount === '0' && key !== '.') setAmount(key); // 替换单个零
      else setAmount(prev => prev + key);
    }
  };

  // 选择类别
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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
          {categories.map(category => (
            <View 
              key={category.id} 
              className={`${styles.categoryItem} ${selectedCategory?.id === category.id ? styles.selectedCategory : ''}`}
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
        <Text className={styles.amountDisplay}>{amount || '0'}</Text>
      </View>

      <View className={styles.dateNoteSection}>
        <View className={styles.dateWrapper}>
          <Text className={styles.dateLabel}>{date}</Text>
        </View>
        <Input 
          className={styles.noteInput} 
          placeholder="请输入备注" 
          value={note}
          onInput={e => setNote(e.detail.value)}
        />
      </View>

      <View className={styles.keyboardSection}>
        <View className={styles.keyboardRow}>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('1')}>1</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('2')}>2</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('3')}>3</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('delete')}>
            <IconFont type="icon-delete" size={20} />
          </View>
        </View>
        <View className={styles.keyboardRow}>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('4')}>4</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('5')}>5</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('6')}>6</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('+')}>+</View>
        </View>
        <View className={styles.keyboardRow}>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('7')}>7</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('8')}>8</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('9')}>9</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('-')}>-</View>
        </View>
        <View className={styles.keyboardRow}>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('again')}>再记</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('0')}>0</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('.')}>.</View>
          <View className={styles.keyboardKey} onClick={() => handleKeyPress('done')}>
            <View className={styles.doneButton}>完成</View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default Index;
