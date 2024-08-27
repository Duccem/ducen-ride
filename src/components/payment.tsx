import { PaymentProps } from '@/types/type';
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { fetchAPI } from '../modules/shared/infraestructure/utils/fetch';
import Button from './button';

export const Payment = ({ email, fullName, amount }: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const confirmHandler = async (paymentMethod: any, _: any, intentCreationCallback: any) => {
    const { paymentIntent, customer } = await fetchAPI('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName || email.split('@')[0],
        email,
        amount,
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
        console.log('Payment successful');
        Alert.prompt('Payment successful');
        setSuccess(true);
      }
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: 'usd',
        },
        confirmHandler,
      },
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
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Button title="Confirm ride" disabled={loading} className="" onPress={openPaymentSheet} />
      {success && <Text>Payment successful</Text>}
    </>
  );
};
