import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {View, NativeModules, Alert, StyleSheet} from 'react-native';
import {Button, TextInput, Text} from 'react-native-paper';
import {sign} from 'react-native-pure-jwt';
import {useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../utils/data';

const {EkycModule} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'KYCAuth'>;

const jwtSecret =
  'UFMwMDM5MjFhZTUzZTU5M2VlZTU1MTViZWVkYTVkMmEyZjk4NjdjNDE2ODQxMjk0MzY=';
const partner = 'PS003921';
const merchantCode = 'prod0004';

const axiosInstance = axios.create({
  baseURL: 'https://api.paysprint.in',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default function KYCAuth({navigation, route}: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidPhone = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

  async function onSubmit() {
    if (!isValidPhone) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);

    if (!EkycModule) {
      setError('KYC Module is not available');
      setLoading(false);
      return;
    }

    const currentTimestamp = Date.now();
    const payload = {
      timestamp: currentTimestamp,
      partnerId: partner,
      reqid: currentTimestamp,
    };

    try {
      const jwtToken = await sign(payload, jwtSecret, {alg: 'HS256'});

      console.log('JWT Token:', jwtToken);

      const response = await axiosInstance.post(
        '/api/v1/service/wallet-money/remitter/queryremitter/index',
        {
          merchant_code: merchantCode,
          ekyc_redirect_url: `${BASE_URL}/dmt_kyc`,
          mobile: phoneNumber,
        },
        {
          headers: {Token: jwtToken},
        },
      );

      const status = response.data.status;

      if (!status) {
        const result = await EkycModule.startEkyc(response.data.token);
        Alert.alert(
          'KYC Result',
          `Status: ${result.status}\nMessage: ${result.message}`,
        );
      } else {
        navigation.navigate('Home', {
          webViewUrl: `${BASE_URL}/dmt_kyc?success=true`,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('API Error:', error.response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KYC Verification</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        mode="outlined"
        label="Phone Number"
        keyboardType="phone-pad"
        maxLength={10}
        error={!!error}
        disabled={loading}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={onSubmit}
        style={styles.button}
        loading={loading}
        disabled={loading || !isValidPhone}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginLeft: 4,
  },
});
