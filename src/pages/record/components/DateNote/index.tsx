import React, { memo, useState } from "react";
import { View, Text, Input, Picker } from "@tarojs/components";
import IconFont from "@/components/Iconfont";
import styles from "./index.module.less";
import { DatePicker, PickerOption } from "@nutui/nutui-react-taro";

interface DateNoteProps {
  note: string;
  date: string;
  onNoteChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const DateNote: React.FC<DateNoteProps> = ({
  note,
  date,
  onNoteChange,
  onDateChange,
}) => {
  // 优化Input的onInput回调，避免每次渲染都创建新函数
  const handleInput = (e) => {
    onNoteChange(e.detail.value);
  };

  const [show, setShow] = useState(false);
  // 格式化日期显示
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      // const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}/${day} ${hours}:${minutes}`;
    } catch (e) {
      return dateString;
    }
  };

  const confirm = (values: (string | number)[], options: PickerOption[]) => {
    setShow(false);

    // 从选择器获取年月日时分
    const [year, month, day, hour, minute] = values;

    // 构建格式化的日期字符串 (YYYY-MM-DD HH:MM)
    const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

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
    <View className={styles.dateNoteSection}>
      <View className={styles.dateWrapper}>
        <View className={styles.timeBox} onClick={() => setShow(true)}>
          <IconFont type="icon-shijian" size={16} />
          <Text className={styles.dateLabel}>{formatDateDisplay(date)}</Text>
        </View>

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
      </View>
      <Input
        className={styles.noteInput}
        placeholder="点击填写备注"
        value={note}
        onInput={handleInput}
        placeholderStyle="color:#c1c1c1"
      />
    </View>
  );
};

// 使用memo包装组件，避免不必要的重渲染
export default memo(DateNote);
