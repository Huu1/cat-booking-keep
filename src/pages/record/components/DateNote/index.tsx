import React, { memo, useState } from "react";
import { View, Input } from "@tarojs/components";
import styles from "./index.module.less";

interface DateNoteProps {
  note: string;
  onNoteChange: (value: string) => void;
  // date: string;
  // onDateChange: (value: string) => void;
}

const DateNote: React.FC<DateNoteProps> = ({ note, onNoteChange }) => {
  // 优化Input的onInput回调，避免每次渲染都创建新函数
  const handleInput = (e) => {
    onNoteChange(e.detail.value);
  };


  return (
    <View className={styles.dateNoteSection}>
      <Input
        className={styles.noteInput}
        placeholder="点击填写备注"
        value={note}
        onInput={handleInput}
        placeholderStyle="color:#c0c0c0"
      />
    </View>
  );
};

// 使用memo包装组件，避免不必要的重渲染
export default memo(DateNote);
