import { useEffect, useMemo, useState } from 'react';

import { Search } from '@taroify/core';
import { View } from '@tarojs/components';

import { NavigationBar } from '@/components';
import { CustomDropdown } from '@/components/CustomDropdown';
import { Rank } from '@/constants';
import { useRankBarStore } from '@/store/rankBar';

import { WaterfallList } from './components/WaterfallList';

import './index.scss';

export default function Decks() {
  const { currentType, sortedDataTypes } = useRankBarStore();
  const [searchValue, setSearchValue] = useState<string>('');
  const [localRankType, setLocalRankType] = useState<Rank>(currentType);

  useEffect(() => {
    setLocalRankType(currentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(
    () =>
      sortedDataTypes.map(item => ({
        title: item.name,
        value: item.id,
      })),
    [sortedDataTypes]
  );

  return (
    <View className='decks-page'>
      <NavigationBar title='推荐卡组' showLogo />
      <View className='search-wrapper'>
        <Search
          className='search'
          shape='rounded'
          placeholder='搜索卡组'
          clearable={false}
          value={searchValue}
          onChange={e => {
            setSearchValue(e.detail.value);
          }}
        />
        <CustomDropdown
          className='custom-dropdown'
          options={options}
          value={localRankType}
          onChange={value => {
            if (value) {
              setLocalRankType(value as Rank);
            }
          }}
        />
      </View>
      <View className='waterfall-wrapper'>
        <WaterfallList searchTerm={searchValue} rankType={localRankType} />
      </View>
    </View>
  );
}
