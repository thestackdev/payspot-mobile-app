import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {View} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {Button, Text} from 'react-native-paper';
import {RootStackParamList} from '../../../types';
import {BASE_URL} from '../../utils/data';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CheckPhoneNumberForDMT'
>;

export default function CheckPhoneNumberForDMT({navigation}: Props) {
  const [loading, setLoading] = useState(false);
  const [customerMobile, setCustomerMobile] = useState('');

  const IN_PHONE_MASKED = [
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

  async function checkPhoneNumber() {
    try {
      setLoading(true);
      const response = await axios.post(
        `/checkNewMobile?mobile=${customerMobile}`,
      );
      if (response.data.data?.response_code === 2) {
        navigation.navigate('DomesticMoneyTransfer', {mobile: customerMobile});
      } else {
        navigation.navigate('Home', {
          webViewUrl: `${BASE_URL}/dmt?mobile=${customerMobile}`,
          timestamp: Date.now(),
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
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
      }}>
      <View style={{marginTop: 23}}>
        <Text variant="labelLarge" style={{marginLeft: 5}}>
          Mobile Number
          <Text style={{color: 'red'}}> *</Text>
        </Text>
        <View
          style={{
            width: '100%',
            marginTop: 12,
            backgroundColor: 'white',
            borderColor: '#ccc',
            borderWidth: 0.7,
            borderRadius: 4,
            flexDirection: 'row',
          }}>
          <MaskInput
            value={customerMobile}
            onChangeText={(masked, unmasked) => {
              setCustomerMobile(masked);
            }}
            autoFocus={false}
            placeholder="Enter 10 digit mobile number"
            style={{
              width: '100%',
              backgroundColor: 'white',
              color: 'black',
              paddingHorizontal: 10,
            }}
            keyboardType="numeric"
            mask={IN_PHONE_MASKED}
            maxLength={10}
            aria-disabled={loading}
          />
        </View>
      </View>
      <Button
        onPress={checkPhoneNumber}
        disabled={loading}
        mode="contained"
        loading={loading}
        style={{marginTop: 12}}>
        Check Phone Number
      </Button>
    </View>
  );
}
