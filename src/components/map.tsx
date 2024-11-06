/* eslint-disable react-hooks/exhaustive-deps */
import { Driver, MarkerData } from '@/types/type';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Polyline } from 'react-native-maps';
import { icons } from '../modules/shared/infraestructure/config/constants';
import { useFetch } from '../modules/shared/infraestructure/utils/fetch';
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
  getRoute,
} from '../modules/shared/infraestructure/utils/map';
import { useDriversStore, useLocationStore } from '../store';

export const Map = ({ hasPermissions }: { hasPermissions?: boolean }) => {
  const { data: drivers, loading, error } = useFetch<Driver[]>('/api/driver');
  const { userLatitude, userLongitude, destinationLongitude, destinationLatitude } = useLocationStore();
  const region = calculateRegion({ userLatitude, userLongitude, destinationLongitude, destinationLatitude });
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const { selectedDriver, setDrivers } = useDriversStore();
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);
  useEffect(() => {
    setDrivers(drivers as unknown as MarkerData[]);
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        destinationLatitude,
        destinationLongitude,
        userLatitude,
        userLongitude,
      }).then((newDrivers) => {
        setDrivers(newDrivers as MarkerData[]);
      });

      getRoute({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((newRoute) => {
        setRoute(newRoute);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading) {
    return (
      <View className="flex justify-center items-center w-full">
        <ActivityIndicator size={'small'} color={'#000'}></ActivityIndicator>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-center items-center w-full">
        <Text>Error</Text>
      </View>
    );
  }

  if (!hasPermissions) {
    return (
      <View className="w-full h-full 8 justify-center items-center bg-black/40">
        <Text className="text-center">Please enable location permissions</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
      region={region}
      style={{ borderRadius: 40 }}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
        />
      ))}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            title="Destination"
            image={icons.pin}
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
          />
          <Polyline coordinates={route} strokeColor="#0CC25F" strokeWidth={3} />
        </>
      )}
    </MapView>
  );
};
