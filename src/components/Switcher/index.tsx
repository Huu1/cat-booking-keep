import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.less';

interface Option {
  value: string;
  label: string;
}

interface SwitcherProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Switcher: React.FC<SwitcherProps> = ({ 
  options = [], 
  value, 
  onChange,
  className = ''
}) => {
  const [activeValue, setActiveValue] = useState<string>(value || (options[0]?.value || ''));
  
  useEffect(() => {
    if (value !== undefined && value !== activeValue) {
      setActiveValue(value);
    }
  }, [value]);

  const handleClick = (option: Option) => {
    setActiveValue(option.value);
    onChange && onChange(option.value);
  };

  return (
    <View className={`${styles.switcher} ${className}`}>
      {options.map((option, index) => (
        <View
          key={option.value}
          className={`${styles.switcherItem} ${activeValue === option.value ? styles.active : ''}`}
          onClick={() => handleClick(option)}
        >
          {option.label}
          {index < options.length - 1 && <View className={styles.divider}></View>}
        </View>
      ))}
    </View>
  );
};

export default Switcher;