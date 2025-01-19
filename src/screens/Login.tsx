import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Page({navigation, route}: Props) {
  const [email, setEmail] = useState('rohanjindal739@yopmail.com');
  const [password, setPassword] = useState('Easy@123');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);

    try {
      setLoading(true);
      const response = await axios.post('/api/login', form);
      // console.log({
      //   session: response.data.payspot_session,
      //   otp: response.data.otp,
      //   user: response.data.user,
      //   token: response.data.token,
      // });

      navigation.push('OTP', {
        session: response.data.payspot_session,
        otp: response.data.otp,
        user: response.data.user,
        token: response.data.token,
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="flat"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        disabled={loading}
        loading={loading}
        onPress={handleLogin}
        mode="contained">
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
});
