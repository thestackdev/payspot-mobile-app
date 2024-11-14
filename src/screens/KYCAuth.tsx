import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {View, NativeModules, Alert, StyleSheet} from 'react-native';
import {Button, TextInput, Text} from 'react-native-paper';
import {useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../utils/data';

const {EkycModule} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'KYCAuth'>;

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

    try {
      const response = await axios.post('/api/authencticate-remitter', {
        mobile: phoneNumber,
      });

      setLoading(false);

      const status = response.data.data?.response_code;

      if (status === 0 || status === 2) {
        const result = await EkycModule.startEkyc(response.data.data?.token);
        if (result.status === 'Success') {
          navigation.navigate('Home', {
            webViewUrl: `${BASE_URL}/dmt_kyc?mobile=${phoneNumber}`,
            timestamp: Date.now(),
          });
        } else {
          Alert.alert('Error', result.message);
        }
      } else {
        navigation.navigate('Home', {
          webViewUrl: `${BASE_URL}/dmt_kyc?mobile=${phoneNumber}`,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('API Error:', error.response.data);
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
