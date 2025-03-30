import Echarts, { EChartOption } from "taro-react-echarts";
// @ts-ignore
import * as echarts from "./echarts.min";
import { useRef, useEffect, useState } from "react";

const Index = ({ option }: { option: EChartOption }) => {
  const echartsRef = useRef<any>(null);

  const [ready, setReady] = useState(false);

  // 添加 useEffect 监听 option 变化
  useEffect(() => {
    if (echartsRef.current) {
      echartsRef.current.setOption(option);
    }
  }, [option, ready]);

  return (
    <Echarts
      style={{
        width: "100%",
        height: "100%",
      }}
      onChartReady={(e) => {
        echartsRef.current = e;
        setReady(true);
      }}
      echarts={echarts}
      option={option}
    />
  );
};

export default Index;
