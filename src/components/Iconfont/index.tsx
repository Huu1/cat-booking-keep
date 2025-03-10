import React from 'react';
import { Text } from '@tarojs/components';
import './iconfont.less';

interface IconFontProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  color?: string;
  onClick?: () => void;
}

const IconFont: React.FC<IconFontProps> = ({
  type,
  className = '',
  style = {},
  size,
  color,
  onClick
}) => {
  const iconStyle: React.CSSProperties = {
    ...style
  };

  if (size) {
    iconStyle.fontSize = typeof size === 'number' ? `${size}px` : size;
  }

  if (color) {
    iconStyle.color = color;
  }

  return (
    <Text
      className={`iconfont ${type} ${className}`}
      style={iconStyle}
      onClick={onClick}
    />
  );
};

export default IconFont;
