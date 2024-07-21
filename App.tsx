import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {Button, IconButton, PaperProvider} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Authenticate from './src/screens/Authenticate';
import HomeScreen from './src/screens/Home';
import Transactions from './src/screens/Transaction';
import theme from './src/theme';
import codePush from 'react-native-code-push';
import CashWithdrawal from './src/screens/CashWithdrawal';
import SelectBank from './src/screens/SelectBank';
import {Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';

const Stack = createNativeStackNavigator();

function App() {
  React.useEffect(() => {
    VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded) {
        Linking.openURL(res.storeUrl);
      }
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Authenticate" component={Authenticate} />
              <Stack.Screen
                name="Transactions"
                component={Transactions}
                options={({navigation}) => ({
                  title: 'Transactions',
                  headerLeft: () => (
                    <IconButton
                      icon="arrow-left"
                      onPress={() => {
                        navigation.reset({
                          index: 0,
                          routes: [{name: 'Home'}],
                        });
                      }}
                    />
                  ),
                })}
              />
              <Stack.Screen
                name="SelectBank"
                component={SelectBank}
                options={{
                  animation: 'none',
                  title: 'Select Bank',
                }}
              />
              <Stack.Screen
                name="CashWithdrawal"
                component={CashWithdrawal}
                options={{
                  title: 'Cash Withdrawal',
                }}
              />
            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: true,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
})(App);
// export default App;
