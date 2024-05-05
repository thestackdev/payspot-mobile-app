import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {Alert, NativeModules, ScrollView, View} from 'react-native';
import {Button, RadioButton, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../types';
import userMerchantStore from '../store/useMerchantStore';
const {RDServices} = NativeModules;
import {Picker} from '@react-native-picker/picker';
import Geolocation from '@react-native-community/geolocation';
import useSessionStore from '../store/useSessionStore';
import MaskInput from 'react-native-mask-input';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export default function Transactions({navigation}: Props) {
  const [paymentType, setPaymentType] = useState('cashwithdrawal');
  const [aadhar, setAadhar] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [bank, setBank] = useState(null);
  const banksList = userMerchantStore(state => state.merchant?.banks_list);
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const session = useSessionStore(state => state.session);
  const aadharRegex = /^\d{12}$/;
  const phoneRegex = /^\d{10}$/;

  const IN_PHONE_MASKED = [
    '+',
    '9',
    '1',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  const AADHAR_MASKED = [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  async function captureFingerPrint() {
    const validAadhar = aadharRegex.test(aadhar);
    const validPhone = phoneRegex.test(customerMobile);

    if (!validAadhar) {
      return Alert.alert('Please enter a valid Aadhaar number');
    }

    if (!validPhone) {
      return Alert.alert('Please enter a valid mobile number');
    }

    if (!bank) {
      return Alert.alert('Please select a bank');
    }

    if (amount === '0') {
      return Alert.alert('Please enter a valid amount');
    }

    setLoading(true);
    await Geolocation.getCurrentPosition(
      async position => {
        try {
          const merchantAuthFingerPrint = await RDServices.getFingerPrint(
            'com.mantra.rdservice',
          );

          if (merchantAuthFingerPrint.status === 'SUCCESS') {
            const data = new FormData();

            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('responseXML', merchantAuthFingerPrint.message);

            const merchantAuthResponse = await axios.post(
              'https://payspot.co.in/credopay/merchant_authentication2',
              data,
              {
                headers: {
                  Cookie: `payspot_session=${session}`,
                },
              },
            );

            if (merchantAuthResponse.data.response_code !== '00') {
              Alert.alert('Unable to Authenticate Merchant');
              return;
            }

            const userAuthFingerPrint = await RDServices.getFingerPrint(
              'com.mantra.rdservice',
            );

            if (userAuthFingerPrint.status === 'SUCCESS') {
              const data = new FormData();
              data.append('transactionType', paymentType);
              data.append('amount', amount);
              data.append(
                'auth_reference_no',
                merchantAuthResponse.data.auth_reference_no,
              );
              data.append('responseXML', userAuthFingerPrint.data);
              data.append('aadhar_number', aadhar);
              data.append('latitude', position.coords.latitude.toString());
              data.append('longitude', position.coords.longitude.toString());
              data.append('bank', bank);
              data.append('mobile_number', customerMobile);

              const response = await axios.post(
                `https://payspot.co.in/aeps/merchant_credopay_transaction2`,
                data,
                {
                  headers: {
                    Cookie: `payspot_session=${session}`,
                  },
                },
              );

              Alert.alert(
                'Transaction Successful',
                JSON.stringify(response.data),
              );
            }
          }
        } catch (error) {
          console.log('error', JSON.stringify(error));
        }
      },
      error => {
        throw new Error(
          'Unable to get location. Please enable location services and try again.',
        );
      },
      {enableHighAccuracy: true},
    );
    setLoading(false);
  }

  async function balanceenquiry() {
    const validAadhar = aadharRegex.test(aadhar);
    const validPhone = phoneRegex.test(customerMobile);

    if (!validAadhar) {
      return Alert.alert('Please enter a valid Aadhaar number');
    }

    if (!validPhone) {
      return Alert.alert('Please enter a valid mobile number');
    }

    if (!bank) {
      return Alert.alert('Please select a bank');
    }

    setLoading(true);
    await Geolocation.getCurrentPosition(
      async position => {
        try {
          const merchantAuthFingerPrint = await RDServices.getFingerPrint(
            'com.mantra.rdservice',
          );

          if (merchantAuthFingerPrint.status === 'SUCCESS') {
            const data = new FormData();
            data.append('transactionType', paymentType);
            data.append('aadhar_number', aadhar);
            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('bank', bank);
            data.append('mobile_number', customerMobile);
            data.append('responseXML', merchantAuthFingerPrint.message);

            const response = await axios.post(
              `https://payspot.co.in/aeps/merchant_credopay_transaction2`,
              data,
              {
                headers: {
                  Cookie: `payspot_session=${session}`,
                },
              },
            );

            Alert.alert(
              'Transaction Successful',
              JSON.stringify(response.data),
            );
          } else {
            Alert.alert(
              'Error',
              'Unable to capture finger print. Please try again.',
            );
          }
        } catch (error) {
          console.log('error');
        }
      },
      error => {
        throw new Error(
          'Unable to get location. Please enable location services and try again.',
        );
      },
      {enableHighAccuracy: true},
    );
    setLoading(false);
  }

  async function ministatement() {
    const validAadhar = aadharRegex.test(aadhar);
    const validPhone = phoneRegex.test(customerMobile);

    if (!validAadhar) {
      return Alert.alert('Please enter a valid Aadhaar number');
    }

    if (!validPhone) {
      return Alert.alert('Please enter a valid mobile number');
    }

    if (!bank) {
      return Alert.alert('Please select a bank');
    }

    setLoading(true);
    await Geolocation.getCurrentPosition(
      async position => {
        try {
          const merchantAuthFingerPrint = await RDServices.getFingerPrint(
            'com.mantra.rdservice',
          );

          if (merchantAuthFingerPrint.status === 'SUCCESS') {
            const data = new FormData();
            data.append('transactionType', paymentType);
            data.append('aadhar_number', aadhar);
            data.append('latitude', position.coords.latitude.toString());
            data.append('longitude', position.coords.longitude.toString());
            data.append('bank', bank);
            data.append('mobile_number', customerMobile);
            data.append('responseXML', merchantAuthFingerPrint.message);

            const response = await axios.post(
              `https://payspot.co.in/aeps/merchant_credopay_transaction2`,
              data,
              {
                headers: {
                  Cookie: `payspot_session=${session}`,
                },
              },
            );

            Alert.alert(
              'Transaction Successful',
              JSON.stringify(response.data),
            );
          } else {
            Alert.alert(
              'Error',
              'Unable to capture finger print. Please try again.',
            );
          }
        } catch (error) {
          console.log('error');
        }
      },
      error => {
        throw new Error(
          'Unable to get location. Please enable location services and try again.',
        );
      },
      {enableHighAccuracy: true},
    );
    setLoading(false);
  }

  function submit() {
    if (paymentType === 'cashwithdrawal') {
      captureFingerPrint();
    } else if (paymentType === 'balanceenquiry') {
      balanceenquiry();
    } else if (paymentType === 'ministatement') {
      ministatement();
    }
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 23,
      }}>
      <Text style={{marginTop: 16}} variant="labelLarge">
        Payment Type <Text style={{color: 'red'}}>*</Text>
      </Text>
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
          <RadioButton
            value="cashwithdrawal"
            status={paymentType === 'cashwithdrawal' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('cashwithdrawal')}
          />
          <Text variant="labelMedium">Cash Withdrawal</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
          <RadioButton
            value="balanceenquiry"
            status={paymentType === 'balanceenquiry' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('balanceenquiry')}
          />
          <Text variant="labelMedium">Balance Enquiry</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
          <RadioButton
            value="ministatement"
            status={paymentType === 'ministatement' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('ministatement')}
          />
          <Text variant="labelMedium">Mini Statement</Text>
        </View>
      </View>
      <View>
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Aadhaar Number
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <MaskInput
            value={aadhar}
            onChangeText={(masked, unmasked) => {
              setAadhar(unmasked);
            }}
            style={{
              width: '100%',
              marginTop: 12,
              backgroundColor: 'white',
              borderColor: '#ccc',
              borderWidth: 0.7,
              borderRadius: 4,
              color: 'black',
              paddingHorizontal: 10,
            }}
            keyboardType="numeric"
            mask={AADHAR_MASKED}
          />
        </View>
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Customer Mobile Number
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <MaskInput
            value={customerMobile}
            onChangeText={(masked, unmasked) => {
              setCustomerMobile(unmasked);
            }}
            style={{
              width: '100%',
              marginTop: 12,
              backgroundColor: 'white',
              borderColor: '#ccc',
              borderWidth: 0.7,
              borderRadius: 4,
              color: 'black',
              paddingHorizontal: 10,
            }}
            keyboardType="numeric"
            mask={IN_PHONE_MASKED}
          />
        </View>
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Bank
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <View
            style={{
              width: '100%',
              marginTop: 12,
              borderWidth: 0.7,
              borderRadius: 4,
            }}>
            <Picker
              selectedValue={bank}
              onValueChange={(itemValue, itemIndex) => setBank(itemValue)}>
              {banksList?.map(bank => (
                <Picker.Item
                  key={bank.id}
                  style={{
                    color: 'black',
                    backgroundColor: 'white',
                  }}
                  label={bank.bankName}
                  value={bank.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        {paymentType === 'cashwithdrawal' && (
          <View style={{marginTop: 23}}>
            <Text variant="labelLarge" style={{marginLeft: 5}}>
              Amount
              <Text style={{color: 'red'}}> *</Text>
            </Text>
            <TextInput
              value={amount}
              keyboardType="numeric"
              onChangeText={text => setAmount(text)}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              style={{
                width: '100%',
                marginTop: 12,
                backgroundColor: 'white',
                borderColor: '#ccc',
                borderWidth: 0.7,
                borderRadius: 4,
              }}
            />
          </View>
        )}
      </View>
      <View style={{flexGrow: 1}}></View>
      <View style={{paddingBottom: 40, marginTop: 23}}>
        <Button
          mode="contained"
          style={{borderRadius: 7}}
          onPress={submit}
          loading={loading}>
          Make Transaction
        </Button>
      </View>
    </ScrollView>
  );
}
