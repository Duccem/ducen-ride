import { icons } from '@/src/modules/shared/infraestructure/config/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';

const TabIcon = ({ focused, source }: any) => (
  <View className={`flex flex-row justify-center items-center rounded-full ${focused ? 'bg-general-300' : ''}`}>
    <View className={`rounded-full w-8 h-8 items-center justify-center ${focused ? 'bg-black' : ''}`}>
      <Image source={source} tintColor={'white'} resizeMode="contain" className="w-5 h-5" />
    </View>
  </View>
);

const Layout = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0CC25F',
          borderRadius: 50,
          paddingBottom: 0,
          overflow: 'hidden',
          marginHorizontal: 20,
          marginBottom: 20,
          height: 50,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />,
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: 'Rides',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
