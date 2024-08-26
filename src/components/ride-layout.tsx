import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { icons } from '../modules/shared/infraestructure/config/constants';
import { Map } from './map';

export const RideLayout = ({
  children,
  title,
  snapPoints,
  padding = 20,
}: {
  snapPoints: string[];
  children: React.ReactNode;
  title: string;
  padding?: number;
}) => {
  const sheet = React.useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <View className="flex flex-col h-full bg-blue-500">
          <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="h-10 w-10 bg-white rounded-full justify-center items-center">
                <Image source={icons.backArrow} resizeMode="contain" className="w-6 h-6" />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-JakartaSemiBold ml-5">{title || 'Go back'}</Text>
          </View>
          <Map />
        </View>
        <BottomSheet ref={sheet} snapPoints={snapPoints} index={0} keyboardBehavior="extend">
          <BottomSheetView style={{ flex: 1, paddingTop: 20, paddingHorizontal: padding }}>{children}</BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};
