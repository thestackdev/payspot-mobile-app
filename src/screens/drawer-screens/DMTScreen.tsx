import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {BASE_URL} from '../../utils/data';
import {View, Text, ActivityIndicator} from 'react-native';
import useSessionStore from '../../store/useSessionStore';

const DMTScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {session} = useSessionStore(state => state);

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

  const xsrfToken =
    'eyJpdiI6IjNoVCtpTDFEU2lRekZzc01icTRQOGc9PSIsInZhbHVlIjoiUnJVNVYwWVRjblVmeTNQdCtlVG56azNicEsrODlUWjE4dHQvL0V5ekVHOVUyTnlCVlZGdDEzK1A3REp5bUJGYitCYStra3VLSzgxUjMxNElFM0F3SDZmc2Nuek8ydjREV0lXNGtOR05ZaW4xQUdsU0RsenlPRkpMd1dKd21idmsiLCJtYWMiOiI1OGIyZjRkY2FmZmJmOTgyMTVkODc2MThhMDAwYTVhMzc3MTg3MDM0NTFhM2RkMWY5NGRiNzMxMGM4NjdhNWVkIiwidGFnIjoiIn0=';

  const cookies = {
    payspot_session: session,
  };

  const cookieString = Object.entries(cookies)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('; ');

  const INJECTED_JAVASCRIPT = `
    window.onerror = function(message, source, lineno, colno, error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message, source, lineno, colno}));
    };
    document.addEventListener('DOMContentLoaded', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'loaded', content: document.documentElement.innerHTML}));
    });
    true;
  `;

  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{
          uri: `${BASE_URL}/dmt`,
          headers: {
            Cookie: cookieString,
            'X-XSRF-TOKEN': xsrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            Accept: '*/*',
            'Content-Type': 'application/json',
            Referer: BASE_URL,
          },
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
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

export default DMTScreen;
