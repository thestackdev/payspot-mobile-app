import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {useState} from 'react';
import {
  NativeModules,
  ScrollView,
  StyleSheet,
  View,
  Keyboard,
} from 'react-native';
import {Button, RadioButton, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../types';
import userMerchantStore from '../store/useMerchantStore';
const {RDServices} = NativeModules;
import Geolocation from '@react-native-community/geolocation';
import useSessionStore from '../store/useSessionStore';
import MaskInput from 'react-native-mask-input';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useModalStoreStore from '../store/useModalStore';
import useBalanceEnquiryStore from '../store/useBalanceEnquiry';
import useMiniStatementStore from '../store/useMiniStatement';
import {validateAadhaar} from '../utils/helpers';
import {RD_SERVICES} from '../utils/data';
import useMerchantStore from '../store/useMerchantStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export default function Transactions({navigation}: Props) {
  const [paymentType, setPaymentType] = useState('cashwithdrawal');
  const [aadhar, setAadhar] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [bank, setBank] = useState(null);
  const banksList =
    userMerchantStore(state => state.merchant?.banks_list) || [];
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const session = useSessionStore(state => state.session);
  const aadharRegex = /^\d{12}$/;
  const phoneRegex = /^\d{10}$/;
  const {setErrorMessage, setShowErrorModal} = useModalStoreStore(
    state => state,
  );
  const {setBalanceEnquiryMessage, setShowBalanceEnquiryModal} =
    useBalanceEnquiryStore(state => state);
  const {setMiniStatementMessage, setShowMiniStatementModal} =
    useMiniStatementStore(state => state);
  const defaultDevice = useMerchantStore(
    state => state.merchant?.onboarded.default_device,
  );

  const [selectedDevice, setSelectedDevice] = useState(
    defaultDevice === 'mantra'
      ? RD_SERVICES[1].package
      : RD_SERVICES[2].package,
  );

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

  function reset() {
    setAadhar('');
    setCustomerMobile('');
    setAmount(null);
  }

  function valideAadhar() {
    const validAadhar = validateAadhaar(aadhar);

    if (!validAadhar) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Invalid Aadhaar Number',
        message: 'Please enter a valid Aadhaar number',
      });
    }

    return validAadhar;
  }

  function validePhone() {
    const validPhone = phoneRegex.test(customerMobile);

    if (!validPhone) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid mobile number',
      });
    }

    return validPhone;
  }

  function validateBank() {
    if (!bank) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Bank Not Selected',
        message: 'Please select a bank',
      });
    }

    return bank;
  }

  function valideAmount() {
    if (amount === null || amount < 1) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return false;
    }

    if (amount > 10000) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Amount Exceeded',
        message: 'Amount should not exceed 10000',
      });
      return false;
    }

    return true;
  }

  async function cashWithdrawal() {
    if (
      !valideAadhar() ||
      !validePhone() ||
      !validateBank() ||
      !valideAmount()
    ) {
      return;
    }

    navigation.navigate('CashWithdrawal', {
      amount: Number(amount),
      aadhar,
      mobile: customerMobile,
      bank,
      selectedDevice,
    });
    reset();
  }

  async function balanceenquiry() {
    if (!valideAadhar() || !validePhone() || !validateBank()) {
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          setLoading(true);

          const merchantAuthFingerPrint = await RDServices.getFingerPrint(
            selectedDevice,
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
              `/aeps/merchant_credopay_transaction2`,
              data,
              {headers: {Cookie: `payspot_session=${session}`}},
            );

            setBalanceEnquiryMessage(response.data[0]?.result);
            setShowBalanceEnquiryModal(true);
          } else if (merchantAuthFingerPrint.status === 'FAILURE') {
            setLoading(false);
            setShowErrorModal(true);
            setErrorMessage({
              title: 'Failed to capture fingerprint',
              message: merchantAuthFingerPrint.message,
            });
          }
        } catch (error) {
          const e = error as any;

          setShowErrorModal(true);

          if (e.response) {
            setErrorMessage({
              title: 'Failed to retrieve balance',
              message: e.response?.data?.error || 'Something went wrong',
            });
          } else {
            setErrorMessage({
              title: 'Failed to retrieve balance',
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

  async function ministatement() {
    if (!valideAadhar() || !validePhone() || !validateBank()) {
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        setLoading(true);
        try {
          const merchantAuthFingerPrint = await RDServices.getFingerPrint(
            selectedDevice,
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
              `/aeps/merchant_credopay_transaction2`,
              data,
              {headers: {Cookie: `payspot_session=${session}`}},
            );

            setMiniStatementMessage(response.data[0]);
            setShowMiniStatementModal(true);
          } else if (merchantAuthFingerPrint.status === 'FAILURE') {
            setLoading(false);
            setShowErrorModal(true);
            setErrorMessage({
              title: 'Failed to capture fingerprint',
              message: merchantAuthFingerPrint.message,
            });
          }
        } catch (error) {
          const e = error as any;

          navigation.pop();

          setShowErrorModal(true);

          if (e.response) {
            setErrorMessage({
              title: 'Failed to retrieve Mini Statement',
              message: e.response?.data?.error || 'Something went wrong',
            });
          } else {
            setErrorMessage({
              title: 'Failed to retrieve Mini Statement',
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

  function submit() {
    Keyboard.dismiss();
    if (paymentType === 'cashwithdrawal') {
      cashWithdrawal();
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
      }}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled">
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
              value={aadhar}
              onChangeText={(masked, unmasked) => {
                setAadhar(unmasked);
              }}
              placeholder="Enter 12 digit Aadhaar number"
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: 'black',
                paddingHorizontal: 10,
              }}
              autoFocus={false}
              keyboardType="numeric"
              mask={AADHAR_MASKED}
              maxLength={14}
              aria-disabled={loading}
            />
            {aadhar.length === 12 && (
              <AntDesign
                name={validateAadhaar(aadhar) ? 'checkcircle' : 'closecircle'}
                size={24}
                color={validateAadhaar(aadhar) ? 'green' : 'red'}
                style={{position: 'absolute', right: 10, top: 10}}
              />
            )}
          </View>
        </View>
        <View style={{marginTop: 23}}>
          <Text variant="labelLarge" style={{marginLeft: 5}}>
            Customer Mobile Number
            <Text style={{color: 'red'}}> *</Text>
          </Text>
          <MaskInput
            value={customerMobile}
            onChangeText={(masked, unmasked) => {
              setCustomerMobile(masked);
            }}
            autoFocus={false}
            placeholder="Enter 10 digit mobile number"
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
            maxLength={10}
            aria-disabled={loading}
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
            <SelectDropdown
              data={banksList.map(bank => ({
                id: bank.id,
                title: bank.bankName,
                icon: 'bank',
              }))}
              onSelect={(selectedItem, index) => {
                setBank(selectedItem.id);
              }}
              search={true}
              disableAutoScroll={true}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    {selectedItem && (
                      <Icon
                        name={selectedItem.icon}
                        style={styles.dropdownButtonIconStyle}
                      />
                    )}
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) ||
                        'Select your bank'}
                    </Text>
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      style={styles.dropdownButtonArrowStyle}
                    />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && {backgroundColor: '#D2D9DF'}),
                    }}>
                    <Icon
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    />
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
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
              placeholder="Enter amount"
              autoFocus={false}
              style={{
                width: '100%',
                marginTop: 12,
                backgroundColor: 'white',
                borderColor: '#ccc',
                borderWidth: 0.7,
                borderRadius: 4,
              }}
              disabled={loading}
              maxLength={5}
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
          disabled={loading}
          loading={loading}>
          Make Transaction
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
