import { PaymentProps } from '@/types/type';
import { useAuth } from '@clerk/clerk-expo';
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import { Result } from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentMethod';
import { IntentCreationCallbackParams } from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { images } from '../modules/shared/infraestructure/config/constants';
import { fetchAPI } from '../modules/shared/infraestructure/utils/fetch';
import { useLocationStore } from '../store';
import Button from './button';

export const Payment = ({ email, fullName, amount, rideTime, driverId }: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { userAddress, userLatitude, userLongitude, destinationAddress, destinationLatitude, destinationLongitude } =
    useLocationStore();
  const { userId } = useAuth();

  const confirmHandler = async (
    paymentMethod: Result,
    _: boolean,
    intentCreationCallback: (result: IntentCreationCallbackParams) => void
  ) => {
    const { paymentIntent, customer } = await fetchAPI('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName || email.split('@')[0],
        email,
        amount: parseInt(`${amount}`) * 100,
        paymentMethodId: paymentMethod.id,
      }),
    });
    if (paymentIntent.client_secret) {
      const { result } = await fetchAPI('/api/payment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_intent_id: paymentIntent.id,
          customer_id: customer,
        }),
      });
      if (result.client_secret) {
        await fetchAPI('/api/ride', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin_address: userAddress,
            destination_address: destinationAddress,
            origin_latitude: userLatitude,
            origin_longitude: userLongitude,
            destination_latitude: destinationLatitude,
            destination_longitude: destinationLongitude,
            ride_time: rideTime.toFixed(0),
            fare_price: parseInt(`${amount}`) * 100,
            payment_status: 'paid',
            driver_id: driverId,
            user_id: userId,
          }),
        });
        intentCreationCallback({
          clientSecret: paymentIntent.client_secret,
        });
        setSuccess(true);
      }
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Ducen ride, Inc.',
      intentConfiguration: {
        mode: {
          amount: parseInt(`${amount}`) * 100,
          currencyCode: 'USD',
        },
        confirmHandler,
      },
      returnURL: 'myapp://book-ride',
    });
    if (!error) {
      setLoading(true);
    } else {
      console.log(error);
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error && error.code !== PaymentSheetError.Canceled) {
      Alert.alert(error.message);
    } else {
      if (error?.code === PaymentSheetError.Canceled) {
        setSuccess(false);
      } else setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Button title="Confirm ride" disabled={loading} className="" onPress={openPaymentSheet} />
      <ReactNativeModal isVisible={success} onBackdropPress={() => setSuccess(false)}>
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image className="w-28 h-28 mt-5" source={images.check} />
          <Text className="text-2xl font-JakartaBold mt-5 text-center">Ride booked!</Text>
          <Text className="text-md text-general-200 font-JakartaMedium text-center mt-3">
            Thank you for booking. your reservation has been placed. please proceed with your trip.
          </Text>
          <Button
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push('/(root)/(tabs)/home');
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};
