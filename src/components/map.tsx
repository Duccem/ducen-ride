/* eslint-disable react-hooks/exhaustive-deps */
import { Driver, MarkerData } from '@/types/type';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { icons } from '../modules/shared/infraestructure/config/constants';
import { useFetch } from '../modules/shared/infraestructure/utils/fetch';
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from '../modules/shared/infraestructure/utils/map';
import { useDriversStore, useLocationStore } from '../store';

export const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>('/api/driver');
  const { userLatitude, userLongitude, destinationLongitude, destinationLatitude } = useLocationStore();
  const region = calculateRegion({ userLatitude, userLongitude, destinationLongitude, destinationLatitude });
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const { selectedDriver, setDrivers } = useDriversStore();
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
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
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
          <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{ latitude: destinationLatitude, longitude: destinationLongitude }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY || ''}
            strokeWidth={3}
            strokeColor="#0286ff"
            optimizeWaypoints={true}
          />
        </>
      )}
    </MapView>
  );
};
