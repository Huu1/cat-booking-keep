import { useState, useRef, useEffect } from "react";
import { View, ScrollView, Text } from "@tarojs/components";
import "./index.scss";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const chnMonths = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const Calendar = ({ startDate = new Date() }) => {
  const [isExpanded, setIsExpanded] = useState<any>(false);
  const [dates, setDates] = useState<any[]>([]);
  const scrollRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const today = new Date();

  // 生成日期数据
  useEffect(() => {
    const generateDates = () => {
      const dateArray: any[] = [];
      const current = new Date(startDate);
      for (let i = 0; i < 365; i++) {
        const date = new Date(current);
        dateArray.push({
          date,
          isFirstDay: date.getDate() === 1,
          isNewYear: date.getMonth() === 0 && date.getDate() === 1,
          isToday: date.toDateString() === today.toDateString(),
        });
        current.setDate(current.getDate() + 1);
      }
      return dateArray;
    };
    setDates(generateDates());
  }, [startDate]);

  // 计算起始空白
  const startDay = startDate.getDay();
  const startOffset = startDay === 0 ? 6 : startDay - 1;

  // 滚动到指定行
  const scrollToRow = (index) => {
    if (scrollRef.current) {
      const rowHeight = 80; // 每行高度
      const maxScroll =
        (dates.length / 7) * rowHeight - containerRef.current.clientHeight;
      const targetScroll = Math.min(index * rowHeight, maxScroll);
      scrollRef.current.scrollTo({ top: targetScroll, animated: true });
    }
  };

  // 处理日期点击
  const handleDateClick = (date, index) => {
    console.log("Selected:", date);
    if (isExpanded) {
      setIsExpanded(false);
      const row = Math.floor((index + startOffset) / 7);
      setTimeout(() => scrollToRow(row), 300);
    }
  };

  // 滚动到今日
  const scrollToToday = () => {
    const todayIndex = dates.findIndex((d) => d.isToday);
    if (todayIndex > -1 && scrollRef.current) {
      const row = Math.floor((todayIndex + startOffset) / 7);
      scrollRef.current.scrollIntoView(`row-${row}`);
    }
  };

  return (
    <View
      className={`calendar-container ${isExpanded ? "expanded" : ""}`}
      ref={containerRef}
    >
      {/* 表头 */}
      <View className="calendar-header">
        {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => (
          <Text key={day} className="header-cell">
            {day}
          </Text>
        ))}
      </View>

      {/* 日期主体 */}
      <ScrollView scrollY className="calendar-body" ref={scrollRef} showScrollbar={false}>
        <View className="grid-container">
          {/* 起始空白 */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <View key={`empty-${i}`} className="cell empty" />
          ))}

          {/* 日期格子 */}
          {dates.map((d, i) => (
            <View
              key={i}
              className={`cell ${d.isToday ? "today" : ""}`}
              onClick={() => handleDateClick(d.date, i)}
            >
              {!d.isNewYear && !d.isFirstDay && !d.isNewYear && (
                <Text className="date-number">{d.date.getDate()}</Text>
              )}

              {d.isNewYear && (
                <Text className="month-label">
                  {d.date.getFullYear()} {months[d.date.getMonth()]}
                </Text>
              )}
              {d.isFirstDay && !d.isNewYear && (
                <View className="month-label">
                  <Text>{months[d.date.getMonth()]} </Text>
                  <Text>{chnMonths[d.date.getMonth()]} </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 控制按钮组 */}
      <View className="control-buttons">
        {/* <View className="btn today-btn" onClick={scrollToToday}>
          Today
        </View> */}
        <View
          className="btn expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "▲" : "▼"}
        </View>
      </View>
    </View>
  );
};

export default Calendar;
