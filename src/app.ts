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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoic3VwZXJhZG1pbiIsInJvbGVzIjpbIui2hee6p-euoeeQhuWRmCJdLCJpYXQiOjE3NDIzMDIyODksImV4cCI6MTc0MjkwNzA4OX0.iagzu_sxCBrmjVSp2gxnqCI_7d1H4Q4kQA9dbuR--Gc"
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
