import { useState } from 'react';

import { ArrowDown } from '@taroify/icons';
import { Text, View } from '@tarojs/components';

import { rpx2px } from '@/utils/pixel';

import './index.scss';

interface Option {
  title: string;
  value: string | number;
}

interface CustomDropdownProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export const CustomDropdown = ({
  options,
  value,
  onChange,
  className = '',
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = options.find(opt => opt.value === value);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View className={`custom-dropdown ${className}`}>
      <View className='dropdown-header' onClick={handleToggle}>
        <Text className='dropdown-text'>{currentOption?.title || '请选择'}</Text>
        <ArrowDown className={`dropdown-arrow ${isOpen ? 'open' : ''}`} size={rpx2px(40)} />
      </View>

      <View className={`dropdown-options ${isOpen ? 'open' : ''}`}>
        {options.map(option => (
          <View
            key={option.value}
            className={`dropdown-option ${option.value === value ? 'active' : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            {option.title}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CustomDropdown;
