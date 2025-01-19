import 'react-native-gesture-handler';
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
import KYCAuth from './src/screens/KYCAuth';
import DomesticMoneyTransfer from './src/screens/dmt/DomesticMoneyTransfer';
import CheckPhoneNumberForDMT from './src/screens/dmt/CheckPhoneNumberForDMT';
import Login from './src/screens/Login';
import Otp from './src/screens/Otp';
import useSessionStore from './src/store/useSessionStore';
import Spinner from './src/components/Spinner';
import DrawerScreen from './src/screens/Drawer';

const Stack = createNativeStackNavigator();

function App() {
  const {sessionLoaded, loadSession, session, user} = useSessionStore(
    state => state,
  );
  const [initialRouteName, setInitialRouteName] = React.useState('');

  React.useEffect(() => {
    if (!sessionLoaded) loadSession();
  }, [sessionLoaded]);

  React.useEffect(() => {
    if (sessionLoaded) {
      if (session && user) setInitialRouteName('Dashboard');
      else setInitialRouteName('Login');
    }
  }, [sessionLoaded]);

  if (!sessionLoaded || !initialRouteName) {
    return <Spinner />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <Stack.Navigator initialRouteName={initialRouteName}>
              <Stack.Screen
                name="DrawerScreen"
                component={DrawerScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="OTP"
                component={Otp}
                options={{headerShown: false}}
              />
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
                name="KYCAuth"
                component={KYCAuth}
                options={{title: 'KYC Verification'}}
              />
              <Stack.Screen
                name="CashWithdrawal"
                component={CashWithdrawal}
                options={{
                  title: 'Cash Withdrawal',
                }}
              />
              <Stack.Screen
                name="CheckPhoneNumberForDMT"
                component={CheckPhoneNumberForDMT}
                options={{
                  title: 'Check Phone Number For DMT',
                }}
              />
              <Stack.Screen
                name="DomesticMoneyTransfer"
                component={DomesticMoneyTransfer}
                options={{
                  title: 'Domestic Money Transfer',
                }}
              />
            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

// export default codePush({
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//   installMode: codePush.InstallMode.IMMEDIATE,
//   updateDialog: true,
//   mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
// })(App);
export default App;
