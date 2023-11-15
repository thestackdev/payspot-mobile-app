import Geolocation from '@react-native-community/geolocation';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import queryString from 'query-string';
import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {RootStackParamList} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation, route}: Props) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const focued = useIsFocused();

  const captureUrl = /step=(\d+)&part=(\d+)&session=([A-Za-z0-9]+)/;
  const transactionsPattern = /step=(\d+)&session=([A-Za-z0-9]+)/;

  const WEBVIEW_REF = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

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

  // useEffect(() => {
  //   if (focued) {
  //     WEBVIEW_REF.current?.reload();
  //   }
  // }, [focued]);

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);

    if (captureUrl.test(navState.url) && navState.loading === false) {
      console.log('matched');

      const {query} = queryString.parseUrl(navState.url);
      const part = query.part?.toString();
      const step = query.step?.toString();
      const session = query.session?.toString();

      if (step === '2') {
        navigation.push('Authenticate', {
          part: part,
          session: session,
          step: step,
        });
      } else if (step === '3') {
        navigation.push('Transactions', {
          part: part,
          session: session,
          step: step,
        });
      }
    } else if (
      transactionsPattern.test(navState.url) &&
      navState.loading === false
    ) {
      const {query} = queryString.parseUrl(navState.url);
      const step = query.step?.toString();
      const session = query.session?.toString();

      navigation.push('Transactions', {
        part: '3',
        session: session,
        step: step,
      });
    }
  };

  useEffect(() => {
    (async () => {
      Geolocation.getCurrentPosition(info => {
        // console.log(info)
      });
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#441FB1" />
      <WebView
        ref={WEBVIEW_REF}
        onNavigationStateChange={onNavigationStateChange}
        source={{uri: 'https://payspot.co.in'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
