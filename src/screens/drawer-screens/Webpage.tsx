import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import {BASE_URL} from '../../utils/data';
import {View, Text, ActivityIndicator} from 'react-native';
import useSessionStore from '../../store/useSessionStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Webpage'>;

const Webpage = ({navigation, route}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const {session, token} = useSessionStore(state => state);
  const url = route?.params?.url;

  if (typeof BASE_URL !== 'string') {
    console.error('BASE_URL is not a string.');
    return null;
  }

  let hostname = '';
  try {
    const match = BASE_URL.match(/:\/\/(.*?)(\/|$)/);
    hostname = match && match[1] ? match[1] : '';
  } catch (e) {
    console.error('Failed to extract hostname:', e);
    return null;
  }

  console.log('url', url);

  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        originWhitelist={['*']}
        source={{
          uri: `https://payspot.co.in${url}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        renderLoading={() => (
          <ActivityIndicator
            style={{position: 'absolute', top: '50%', left: '50%'}}
          />
        )}
      />
      {isLoading && (
        <View style={{position: 'absolute', top: '50%', left: '50%'}}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default Webpage;
