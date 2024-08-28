import { GoogleTextInput } from '@/src/components/google-text-input';
import { Map } from '@/src/components/map';
import { RideCard } from '@/src/components/rider-card';
import { icons, images } from '@/src/modules/shared/infraestructure/config/constants';
import { useFetch } from '@/src/modules/shared/infraestructure/utils/fetch';
import { useLocationStore } from '@/src/store';
import { Ride } from '@/types/type';
import { useUser } from '@clerk/clerk-expo';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Home = () => {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermissions, setHasPermissions] = useState(false);
  const { data: recentRides, loading } = useFetch<Ride[]>(`/api/ride/${user?.id}`);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasPermissions(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
      setHasPermissions(true);
    };

    requestLocationPermission();
  }, []);

  const handleDestinationPress = (location: any) => {
    setDestinationLocation(location);
    router.push('/(root)/find-ride');
  };

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        className="px-5"
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100, minHeight: '100%' }}
        ListEmptyComponent={() => (
          <View className="flex flex-col justify-center items-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5 max-w-full">
              <Text className=" capitalize text-2xl font-JakartaBold max-w-[90%]">
                Welcome {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
              </Text>
            </View>
            <GoogleTextInput icon={icons.search} containerStyle="" handlePress={handleDestinationPress} />
            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">Your current location</Text>
              <View className="flex flex-row items-center bg-transparent h-[300px] rounded-xl">
                <Map hasPermissions={hasPermissions}></Map>
              </View>
            </>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">Recent rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
