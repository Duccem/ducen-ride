import { GoogleInputProps } from '@/types/type';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  const [locations, setLocations] = useState<any>([]);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedValue) {
        const url = `https://discover.search.hereapi.com/v1/discover?apiKey=${process.env
          .EXPO_PUBLIC_HERE_KEY!}&q=${debouncedValue}&in=circle:${userLatitude},${userLongitude};r=100000`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setLocations(data.items);
      }
    };
    handleSearch();
  }, [debouncedValue]);

  return (
    <View className={`flex justify-center relative p-3 z-50 rounded-xl mb-5 ${containerStyle}`}>
      <Input
        className={`w-full bg-white border-none shadow-none ${textInputBackgroundColor}`}
        containerStyle={`bg-white border-none shadow-none rounded-2xl ${textInputBackgroundColor}`}
        onChangeText={(value) => setSearchValue(value)}
        icon={icon}
        placeholder={initialLocation || 'Where you want to go?'}
      ></Input>
      {debouncedValue && locations.length > 0 && (
        <ScrollView className="absolute top-[90px] left-0 right-0 bg-white px-3 rounded-lg">
          {locations.slice(0, 4).map((location: any) => (
            <TouchableOpacity
              key={location.title}
              className="p-3 border-b border-gray-100"
              onPress={() =>
                handlePress({
                  latitude: location.position.lat,
                  longitude: location.position.lng,
                  address: location.address.label,
                })
              }
            >
              <Text>{location.title}</Text>
              <Text className="text-[8px] text-gray-500">{location.address.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
