import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {Button, TextInput, Title, useTheme} from 'react-native-paper';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Page({navigation, route}: Props) {
  const [email, setEmail] = useState('rohanjindal739@yopmail.com');
  const [password, setPassword] = useState('Easy@123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const theme = useTheme();

  async function handleLogin() {
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);

    try {
      setLoading(true);
      const response = await axios.post('/api/login', form);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        <Title style={[styles.title, {color: theme.colors.primary}]}>
          Welcome Back!
        </Title>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Toggle password visibility
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'} // Toggle eye icon
              onPress={() => setShowPassword(!showPassword)} // Toggle state
            />
          }
        />
        <Button
          disabled={loading}
          loading={loading}
          onPress={handleLogin}
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}>
          Login
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
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
