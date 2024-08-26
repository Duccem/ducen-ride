import Button from '@/src/components/button';
import { DriverCard } from '@/src/components/driver-card';
import { RideLayout } from '@/src/components/ride-layout';
import { useDriversStore } from '@/src/store';
import { router } from 'expo-router';
import { FlatList, View } from 'react-native';
const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriversStore();
  return (
    <RideLayout title="Choose a driver" snapPoints={['65%', '85%']} padding={0}>
      <FlatList
        data={drivers}
        renderItem={(item) => (
          <DriverCard item={item.item} selected={selectedDriver!} setSelected={() => setSelectedDriver(item.item.id)} />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <Button
              title="Select rider"
              onPress={() => {
                router.push('/(root)/book-ride');
              }}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
