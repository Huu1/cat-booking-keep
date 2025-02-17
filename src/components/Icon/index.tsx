import React, { useEffect } from "react";

// 0配置解决方案：自动扫描assets
// 需搭配Webpack require.context使用
const iconsContext = require.context("@/assets/icons", false, /\.png$/);

const localIcons: Record<string, string> = {};
iconsContext.keys().forEach((key) => {
  const iconName = key.replace("./", "").replace(".png", "");
  localIcons[iconName] = iconsContext(key);
});

export default localIcons; // 或手动维护的icons

// 类型定义
interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: string; // 图标键名
  size?: number | string; // 可选尺寸
}

export const Icon = ({
  name,
  size = "100%",
  className = "",
  ...props
}: IconProps) => {
  // 合并后的样式类
  const iconClass = `icon ${className}`;

  // 获取实际图标路径（优先内存中的缓存）
  const [src, setSrc] = React.useState<string>();

  useEffect(() => {
    setSrc(localIcons[name]);
  }, [name]);

  return (
    <img
      src={src}
      className={iconClass}
      style={{ width: size, height: size }}
      alt={`${name} icon`}
      {...props}
    />
  );
};

// 获取所有图标名称（用于遍历展示）
export const iconNames = Object.keys(localIcons);
