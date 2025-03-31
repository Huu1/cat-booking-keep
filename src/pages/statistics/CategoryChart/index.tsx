import * as React from "react";
import CustomEcharts from "@/components/Echarts";

var colorList = [
  "#73DDFF",
  "#73ACFF",
  "#FDD56A",
  "#FDB36A",
  "#FD866A",
  "#9E87FF",
  "#58D5FF",
];

type TData = {
  name: string;
  value: number;
}[];

// 生成渐变色函数
const generateGradientColors = (count = 50) => {
  const baseColors = [
    { start: '#83bff6', end: '#188df0' }, // 蓝色系
    { start: '#76da91', end: '#2bae67' }, // 绿色系
    { start: '#f8d598', end: '#f7b83d' }, // 黄色系
    { start: '#f88b98', end: '#f35b69' }, // 红色系
    { start: '#a78cdc', end: '#7a43bc' }, // 紫色系
    { start: '#f9b29c', end: '#f2784b' }, // 橙色系
    { start: '#9fe6e0', end: '#32c5b8' }, // 青色系
    { start: '#e2a8f2', end: '#a44bda' }  // 粉色系
  ];

  const gradientColors = [];
  const cssGradients:string[] = [];

  // 为每个基础颜色生成多个渐变
  for (let i = 0; i < count; i++) {
    const baseColorIndex = i % baseColors.length;
    const { start, end } = baseColors[baseColorIndex];

    // 根据索引调整渐变角度，使相邻的扇区颜色有所区别
    const angle = (45 + (i * 30) % 360);

    // 为ECharts生成渐变对象
    // @ts-ignore
    gradientColors.push({
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        { offset: 0, color: start },
        { offset: 1, color: end }
      ],
      global: false,
      angle
    });

    // 为CSS生成渐变字符串
    //@ts-ignore
    cssGradients.push(`linear-gradient(${angle}deg, ${start}, ${end})`);
  }

  return {
    echarts: gradientColors,
    css: cssGradients
  };
};

// 生成50个渐变色
const gradientColors = generateGradientColors(50);

// 导出CSS渐变色，以便其他组件使用
export const cssGradients = gradientColors.css;

const getOption = (data: TData = [], title: string='0') => {
  // 数据预处理：设置最小和最大阈值
  const processData = (rawData: TData) => {
    if (!rawData || rawData.length === 0) return [];

    // 计算总和
    const total = rawData.reduce((sum, item) => sum + item.value, 0);

    // 设置最小和最大百分比阈值
    const minPercentage = 0.03; // 最小占比3%
    const maxPercentage = 0.30; // 最大占比30%

    return rawData.map(item => {
      const percentage = item.value / total;

      // 如果百分比小于最小阈值，提升到最小阈值
      if (percentage < minPercentage && percentage > 0) {
        return {
          ...item,
          // 保留原始值用于tooltip显示
          originalValue: item.value,
          // 调整值用于图表显示
          value: total * minPercentage
        };
      }

      // 如果百分比大于最大阈值，限制到最大阈值
      if (percentage > maxPercentage) {
        return {
          ...item,
          originalValue: item.value,
          value: total * maxPercentage
        };
      }

      return item;
    });
  };

  // 处理数据
  const processedData = processData(data);

  const option = {
    title: {
      text: title,
      x: "center",
      y: "center",
      textStyle: {
        fontSize: 18,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function(params) {
        // 使用原始值显示tooltip
        const value = params.data.originalValue || params.data.value;
        return `${params.name}: ${value.toFixed(2)}元 (${params.percent}%)`;
      },
      confine: true, // 确保tooltip始终在可视区域内
      backgroundColor: 'rgba(50, 50, 50, 0.8)',
      // borderColor: 'rgba(50, 50, 50, 0.8)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      padding: [8, 10],
      extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); border-radius: 4px;'
    },
    // 添加图例配置
    legend: {
      type: 'scroll', // 可滚动
      orient: 'horizontal', // 水平布局
      bottom: 0, // 放在底部
      itemWidth: 10, // 图例标记的宽度
      itemHeight: 10, // 图例标记的高度
      textStyle: {
        fontSize: 10, // 图例文字大小
        color: '#666'
      },
      pageButtonItemGap: 5, // 翻页按钮与图例项之间的间隔
      pageButtonGap: 10, // 翻页按钮的间隔
      pageIconColor: '#888', // 翻页按钮颜色
      pageIconInactiveColor: '#ccc', // 翻页按钮不激活时的颜色
      pageTextStyle: {
        color: '#666',
        fontSize: 10
      },
      formatter: function(name) {
        // 如果名称太长，截断并添加省略号
        return name.length > 6 ? name.slice(0, 6) + '...' : name;
      }
    },
    series: [
      {
        type: "pie",
        center: ["50%", "50%"],
        radius: ["35%", "65%"],
        clockwise: true,
        avoidLabelOverlap: false,
        hoverOffset: 15,
        minAngle: 3,

        itemStyle: {
          normal: {
            // 使用渐变色
            color: function (params) {
              return gradientColors.echarts[params.dataIndex % gradientColors.echarts.length];
            },
            borderWidth: 2, // 增加边框宽度
            borderColor: '#fff', // 白色边框
            // 圆角效果
            borderRadius: 4
          },
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{a|{b}\n{d}%}",
          rich: {
            a: {
              padding: [-30, 5, -20, 5],
              lineHeight: 16,
              fontSize: 10,
              align: "center",
            },
          },
          alignTo: 'labelLine', // 修改为labelLine
          edgeDistance: '10%',
          distanceToLabelLine: 3,
          bleedMargin: 5, // 添加出血边距
        },
        labelLine: {
          show: true, // 确保显示
          length: 15, // 增加第一段长度
          length2: 10, // 增加第二段长度
          minTurnAngle: 60, // 最小转角
          maxSurfaceAngle: 60, // 最大表面角度
          lineStyle: {
            width: 0.8,
            type: 'solid',
          },
          smooth: 0.1
        },
        labelLayout: {
          hideOverlap: false // 不隐藏重叠的标签
        },
        data: processedData,
      },
    ],
  };

  return option;
};

const Index = ({ data, title }: { data: TData; title: string }) => {
  const [option, setOption] = React.useState(getOption(data, title));

  React.useEffect(() => {
    setOption(getOption(data, title));
  }, [data, title]);
  return <CustomEcharts option={option} />;
};

export default Index;
