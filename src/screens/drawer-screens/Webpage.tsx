import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {View, ActivityIndicator} from 'react-native';
import useSessionStore from '../../store/useSessionStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Webpage'>;

const Webpage = ({navigation, route}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const {token, session} = useSessionStore(state => state);
  const {url = '/home'} = route.params || {};

  const INJECTED_JAVASCRIPT = `
  (function() {
    // Set cookie with proper attributes first
    document.cookie = 'payspot_app_session=${session}; domain=.payspot.co.in; path=/; SameSite=None; Secure';
    
    // Headers injection
    const injectHeaders = {
      'Authorization': 'Bearer ${token}',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
      init = init || {};
      init.headers = {...init.headers, ...injectHeaders};
      return originalFetch(resource, init);
    };

    // Override XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      originalOpen.apply(this, arguments);
      for (const [key, value] of Object.entries(injectHeaders)) {
        this.setRequestHeader(key, value);
      }
    };
  })();
`;

  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        originWhitelist={['*']}
        source={{
          uri: `https://payspot.co.in${url}?source=mobile`,
          headers: {
            Authorization: `Bearer ${token}`,
            Cookie: `payspot_app_session=${session}; SameSite=None; Secure`,
          },
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        webviewDebuggingEnabled={true}
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
