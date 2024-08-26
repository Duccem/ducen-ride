import { GoogleInputProps } from '@/types/type';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDebounce } from '../hooks/useDebounce';
import { useLocationStore } from '../store';
import Input from './input';
export const GoogleTextInput = ({
  icon,
  containerStyle,
  handlePress,
  textInputBackgroundColor,
  initialLocation,
}: GoogleInputProps) => {
  const { userLatitude, userLongitude } = useLocationStore();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    handleSearch();
  }, [debouncedValue]);

  const handleSearch = async () => {
    if (debouncedValue) {
      const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?apiKey=${process.env
        .EXPO_PUBLIC_HERE_KEY!}&q=${debouncedValue}&in=circle:${userLatitude},${userLongitude};r=100000`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    }
  };
  return (
    <View className={`flex justify-center relative p-3 z-50 rounded-xl mb-5 ${containerStyle}`}>
      <Input
        className="w-full bg-white border-none shadow-none"
        containerStyle="bg-white border-none shadow-none"
        onChangeText={(value) => setSearchValue(value)}
        icon={icon}
        placeholder="Search for a location"
      ></Input>
    </View>
  );
};
