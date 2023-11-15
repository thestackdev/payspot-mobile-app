import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {
  Button,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import RdServices from 'react-native-rd-services';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export default function Transactions({navigation, route}: Props) {
  const [paymentType, setPaymentType] = useState('cashWithdrawal');
  const [aadhar, setAadhar] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [selectBankOpen, setSelectBankOpen] = useState(false);
  const [bank, setBank] = useState(null);
  const [banks, setBanks] = useState([
    {label: 'SBI', value: 'SBI'},
    {label: 'Kotak Mahindra Bank', value: 'Kotak Mahindra Bank'},
    {label: 'ICICI', value: 'ICICI'},
  ]);
  const [amount, setAmount] = useState('0');
  const [remarks, setRemarks] = useState('');
  const [fingerPrint, setFingerPrint] = useState(null);
  const [loading, setLoading] = useState(false);

  const {colors} = useTheme();

  const {part, session, step} = route.params;

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
      let pidOption =
        "<?xml version='1.0'?><PidOptions ver='1.0'><Opts fCount='1' fType='2' iCount='0' pCount='0' format='0' pidVer='2.0' timeout='10000' posh='UNKNOWN' env='P' /><CustOpts></CustOpts></PidOptions>";
      const captureResponse = await RdServices.getFingerPrint(
        'com.mantra.rdservice',
        pidOption,
      );

      if (captureResponse.status === 'SUCCESS') {
        setFingerPrint(captureResponse.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const data = new FormData();
      data.append('payspot_session', session);
      data.append('service', getService());
      data.append('status', 1);

      const response = await axios.post(
        'https://payspot.co.in/api/aeps_api',
        data,
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
            value="cashWithdrawal"
            status={paymentType === 'cashWithdrawal' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('cashWithdrawal')}
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
            value="balanceEnquiry"
            status={paymentType === 'balanceEnquiry' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('balanceEnquiry')}
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
            value="miniStatement"
            status={paymentType === 'miniStatement' ? 'checked' : 'unchecked'}
            onPress={() => setPaymentType('miniStatement')}
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
          <TextInput
            value={aadhar}
            placeholder="Enter Aadhaar Number"
            onChangeText={text => setAadhar(text)}
            keyboardType="numeric"
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
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Customer Mobile Number
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <TextInput
            placeholder="Customer Mobile Number"
            value={customerMobile}
            keyboardType="numeric"
            onChangeText={text => setCustomerMobile(text)}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            style={{
              width: '100%',
              marginTop: 12,
              backgroundColor: 'white',
              borderColor: '#ccc',
              borderWidth: 0.7,
              borderRadius: 4,
              fontSize: 16,
            }}
          />
        </View>
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Bank
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <SelectList
            setSelected={val => setBank(val)}
            placeholder="Select Bank"
            data={banks}
            save="value"
            search={false}
            boxStyles={{
              width: '100%',
              marginTop: 12,
              backgroundColor: 'white',
              borderColor: '#ccc',
              borderWidth: 0.7,
              borderRadius: 4,
            }}
            inputStyles={{
              color: 'black',
              backgroundColor: 'white',
            }}
            dropdownTextStyles={{
              color: 'black',
            }}
          />
        </View>

        {paymentType === 'cashWithdrawal' && (
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
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Remarks
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <TextInput
            value={remarks}
            placeholder="Enter Remarks"
            onChangeText={text => setRemarks(text)}
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
      </View>
      <View style={{flexGrow: 1}}></View>
      <View style={{paddingBottom: 40, marginTop: 23}}>
        <Button
          mode="contained"
          disabled={fingerPrint !== null}
          style={{borderRadius: 7}}
          onPress={captureFingerPrint}>
          Capture Finger Print
        </Button>
        <Button
          onPress={handleSubmit}
          mode="contained"
          loading={loading}
          disabled={!fingerPrint || loading}
          style={{marginTop: 16, borderRadius: 7}}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
}
