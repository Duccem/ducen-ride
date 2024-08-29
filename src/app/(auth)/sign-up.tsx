import Button from '@/src/components/button';
import Input from '@/src/components/input';
import OAuth from '@/src/components/OAuth';
import { icons, images } from '@/src/modules/shared/infraestructure/config/constants';
import { fetchAPI } from '@/src/modules/shared/infraestructure/utils/fetch';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [verification, setVerification] = useState({
    code: '',
    state: 'default',
    error: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setVerification({ ...verification, state: 'pending' });
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === 'complete') {
        await fetchAPI('api/user', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: 'success' });
      } else {
        setVerification({ ...verification, state: 'fail', error: 'Verification failed' });
      }
    } catch (err: any) {
      setVerification({ ...verification, state: 'failed', error: err.errors[0].longMessage });
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[150px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[150px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute   left-5">
            Create your account
          </Text>
        </View>
        <View className="p-5">
          <Input
            label={'Name'}
            placeholder="Enter your name"
            icon={icons.person}
            labelStyle="text-black"
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <Input
            label={'Email'}
            placeholder="Enter your email"
            icon={icons.email}
            labelStyle="text-black"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <Input
            label={'Password'}
            placeholder="Enter your password"
            icon={icons.lock}
            labelStyle="text-black"
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <Button title="Sign Up" onPress={onSignUpPress} className="mt-6"></Button>
          <OAuth></OAuth>
          <Link href={'/(auth)/sign-in'} className="text-lg text-center text-general-200 mt-10">
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === 'pending'}
          onModalHide={() => {
            if (verification.state === 'success') {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">Verification</Text>
            <Text className="font-Jakarta mb-5">We've sent a verification code to your email.</Text>
            <Input
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(value) => setVerification({ ...verification, code: value })}
            />
            {verification.error && <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>}
            <Button title="Verify Email" onPress={onPressVerify} className="mt-5 bg-success-500" />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl main-h-[300px]">
            <Image className="w-[110px] h-[110px] mx-auto my-5" source={images.check} />
            <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your email
            </Text>
            <Button
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/(root)/(tabs)/home');
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
