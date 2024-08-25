import Button from '@/src/components/button';
import Input from '@/src/components/input';
import OAuth from '@/src/components/OAuth';
import { icons, images } from '@/src/modules/shared/infraestructure/config/constants';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, form.email, form.password]);
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[150px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[150px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-[-13px] left-5">Welcome 👋</Text>
        </View>
        <View className="p-5">
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
          <Button title="Sign In" onPress={() => onSignInPress} className="mt-6"></Button>
          <OAuth></OAuth>
          <Link href={'/(auth)/sign-up'} className="text-lg text-center text-general-200 mt-10">
            <Text>You don`t have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
