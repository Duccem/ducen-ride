import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { icons } from '../modules/shared/infraestructure/config/constants';
import { fetchAPI } from '../modules/shared/infraestructure/utils/fetch';
import Button from './button';

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(root)/(tabs)/home', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        if (setActive) {
          await setActive!({ session: createdSessionId });
          if (signUp?.createdUserId) {
            await fetchAPI('/api/user', {
              body: JSON.stringify({
                name: `${signUp.firstName} ${signUp.lastName}`,
                email: signUp.emailAddress,
                clerkId: signUp.createdUserId,
              }),
            });
          }
          router.replace('/(root)/(tabs)/home');
        }
      }
    } catch (err: any) {
      if (err.code === 'session_exists') {
        router.replace('/(root)/(tabs)/home');
        return;
      }
      Alert.alert('Error', 'An error occurred while trying to sign in with Google');
    }
  }, []);
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <Button
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
        IconLeft={() => <Image source={icons.google} className="w-5 h-5 mx-2" resizeMode="contain" />}
      />
    </View>
  );
};

export default OAuth;
