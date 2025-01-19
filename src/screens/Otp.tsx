import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {Button, Text} from 'react-native-paper';
import {RootStackParamList} from '../../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useSessionStore from '../store/useSessionStore';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function Otp({navigation, route}: Props) {
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const {setSession, setUser, setToken} = useSessionStore(state => state);

  async function handleLogin() {
    if (!otpInput) return;

    if (otpInput !== route.params.otp) {
      setError('OTP does not match');
      return;
    }

    setSession(route.params.session);
    setUser(route.params.user);
    setToken(route.params.token);

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${route.params.token}`;

    navigation.reset({index: 0, routes: [{name: 'DrawerScreen'}]});
  }

  return (
    <View style={styles.container}>
      <OtpInput
        numberOfDigits={6}
        onTextChange={text => setOtpInput(text)}
        theme={{
          pinCodeTextStyle: {color: 'black', fontSize: 19},
        }}
      />
      {error && <Text style={{color: 'red', marginTop: 10}}>{error}</Text>}
      <Button
        disabled={otpInput.length !== 6}
        onPress={handleLogin}
        mode="contained"
        style={styles.submitButton}>
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  submitButton: {
    marginTop: 16,
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },
});
