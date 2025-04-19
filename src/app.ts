import { useDidShow, useDidHide } from "@tarojs/taro";

// 全局样式
import "./app.scss";
import { useAppStore } from "./store";

function App(props) {
  const { getUserInfo } = useAppStore();

  // 对应 onShow
  useDidShow(() => {
    getUserInfo();
  });

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
