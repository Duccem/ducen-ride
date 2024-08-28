import { Driver, MarkerData } from '@/types/type';

const directionsAPI = process.env.EXPO_PUBLIC_HERE_KEY;

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      id: driver.driver_id,
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return;

  try {
    const responseToDestination = await fetch(
      `https://routematching.hereapi.com/v8/calculateroute.json?apiKey=${directionsAPI}&waypoint0=geo!${userLatitude},${userLongitude}&waypoint1=geo!${destinationLatitude},${destinationLongitude}&mode=fastest;car;traffic:disabled&legAttributes=shape`
    );
    const dataToDestination = await responseToDestination.json();
    const timeToDestination = dataToDestination.response.route[0].summary.travelTime;
    const timesPromises = markers.map(async (marker) => {
      const user_driver_url = `https://routematching.hereapi.com/v8/calculateroute.json?apiKey=${directionsAPI}&waypoint0=geo!${marker.latitude},${marker.longitude}&waypoint1=geo!${userLatitude},${userLongitude}&mode=fastest;car;traffic:disabled&legAttributes=shape`;
      const responseToUser = await fetch(user_driver_url);
      const dataToUser = await responseToUser.json();
      const timeToUser = dataToUser.response.route[0].summary.travelTime; // Time in seconds

      const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
      const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error('Error calculating driver times:', error);
  }
};

export const getRoute = async ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  try {
    const response = await fetch(
      `https://routematching.hereapi.com/v8/calculateroute.json?apiKey=${directionsAPI}&waypoint0=geo!${userLatitude},${userLongitude}&waypoint1=geo!${destinationLatitude},${destinationLongitude}&mode=fastest;car;traffic:disabled&legAttributes=shape`
    );
    const data = await response.json();
    const shape = data.response.route[0].shape;
    const route = [];
    for (let i = 0; i < shape.length; i += 2) {
      route.push({ latitude: shape[i], longitude: shape[i + 1] });
    }
    return route;
  } catch (error) {
    console.error('Error getting route:', error);
    return [];
  }
};

// service to calculate the route
//https://routematching.hereapi.com/v8/calculateroute.json?apiKey=IOQhiqlMjUSuNmK_k4ojmKgU1r0RS5HYRoj6CiL50rs&waypoint0=geo!10.9899634,-63.821346&waypoint1=geo!10.9963177,-63.812314&mode=fastest;car;traffic:disabled&legAttributes=shape
