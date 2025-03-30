import React, { useEffect } from "react";
import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
// 全局样式
import "./app.scss";
import { useAppStore } from "./store";

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    Taro.setStorageSync(
      "token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsInJvbGVzIjpbIui2hee6p-euoeeQhuWRmCJdLCJpYXQiOjE3NDMyMTAyMzAsImV4cCI6MTc0MzgxNTAzMH0.-_BmDyX38XjiKor5J_HkhwtH6duTezzvLN7liUT1Sbc"
    );
  }, []);

  const { fetchDefaultBook, isDefaultBookLoaded } = useAppStore();

  useEffect(() => {
    if (!isDefaultBookLoaded) {
      fetchDefaultBook();
    }
  }, []);

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
