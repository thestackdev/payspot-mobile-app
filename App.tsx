import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Authenticate from './src/screens/Authenticate';
import HomeScreen from './src/screens/Home';
import Transactions from './src/screens/Transaction';
import theme from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
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
            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
