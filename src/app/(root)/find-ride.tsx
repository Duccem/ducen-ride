import Button from '@/src/components/button';
import { GoogleTextInput } from '@/src/components/google-text-input';
import { RideLayout } from '@/src/components/ride-layout';
import { icons } from '@/src/modules/shared/infraestructure/config/constants';
import { useLocationStore } from '@/src/store';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

const FindRide = () => {
  const { userAddress, setUserLocation, destinationAddress, setDestinationLocation } = useLocationStore();
  return (
    <RideLayout title="Ride" snapPoints={['50%', '85%']}>
      <View className="my-1">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
        <GoogleTextInput
          icon={icons.target}
          handlePress={(location) => {
            setUserLocation(location);
          }}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100 p-0"
          textInputBackgroundColor="bg-[#F5F5F5]"
        />
      </View>
      <View className="my-1">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
        <GoogleTextInput
          icon={icons.map}
          handlePress={(location) => {
            setDestinationLocation(location);
          }}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100 p-0"
          textInputBackgroundColor="bg-[#F5F5F5]"
        />
      </View>
      <Button
        title="Find now"
        onPress={() => {
          router.push('/(root)/confirm-ride');
        }}
      />
    </RideLayout>
  );
};

export default FindRide;
