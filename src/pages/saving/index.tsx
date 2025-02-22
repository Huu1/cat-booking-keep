import React, { useCallback, useState } from "react";
import NavBar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import { Image, Text, View } from "@tarojs/components";
import Calendar from "./Calendar/Calendar";
import styles from "./index.module.less";

// import { vibrateShort } from "@tarojs/taro";

import planIcon from "@/assets/icons/房子.png";
import { isDateEqual } from "@/utils";

function Index() {
  const [startDate] = useState(new Date("2025/02/13"));

  const [isActive, setIsActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [checkinDates, setCheckinDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 触摸开始触发放大
  const handleTouchStart = () => {
    try {
      // vibrateShort();
    } catch (e) {
      console.log("振动功能不可用");
    }
    setIsActive(true);
  };

  // 触摸结束触发抖动
  const handleTouchEnd = () => {
    setIsActive(false);
    setIsShaking(true);
  };

  // 动画结束回调
  const handleAnimationEnd = () => {
    setIsShaking(false);
  };

  const handleCheckin = () => {
    setCheckinDates((p) => {
      const newlist: any = [...p];
      const isInList = newlist.some((i) => {
        return isDateEqual(i, selectedDate);
      });
      if (isInList) {
        return newlist.filter((i) => {
          return !isDateEqual(i, selectedDate);
        });
      } else {
        newlist.push(selectedDate);
        return newlist;
      }
    });
  };

  const dayIsCheckin = (date) => {
    return checkinDates.some((i) => {
      return isDateEqual(i, date);
    });
  };

  return (
    <PageContainer
      wrapClassName={styles.savingPageWrapBox}
      navBar={
        <NavBar
          back
          title="365天存钱挑战"
          color="#000"
          background={"#f7f7f7"}
        />
      }
    >
      <View className={styles.calendarWrap}>
        <Calendar
          startDate={startDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          checkinDates={checkinDates}
          // setCheckinDates={setCheckinDates}
        />
      </View>
      <View className={styles.content}>
        <View
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onAnimationEnd={handleAnimationEnd}
          onClick={handleCheckin}
          className={`${styles.checkinButton}  ${isActive ? styles.active : ""}
              ${isShaking ? styles.shake : ""} `}
        >
          <View className={styles.planIconWrap}>
            <Image src={planIcon}></Image>
          </View>
          <View className={styles.btnContent}>
            <View>
              <Text>打卡计划名称</Text>
              <Text>坚持每天取得一点点进步</Text>
            </View>
            <View
              className={`${styles.boxCheck} ${
                dayIsCheckin(selectedDate) ? styles.boxSelected : ""
              }
             `}
            ></View>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}

export default Index;
