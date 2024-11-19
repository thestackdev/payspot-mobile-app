import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, NativeModules, Alert} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {Button, RadioButton, Text, TextInput} from 'react-native-paper';
import {RootStackParamList} from '../../../types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {validateAadhaar} from '../../utils/helpers';
import Geolocation from '@react-native-community/geolocation';
import {BASE_URL, RD_SERVICES} from '../../utils/data';
import useSessionStore from '../../store/useSessionStore';
import axios from 'axios';
import useModalStoreStore from '../../store/useModalStore';

const {RDServices} = NativeModules;

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DomesticMoneyTransfer'
>;

export default function DomesticMoneyTransfer({navigation, route}: Props) {
  const {mobile} = route.params;
  const [aadhar, setAadhar] = useState('');
  const session = useSessionStore(state => state.session);
  const [selectedDevice, setSelectedDevice] = useState(RD_SERVICES[0].package);
  const {setErrorMessage, setShowErrorModal} = useModalStoreStore(
    state => state,
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    mobile: '',
    aadhar: '',
  });
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

  const validateInputs = (field: string, value: string) => {
    switch (field) {
      case 'mobile':
        if (value.length !== 10) {
          setErrors(prev => ({...prev, mobile: 'Enter valid 10 digit number'}));
        } else {
          setErrors(prev => ({...prev, mobile: ''}));
        }
        break;
      case 'aadhar':
        if (!validateAadhaar(value)) {
          setErrors(prev => ({...prev, aadhar: 'Enter valid Aadhaar number'}));
        } else {
          setErrors(prev => ({...prev, aadhar: ''}));
        }
        break;
    }
  };

  const isFormValid = mobile.length === 10 && validateAadhaar(aadhar);

  async function captureFingerPrint() {
    if (!mobile || mobile.length !== 10) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Validation Error',
        message: 'Please enter valid 10 digit mobile number',
      });
      return;
    }

    if (!aadhar || !validateAadhaar(aadhar)) {
      setShowErrorModal(true);
      setErrorMessage({
        title: 'Validation Error',
        message: 'Please enter valid 12 digit Aadhaar number',
      });
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        setLoading(true);
        const captureResponse = await RDServices.getFingerPrint(
          selectedDevice,
          false,
        );

        if (captureResponse.status === 'SUCCESS') {
          try {
            const fromData = new FormData();
            fromData.append('payspot_session', session);
            fromData.append('latitude', position.coords.latitude.toString());
            fromData.append('longitude', position.coords.longitude.toString());
            fromData.append('aadhar', aadhar);
            fromData.append('mobile_number', mobile);
            fromData.append('responseXML', captureResponse.message);

            const response = await axios.post(
              '/merchant_authentication',
              fromData,
              {headers: {Cookie: `payspot_session=${session}`}},
            );

            const {response_code, data} = response.data?.data;

            if (response_code === 1) {
              navigation.navigate('Home', {
                webViewUrl: `${BASE_URL}/dmt?mobile=${mobile}&ekyc_id=${data.ekyc_id}&stateresp=${data.stateresp}`,
                timestamp: Date.now(),
              });
            } else {
              setShowErrorModal(true);
              setErrorMessage({
                title: 'Authentication Failed',
                message: 'Response Code: ' + response_code,
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
                message: JSON.stringify(e.response?.data),
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
          title: 'Failed to get location',
          message: error.message || 'Please enable location permission',
        });
      },
    );
  }

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: 'white', padding: 16}}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled">
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
            value={mobile}
            onChange={() => {}}
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
              validateInputs('aadhar', unmasked);
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
      <Button
        onPress={captureFingerPrint}
        disabled={loading || !isFormValid}
        mode="contained"
        loading={loading}
        style={{marginTop: 12}}>
        Authenticate
      </Button>
    </ScrollView>
  );
}
