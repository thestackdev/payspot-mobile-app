import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {View} from 'react-native';
import {Button, Checkbox, Text, useTheme} from 'react-native-paper';
import RdServices from 'react-native-rd-services';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Authenticate'>;

export default function Authenticate({navigation, route}: Props) {
  const {part, session, step} = route.params;

  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  function getService() {
    switch (part) {
      case '1':
        return 'aeps_registration';
      case '2':
        return 'aeps_authentication';
      default:
        break;
    }
  }

  async function captureFingerPrint() {
    try {
      setLoading(true);
      let pidOption =
        "<?xml version='1.0'?><PidOptions ver='1.0'><Opts fCount='1' fType='2' iCount='0' pCount='0' format='0' pidVer='2.0' timeout='10000' posh='UNKNOWN' env='P' /><CustOpts></CustOpts></PidOptions>";
      const captureResponse = await RdServices.getFingerPrint(
        'com.mantra.rdservice',
        pidOption,
      );

      if (captureResponse.status === 'SUCCESS') {
        const data = new FormData();
        data.append('payspot_session', session);
        data.append('service', getService());
        data.append('status', 1);
        // data.append('fp', captureResponse.data);

        const response = await axios.post(
          'https://payspot.co.in/api/aeps_api',
          data,
        );

        navigation.push('Transactions', {
          part: part,
          session: session,
          step: step,
        });
      }
    } catch (error) {
      console.log(error);
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
      {step === '1' ? (
        <Text
          variant="bodyLarge"
          style={{
            color: 'black',
          }}>
          Merchant - Biometric Registration
        </Text>
      ) : (
        <Text style={{color: 'black'}} variant="titleLarge">
          Merchant - Biometric Authentication
        </Text>
      )}
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
