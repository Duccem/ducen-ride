import { RideLayout } from '@/src/components/ride-layout';
import { icons } from '@/src/modules/shared/infraestructure/config/constants';
import { formatTime } from '@/src/modules/shared/infraestructure/utils/date';
import { useDriversStore, useLocationStore } from '@/src/store';
import { Image, Text, View } from 'react-native';

const BookRide = () => {
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriversStore();

  const driverDetails = drivers?.filter((driver) => driver.id === selectedDriver)[0];

  return (
    <RideLayout title="Choose a driver" snapPoints={['65%', '85%']} padding={20}>
      <>
        <Text className="text-xl font-JakartaSemiBold mb-3">Ride Information</Text>

        <View className="flex flex-col w-full items-center justify-center mt-10">
          <Image source={{ uri: driverDetails?.profile_image_url }} className="w-28 h-28 rounded-full" />

          <View className="flex flex-row items-center justify-center mt-5 space-x-2">
            <Text className="text-lg font-JakartaSemiBold">
              {driverDetails?.first_name} {driverDetails?.last_name}
            </Text>

            <View className="flex flex-row items-center space-x-0.5">
              <Image source={icons.star} className="w-5 h-5" resizeMode="contain" />
              <Text className="text-lg font-JakartaRegular">{driverDetails?.rating}</Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Ride Price</Text>
            <Text className="text-lg font-JakartaRegular text-[#0CC25F]">${driverDetails?.price || 12}</Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
            <Text className="text-lg font-JakartaRegular">{formatTime(driverDetails?.time || 5)}</Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full py-3">
            <Text className="text-lg font-JakartaRegular">Car Seats</Text>
            <Text className="text-lg font-JakartaRegular">{driverDetails?.car_seats}</Text>
          </View>
        </View>

        <View className="flex flex-col w-full items-start justify-center mt-5">
          <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
            <Image source={icons.to} className="w-6 h-6" />
            <Text className="text-lg font-JakartaRegular ml-2">{userAddress}</Text>
          </View>

          <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
            <Image source={icons.point} className="w-6 h-6" />
            <Text className="text-lg font-JakartaRegular ml-2">{destinationAddress}</Text>
          </View>
        </View>
      </>
    </RideLayout>
  );
};

export default BookRide;
