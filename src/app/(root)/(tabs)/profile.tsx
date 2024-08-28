import Input from '@/src/components/input';
import { icons } from '@/src/modules/shared/infraestructure/config/constants';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
    router.push('/(auth)/sign-in');
  };
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-2xl font-JakartaBold my-5">My profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
          <TouchableOpacity
            className="flex flex-row px-5 justify-center items-center  h-10 rounded-full bg-white my-5"
            onPress={handleSignOut}
          >
            <Text>Sign Out</Text>
            <Image source={icons.out} className="h-4 w-4 ml-2"></Image>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <Input
              label="First name"
              placeholder={user?.firstName || 'Not Found'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <Input
              label="Last name"
              placeholder={user?.lastName || 'Not Found'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <Input
              label="Email"
              placeholder={user?.primaryEmailAddress?.emailAddress || 'Not Found'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <Input
              label="Phone"
              placeholder={user?.primaryPhoneNumber?.phoneNumber || 'Not Found'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
