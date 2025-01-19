import React, {useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {Button, Text, useTheme} from 'react-native-paper';
import {RootStackParamList} from '../../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useSessionStore from '../store/useSessionStore';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function Otp({navigation, route}: Props) {
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {setSession, setUser, setToken} = useSessionStore(state => state);
  const theme = useTheme();

  async function handleLogin() {
    if (!otpInput || otpInput.length !== 6) {
      setError('Please enter a valid OTP');
      return;
    }

    if (otpInput !== route.params.otp) {
      setError('OTP does not match');
      return;
    }

    try {
      setLoading(true);
      setSession(route.params.session);
      setUser(route.params.user);
      setToken(route.params.token);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${route.params.token}`;

      navigation.reset({index: 0, routes: [{name: 'DrawerScreen'}]});
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: theme.colors.primary}]}>
          Enter OTP
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.text}]}>
          We have sent an OTP to your registered email.
        </Text>
        <OtpInput
          numberOfDigits={6}
          onTextChange={text => {
            setOtpInput(text);
            setError(''); // Clear error when user types
          }}
          theme={{
            pinCodeContainerStyle: styles.otpBox,
            pinCodeTextStyle: {color: theme.colors.text, fontSize: 20},
            focusStickStyle: {backgroundColor: theme.colors.primary},
            focusedPinCodeContainerStyle: {
              borderColor: theme.colors.primary,
            },
          }}
        />
        {error && (
          <Text style={[styles.errorText, {color: theme.colors.error}]}>
            {error}
          </Text>
        )}
        <Button
          disabled={otpInput.length !== 6 || loading}
          loading={loading}
          onPress={handleLogin}
          mode="contained"
          style={styles.submitButton}
          labelStyle={styles.buttonLabel}>
          Verify OTP
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
