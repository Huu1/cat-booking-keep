import * as React from "react";
import CustomEcharts from "@/components/Echarts";
import dayjs from "dayjs";
import { TDateType } from "..";

// 定义资产趋势数据类型
type AssetTrendsData = {
  date: string;
  name: string;
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
}[];

const getOption = (data: AssetTrendsData = [], title: string ,dateType:TDateType) => {

  // 处理数据
  const xAxisData = data.map(item => item.name);
  const totalAssetsData = data.map(item => item.totalAssets);
  const totalLiabilitiesData = data.map(item => item.totalLiabilities);
  const netAssetsData = data.map(item => item.netAssets);

  const option = {
    legend: {
      bottom: "0%",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function(params) {
        const date = data[params[0].dataIndex].date;
        let formattedDate;
        let suffix = '';

        switch(dateType) {
          case 'week':
            formattedDate = dayjs(date).format('MM月DD日');
            suffix = ' ' + params[0].name;
            break;
          case 'month':
            formattedDate = dayjs(date).format('MM月DD日');
            suffix = ' ' + dayjs(date).format('ddd'); // 显示周几
            break;
          case 'year':
            formattedDate = dayjs(date).format('YYYY年MM月');
            suffix = ' ' + params[0].name;
            break;
          default:
            formattedDate = dayjs(date).format('YYYY年MM月DD日');
            suffix = ' ' + params[0].name;
        }

        let result = formattedDate + suffix + '\n';
        params.forEach(item => {
          result += item.seriesName + ': ¥' + item.value.toFixed(2) + '\n';
        });
        return result;
      },
      confine: true, // 确保tooltip始终在可视区域内
      backgroundColor: 'rgba(50, 50, 50, 0.8)',
      // borderColor: 'rgba(50, 50, 50, 0.8)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      padding: [8, 10, -10, 10], // 上、右、下、左的内边距，减小了下边距
      extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); border-radius: 4px;'
    },
    grid: {
      top: "10%",
      left: "15%",
      right: "4%",
      bottom: "25%",
      containLabel: false,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: "#333",
          },
          interval: function(index, value) {
            // 根据数据量动态调整显示间隔
            if (xAxisData.length <= 7) {
              return true; // 数据量少时全部显示
            } else if (xAxisData.length <= 14) {
              return index % 2 === 0; // 数据量中等时显示偶数索引
            } else {
              return index % 3 === 0; // 数据量大时每隔两个显示一个
            }
          }
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#E9E9E9",
          },
        },
        axisLine: {
          lineStyle: {
            color: "#D9D9D9",
          },
        },
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          textStyle: {
            color: "#666",
          },
          formatter: function(value) {
            return (value / 10000).toFixed(1) + 'w';
          }
        },
        nameTextStyle: {
          color: "#666",
          fontSize: 12,
          lineHeight: 40,
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#E9E9E9",
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "总资产",
        type: "line",
        smooth: true,
        showSymbol: false, // 移除小圆点
        lineStyle: {
          width: 1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {offset: 0, color: '#FFD700'}, // 金黄色
              {offset: 1, color: '#FFAA00'} // 橙黄色
            ]
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(255, 215, 0, 0.4)'}, // 金黄色半透明
              {offset: 0.8, color: 'rgba(255, 215, 0, 0.05)'} // 几乎透明的金黄色
            ]
          },
          opacity: 0.8
        },
        data: totalAssetsData,
      },
      {
        name: "净资产",
        type: "line",
        smooth: true,
        showSymbol: false, // 移除小圆点
        symbolSize: 6,
        emphasis: {
          scale: true,
          focus: 'series'
        },
        lineStyle: {
          width: 1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {offset: 0, color: '#1677FF'},
              {offset: 1, color: '#4096FF'}
            ]
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(22, 119, 255, 0.3)'},
              {offset: 0.8, color: 'rgba(22, 119, 255, 0.05)'}
            ]
          },
          opacity: 0.6
        },
        data: netAssetsData,
      },
      {
        name: "总负债",
        type: "line",
        smooth: true,
        showSymbol: false, // 移除小圆点
        symbolSize: 6,
        emphasis: {
          scale: true,
          focus: 'series'
        },
        lineStyle: {
          width: 1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {offset: 0, color: '#FF4D4F'},
              {offset: 1, color: '#FF7A7A'}
            ]
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: 'rgba(255, 77, 79, 0.3)'},
              {offset: 0.8, color: 'rgba(255, 77, 79, 0.05)'}
            ]
          },
          opacity: 0.6
        },
        data: totalLiabilitiesData,
      },
    ],
  };

  return option;
};

const Index = ({ data, title, dateType }: { data: AssetTrendsData; title: string; dateType: TDateType }) => {
  const [option, setOption] = React.useState(getOption(data, title, dateType));

  React.useEffect(() => {
    setOption(getOption(data, title, dateType));
  }, [data, title, dateType]);
  return <CustomEcharts option={option} />;
};

export default Index;
