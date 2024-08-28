import { RideCard } from '@/src/components/rider-card';
import { images } from '@/src/modules/shared/infraestructure/config/constants';
import { useFetch } from '@/src/modules/shared/infraestructure/utils/fetch';
import { Ride } from '@/types/type';
import { useUser } from '@clerk/clerk-expo';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Rides = () => {
  const { user } = useUser();
  const { data: recentRides, loading } = useFetch<Ride[]>(`/api/ride/${user?.id}`);
  return (
    <SafeAreaView>
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
            <Text className="text-2xl font-JakartaBold mt-5 mb-3">All rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;
