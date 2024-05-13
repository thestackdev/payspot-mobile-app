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
import CashWithdrawal from './src/screens/CashWithdrawal';

const Stack = createNativeStackNavigator();

function App() {
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
              <Stack.Screen name="Transactions" component={Transactions} />
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

export default codePush(App);
