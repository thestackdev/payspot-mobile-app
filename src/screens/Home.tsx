import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View, Alert} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {RootStackParamList} from '../../types';
import Spinner from '../components/Spinner';
import {requestLocationPermission} from '../utils/permissions';
import moment from 'moment-timezone';
import axios from 'axios';
import useMerchantStore from '../store/useMerchantStore';
import useSessionStore from '../store/useSessionStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation, route}: Props) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const {merchant, setMerchant} = useMerchantStore(state => state);
  const {setSession} = useSessionStore(state => state);
  const WEBVIEW_REF = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  function isTodayIST(timestamp: string) {
    const dateInIST = moment(timestamp).tz('Asia/Kolkata');
    const todayInIST = moment().tz('Asia/Kolkata');
    return dateInIST.isSame(todayInIST, 'day');
  }

  const jsCode = `
  const cookies = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = decodeURIComponent(value);
    return prev;
  }, {});
  window.ReactNativeWebView.postMessage(JSON.stringify(cookies));
`;

  const onMessage = (event: any) => {
    const cookies = JSON.parse(event.nativeEvent.data);

    if (cookies.hasOwnProperty('payspot_app_session')) {
      const payspotAppSession = cookies['payspot_app_session'];
      if (payspotAppSession) {
        setSession(payspotAppSession);
      }
    }
  };

  const onNavigationStateChange = async (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    if (navState.loading === false) {
      // const {query} = queryString.parseUrl(navState.url);

      if (navState.url === 'https://payspot.co.in/transact') {
        try {
          const respnse = await axios.get(
            'https://payspot.co.in/credopay/get_cred_data',
          );

          setMerchant(respnse.data?.data);

          const onboarded = respnse.data?.data?.onboarded;

          if (onboarded.status === 0) {
            Alert.alert(
              'Onboarding',
              'You are not allowed to finish this step',
            );
            return;
          }

          if (isTodayIST(onboarded.last_authenticated_at)) {
            navigation.push('Transactions');
          } else {
            navigation.push('Authenticate');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  async function requestPermissions() {
    await requestLocationPermission();
    setLoading(false);
  }

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      if (WEBVIEW_REF.current && canGoBack) {
        WEBVIEW_REF.current.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [canGoBack]);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  if (loading) return <Spinner />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#441FB1" />
      <WebView
        ref={WEBVIEW_REF}
        onNavigationStateChange={onNavigationStateChange}
        source={{uri: 'https://payspot.co.in'}}
        thirdPartyCookiesEnabled={true}
        injectedJavaScript={jsCode}
        onMessage={onMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
