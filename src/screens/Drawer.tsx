import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTheme, Avatar} from 'react-native-paper';
import AEPSScreen from './drawer-screens/AEPSScreen';
import DMTScreen from './drawer-screens/DMTScreen';
import HeaderAvatar from '../components/HeaderAvatar';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Text, StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import Webpage from './drawer-screens/Webpage';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const theme = useTheme();

  const sidebarItems = [
    {
      name: 'Dashboard',
      url: '/home',
    },
    {
      name: 'Services',
      children: [
        {
          name: 'Electricity Bills',
          url: '',
        },
        {
          name: 'PPI Wallet',
          url: '',
        },
        {
          name: 'BBPS',
          url: '',
        },
        {
          name: 'Mobile Recharge',
          url: '',
        },
        {
          name: 'DTH',
          url: '',
        },
        {
          name: 'Credit Card',
          url: '',
        },
        {
          name: 'AEPS',
          url: '',
        },
        {
          name: 'LIC',
          url: '',
        },
        {
          name: 'KYC Money Transfer',
          url: '',
        },
        {
          name: 'Domestic Money Transfer',
          url: '',
        },
        {
          name: 'CMS',
          url: '',
        },
      ],
    },
    {
      name: 'Dist Topup',
      url: '',
    },
    {
      name: 'Reports',
      children: [
        {
          name: 'Transactions',
          url: '',
        },
        {
          name: 'Ledger',
          url: '',
        },
        {
          name: 'AEPS Wallet Ledger',
          url: '',
        },
        {
          name: 'Overall Summary',
          url: '',
        },
        {
          name: 'Refund Pending',
          url: '',
        },
      ],
    },
    {
      name: 'Link & Pay',
      children: [
        {
          name: 'Online Value Requests',
          url: '',
        },
        {
          name: 'History Request Link',
          url: '',
        },
      ],
    },
    {
      name: 'Support',
      url: '',
    },
    {
      name: 'Account',
      url: '',
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: theme.colors.background}}>
      <View style={styles.profileSection}>
        <Avatar.Image
          size={64}
          source={{uri: 'https://example.com/user-avatar.png'}}
        />
        <Text style={[styles.username, {color: theme.colors.text}]}>
          John Doe
        </Text>
        <Text style={{color: theme.colors.text, fontSize: 12}}>
          john.doe@example.com
        </Text>
      </View>
      <View style={{padding: 12}}>
        <Text style={styles.sectionTitle}>Services</Text>
        <DrawerItem
          label="Dashboard"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} size={20} icon="view-dashboard" /> // Reduced size
          )}
          onPress={() => props.navigation.navigate('Webpage', {url: '/home'})}
        />
        <DrawerItem
          label="Ledger"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} size={20} icon="book" /> // Reduced size
          )}
          onPress={() => props.navigation.navigate('Webpage', {url: '/ledger'})}
        />
        <DrawerItem
          label="AEPS"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} size={20} icon="fingerprint" /> // Reduced size
          )}
          onPress={() => props.navigation.navigate('AEPSScreen')}
        />
        <DrawerItem
          label="Domestic Money Transfer"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} size={20} icon="cash-multiple" /> // Reduced size
          )}
          onPress={() => props.navigation.navigate('Webpage', {url: '/dmt'})}
        />

        <Text style={styles.sectionTitle}>Other</Text>
        <DrawerItem
          label="Settings"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} size={20} icon="cog" /> // Reduced size
          )}
          onPress={() => console.log('Navigate to Settings')}
        />
        <DrawerItem
          label="Help & Support"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} size={20} icon="help-circle" /> // Reduced size
          )}
          onPress={() => console.log('Navigate to Help')}
        />
      </View>
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          labelStyle={{fontSize: 14, marginLeft: -10}} // Adjusted marginLeft
          icon={({color}) => (
            <List.Icon color={color} icon="logout" /> // Reduced size
          )}
          onPress={() => console.log('Logout pressed')}
        />
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
            color: theme.colors.text,
          }}>
          App Version 1.0.0
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerScreen() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Webpage"
        component={Webpage}
        options={{
          title: 'Dashboard',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <HeaderAvatar />,
        }}
      />
      <Drawer.Screen
        name="AEPSScreen"
        component={AEPSScreen}
        options={{
          title: 'AEPS',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <HeaderAvatar />,
        }}
      />
      <Drawer.Screen
        name="DMTScreen"
        component={DMTScreen}
        options={{
          title: 'DMT',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <HeaderAvatar />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});
