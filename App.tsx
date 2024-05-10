import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Authenticate from './src/screens/Authenticate';
import HomeScreen from './src/screens/Home';
import Transactions from './src/screens/Transaction';
import theme from './src/theme';
import codePush from 'react-native-code-push';
import AuthFailed from './src/modals/auth-failed';
import CashWithdrawal from './src/screens/CashWithdrawal';
import BalanceEnquiry from './src/screens/BalanceEnquiry';
import MiniStatement from './src/screens/MiniStatement';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthFailed />
      <NavigationContainer>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Authenticate"
                component={Authenticate}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Transactions"
                component={Transactions}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="CashWithdrawal"
                component={CashWithdrawal}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="BalanceEnquiry"
                component={BalanceEnquiry}
                options={{
                  title: 'Balance Enquiry',
                }}
              />
              <Stack.Screen
                name="MiniStatement"
                component={MiniStatement}
                options={{
                  title: 'Mini Statement',
                }}
              />
            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default codePush(App);
