import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {NativeModules, View} from 'react-native';
import {Button, Checkbox, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../types';
import useSessionStore from '../store/useSessionStore';
import Geolocation from '@react-native-community/geolocation';
import useModalStoreStore from '../store/useModalStore';
import useCashwithdralStore from '../store/useCashwithdral';
import {BASE_URL} from '../utils/data';

const {RDServices} = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'CashWithdrawal'>;

export default function CashWithdrawal({navigation, route}: Props) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const session = useSessionStore(state => state.session);
  const [step, setStep] = useState(1);
  const [merchantRefNo, setMerchantRefNo] = useState(null);
  const {setShowWithdrawModal, setWithdrawMessage} = useCashwithdralStore(
    state => state,
  );

  const {amount, aadhar, mobile, bank, selectedDevice} = route.params;

  const {
    setErrorMessage,
    setShowErrorModal,
    setShowSuccessModal,
    setSuccessMessage,
  } = useModalStoreStore(state => state);

  async function merchantAuthentication() {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          setLoading(true);
          const merchantAuthFingerPrint = await RDServices.getFingerPrint(
            selectedDevice,
          );

          if (merchantAuthFingerPrint.status === 'SUCCESS') {
            const data = new FormData();

            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('responseXML', merchantAuthFingerPrint.message);

            const merchantAuthResponse = await axios.post(
              `${BASE_URL}/credopay/merchant_authentication2`,
              data,
              {headers: {Cookie: `payspot_session=${session}`}},
            );

            if (merchantAuthResponse.data.response_code !== '00') {
              setShowErrorModal(true);
              setErrorMessage({
                title: 'Authentication Failed',
                message:
                  'Response Code: ' + merchantAuthResponse.data.response_code,
              });
              setLoading(false);
              return;
            }

            setShowSuccessModal(true);
            setSuccessMessage({
              title: 'Merchant Authenticated',
              message: 'Merchant has been authenticated successfully',
            });

            setMerchantRefNo(merchantAuthResponse.data.auth_reference_no);
            setStep(2);
          } else if (merchantAuthFingerPrint.status === 'FAILURE') {
            setShowErrorModal(true);
            setErrorMessage({
              title: 'Failed to capture Merchant fingerprint',
              message: merchantAuthFingerPrint.message,
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
        setLoading(false);
      },
      error => {
        setShowErrorModal(true);
        setErrorMessage({
          title: 'Location Permission Required',
          message: 'Please enable location permission to continue',
        });
      },
    );
  }

  async function captureFingerPrint() {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          setLoading(true);

          const userAuthFingerPrint = await RDServices.getFingerPrint(
            selectedDevice,
          );

          if (userAuthFingerPrint.status === 'SUCCESS') {
            const data = new FormData();
            data.append('transactionType', 'cashwithdraw');
            data.append('amount', amount);
            data.append('auth_reference_no', merchantRefNo);
            data.append('responseXML', userAuthFingerPrint.message);
            data.append('aadhar_number', aadhar);
            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('bank', bank);
            data.append('mobile_number', mobile);

            const response = await axios.post(
              `${BASE_URL}/aeps/merchant_credopay_transaction2`,
              data,
              {headers: {Cookie: `payspot_session=${session}`}},
            );

            setWithdrawMessage(response.data[0]);
            setShowWithdrawModal(true);
            navigation.pop();
          } else if (userAuthFingerPrint.status === 'FAILURE') {
            setShowErrorModal(true);
            setErrorMessage({
              title: 'Failed to capture User fingerprint',
              message: userAuthFingerPrint.message,
            });
          }
        } catch (error) {
          const e = error as any;

          setShowErrorModal(true);

          if (e.response) {
            setErrorMessage({
              title: 'Transaction Failed',
              message: e.response?.data?.error || 'Something went wrong',
            });
          } else {
            setErrorMessage({
              title: 'Transaction Failed',
              message: 'Please try again later',
            });
          }
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

  function handleSubmit() {
    if (step === 1) {
      merchantAuthentication();
    } else if (step === 2) {
      captureFingerPrint();
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
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
          }}>
          <Text style={{color: 'black'}} variant="titleLarge">
            {step === 1 ? 'Merchant Authentication' : 'User Authentication'}
          </Text>
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
            disabled={step === 2}
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
          onPress={handleSubmit}
          mode="contained">
          Capture Finger Print
        </Button>
      </View>
    </View>
  );
}
