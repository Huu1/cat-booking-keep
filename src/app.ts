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

  return props.children;
}

export default App;
