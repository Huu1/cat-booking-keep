import * as React from "react";
import CustomEcharts from "@/components/Echarts";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';

// 设置语言为中文
dayjs.locale('zh-cn');
import { TDateType } from "../..";


// 定义收入支出数据类型
type ExpenseIncomeData = {
  name: string;
  expense: number;
  income: number;
  date:string
}[];

const getOption = (data: ExpenseIncomeData = [], title: string, dateType: TDateType) => {
  // 提取日期作为X轴数据
  const xAxisData = data.map(item => item.name);

  // 提取收入和支出数据
  const incomeData = data.map(item => item.income);
  const expenseData = data.map(item => item.expense);

  // 根据数据长度动态设置柱子宽度
  const getBarWidth = (length: number) => {
    if (length <= 7) return 18;
    if (length <= 12) return 10;
    return 4;
  };

  const option = {
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      confine: true,
      backgroundColor: 'rgba(50, 50, 50, 0.8)',
      // borderColor: 'rgba(50, 50, 50, 0.8)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      padding: [8, 10, -10, 10],
      formatter: function(params) {
        const date = data[params[0].dataIndex].date;
        let formattedDate;
        let suffix = '';

        switch(dateType) {
          case 'week':
            formattedDate = dayjs(date).format('MM月DD日');
            suffix = params[0].name;
            break;
          case 'month':
            formattedDate = dayjs(date).format('MM月DD日');
            suffix = dayjs(date).format('dddd'); // 使用 dddd 显示完整的星期名称
            break;
          case 'year':
            formattedDate = dayjs(date).format('YYYY年MM月');
            suffix = params[0].name;
            break;
          case 'range':
            formattedDate = dayjs(date).format('YYYY年MM月DD日');
            suffix = params[0].name;
            break;
          default:
            formattedDate = dayjs(date).format('YYYY年MM月DD日');
            suffix = params[0].name;
        }

        let result = formattedDate + (suffix ? ' ' + suffix : '') + '\n';
        params.forEach(item => {
          const prefix = item.seriesName === '收入' ? '+' : '-';
          result += `${item.seriesName}: ${prefix}¥${item.value.toFixed(2)}\n`;
        });
        return result;
      }
    },
    legend: {
      data: ['收入', '支出'],
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '20%',
      top: '5%',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 10,
        color: '#999',
      }
    },
    yAxis: {
      type: 'value',
      show: false,
      max: function(value) {
        return Math.max(value.max * 1.2, 100);
      }
    },
    series: [
      // 收入柱
      {
        name: '收入',
        type: 'bar',
        barWidth: getBarWidth(xAxisData.length),
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(91, 174, 160, 0.09)',
          borderRadius: [4, 4, 0, 0]
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: '#76da91'},
              {offset: 1, color: '#2bae67'}
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        data: incomeData,
        z: 2,
        label: {
          show: false,
          position: 'top',
          formatter: function(params) {
            // 当值为0时不显示标签
            return params.value > 0 ? '+¥'+ Math.round(params.value) : '';
          },
          fontSize: 10,
          color: '#2bae67',
          distance: 4
        }
      },
      // 支出柱
      {
        name: '支出',
        type: 'bar',
        barWidth: getBarWidth(xAxisData.length),
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(91, 174, 160, 0.09)',
          borderRadius: [4, 4, 0, 0]
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {offset: 0, color: '#f88b98'},
              {offset: 1, color: '#f35b69'}
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        data: expenseData,
        z: 2,
        label: {
          show: false,
          position: 'top',
          formatter: function(params) {
            const date = data[params[0].dataIndex].name;
            const formattedDate = dayjs(date).format('YYYY年MM月DD日');
            let result = formattedDate + '\n';
            params.forEach(item => {
              const prefix = item.seriesName === '收入' ? '+' : '-';
              result += `${item.seriesName}: ${prefix}¥${item.value.toFixed(2)}\n`;
            });
            return result;
          },
          fontSize: 10,
          color: '#f35b69',
          distance: 4
        }
      }
    ]
  };

  return option;
};

const Index = ({ data, title, dateType }: { data: ExpenseIncomeData; title: string; dateType: TDateType }) => {
  const [option, setOption] = React.useState(getOption(data, title, dateType));

  React.useEffect(() => {
    setOption(getOption(data, title, dateType));
  }, [data, title, dateType]);

  return <CustomEcharts option={option}  />;
};

export default Index;
