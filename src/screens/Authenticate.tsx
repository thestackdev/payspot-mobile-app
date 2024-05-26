import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {NativeModules, View} from 'react-native';
import {
  Button,
  Checkbox,
  RadioButton,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../types';
import useSessionStore from '../store/useSessionStore';
import Geolocation from '@react-native-community/geolocation';
import useMerchantStore from '../store/useMerchantStore';
import useModalStoreStore from '../store/useModalStore';
import {RD_SERVICES} from '../utils/data';

const {RDServices} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'Authenticate'>;

export default function Authenticate({navigation}: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const session = useSessionStore(state => state.session);
  const {merchant} = useMerchantStore(state => state);
  const [selectedDevice, setSelectedDevice] = useState(RD_SERVICES[0].package);

  const {setErrorMessage, setShowErrorModal} = useModalStoreStore(
    state => state,
  );

  async function captureFingerPrint() {
    Geolocation.getCurrentPosition(
      async position => {
        setLoading(true);
        const captureResponse = await RDServices.getFingerPrint(selectedDevice);

        if (captureResponse.status === 'SUCCESS') {
          try {
            const data = new FormData();

            data.append('payspot_session', session);
            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('responseXML', captureResponse.message);

            const response = await axios.post(
              '/credopay/merchant_authentication2',
              data,
              {headers: {Cookie: `payspot_session=${session}`}},
            );

            if (response.data.response_code === '00') {
              navigation.push('Transactions');
            } else {
              setShowErrorModal(true);
              setErrorMessage({
                title: 'Authentication Failed',
                message: 'Response Code: ' + response.data.response_code,
              });
            }
          } catch (error) {
            const e = error as any;

            setShowErrorModal(true);

            if (e.response) {
              setErrorMessage({
                title: 'Authentication Failed',
                message: e.response?.data?.error || 'Something went wrong',
              });
            } else {
              setErrorMessage({
                title: 'Authentication Failed',
                message: 'An error occurred while authenticating.',
              });
            }
          }
        } else if (captureResponse.status === 'FAILURE') {
          setShowErrorModal(true);
          setErrorMessage({
            title: 'Finger Print Capture Failed',
            message: captureResponse.message,
          });
        }
        setLoading(false);
      },
      error => {
        setShowErrorModal(true);
        setErrorMessage({
          title: 'Location Permission Required',
          message: 'Please enable location permission to continue',
        });
      },
      {enableHighAccuracy: true},
    );
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
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
          }}>
          <Text style={{color: 'black'}} variant="titleLarge">
            Two Factor Authentication (2FA){'\n'}
            Daily Login
          </Text>
          <Text
            style={{
              color: 'black',
              marginTop: 20,
              textAlign: 'left',
              width: '100%',
            }}>
            Select your aadhar and device
          </Text>
          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#ccc',
              marginTop: 10,
              padding: 10,
              borderRadius: 5,
            }}>
            <Text>{merchant?.masked_aadhar}</Text>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              gap: 10,
              alignSelf: 'flex-start',
              marginTop: 10,
            }}>
            {RD_SERVICES.map(device => (
              <View
                key={device.package}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <RadioButton
                  key={device.package}
                  value={device.package}
                  status={
                    selectedDevice === device.package ? 'checked' : 'unchecked'
                  }
                  onPress={() => setSelectedDevice(device.package)}
                />
                <Text>{device.label}</Text>
              </View>
            ))}
          </View>
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
            marginLeft: -28,
            alignItems: 'center',
            gap: 10,
          }}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
          />
          <Text variant="bodySmall">
            I give my consent for authenticating this transaction initiated by
            myself using my Aadhaar no. {'\n'}
            मैं अपने आधार नंबर का उपयोग करके स्वयं द्वारा शुरू किए गए इस
            ट्रांजैक्शन को प्रमाणित करने के लिए अपनी सहमति देता हूं।
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
