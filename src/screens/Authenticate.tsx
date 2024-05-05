import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {Alert, NativeModules, View} from 'react-native';
import {Button, Checkbox, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../types';
import useSessionStore from '../store/useSessionStore';
import Geolocation from '@react-native-community/geolocation';
import useMerchantStore from '../store/useMerchantStore';

const {RDServices} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'Authenticate'>;

export default function Authenticate({navigation}: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const session = useSessionStore(state => state.session);
  const {merchant} = useMerchantStore(state => state);

  async function captureFingerPrint() {
    try {
      setLoading(true);
      await Geolocation.getCurrentPosition(
        async position => {
          const captureResponse = await RDServices.getFingerPrint(
            'com.mantra.rdservice',
          );

          if (captureResponse.status === 'SUCCESS') {
            console.log('Capture Response', captureResponse);

            const data = new FormData();

            data.append('payspot_session', session);
            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('responseXML', captureResponse.message);

            const response = await axios.post(
              'https://payspot.co.in/credopay/merchant_authentication2',
              data,
              {
                headers: {
                  Cookie: `payspot_session=${session}`,
                },
              },
            );

            if (response.data.response_code === '00') {
              navigation.push('Transactions');
            } else {
              Alert.alert('Error', 'Unable to authenticate. Please try again.');
            }
          } else {
            Alert.alert(
              'Error',
              'Unable to capture finger print. Please try again.',
            );
          }
        },
        error => {
          throw new Error(
            'Unable to get location. Please enable location services and try again.',
          );
        },
        {enableHighAccuracy: true},
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
      }}>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
        }}>
        <Text style={{color: 'black'}} variant="titleLarge">
          Merchant - Biometric Authentication
        </Text>
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            borderWidth: 1,
            borderColor: '#ccc',
            marginTop: 10,
            padding: 10,
          }}>
          <Text style={{}}>{merchant?.masked_aadhar}</Text>
        </View>
      </View>
      <Icon
        name="finger-print-outline"
        size={160}
        color={theme.colors.primary}
      />
      <View style={{width: '86%'}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginLeft: -23,
          }}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Text variant="bodySmall">
            I agree that PaySpot/Bank/UIDAI may share my details with each other
            for the purpose of authenticating my Aadhar Number
          </Text>
        </View>
        <Button
          loading={loading}
          style={{marginTop: 20}}
          disabled={!checked || loading}
          onPress={captureFingerPrint}
          mode="contained">
          Capture Finger Print
        </Button>
      </View>
    </View>
  );
}
