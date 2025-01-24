import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTheme, Avatar, List} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Text, StyleSheet} from 'react-native';
import Webpage from './drawer-screens/Webpage';
import AEPSScreen from './drawer-screens/AEPSScreen';
import useSessionStore from '../store/useSessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const theme = useTheme();
  const {user} = useSessionStore(state => state);

  const sidebarItems = [
    {
      name: 'Dashboard',
      url: '/home',
      icon: 'view-dashboard',
    },
    {
      name: 'Services',
      icon: 'widgets',
      children: [
        {
          name: 'Electricity Bills',
          url: '/home',
          icon: 'flash',
        },
        {
          name: 'PPI Wallet',
          url: '/home',
          icon: 'wallet',
        },
        {
          name: 'BBPS',
          url: '/m_recharge',
          icon: 'bank',
        },
        {
          name: 'Mobile Recharge',
          url: '/home',
          icon: 'cellphone',
        },
        {
          name: 'DTH',
          url: '/home',
          icon: 'satellite-variant',
        },
        {
          name: 'Credit Card',
          url: '/home',
          icon: 'credit-card',
        },
        {
          name: 'AEPS',
          url: '/home',
          icon: 'fingerprint',
        },
        {
          name: 'LIC',
          url: '/home',
          icon: 'lifebuoy',
        },
        {
          name: 'KYC Money Transfer',
          url: '/home',
          icon: 'account-convert',
        },
        {
          name: 'Domestic Money Transfer',
          url: '/dmt',
          icon: 'cash-multiple',
        },
        {
          name: 'CMS',
          url: '/home',
          icon: 'chart-bar',
        },
      ],
    },
    {
      name: 'Dist Topup',
      url: '/home',
      icon: 'cart',
    },
    {
      name: 'Reports',
      icon: 'chart-line',
      children: [
        {
          name: 'Transactions',
          url: '/transactions',
          icon: 'swap-horizontal',
        },
        {
          name: 'Ledger',
          url: '/ledger',
          icon: 'book',
        },
        {
          name: 'AEPS Wallet Ledger',
          url: '/home',
          icon: 'wallet',
        },
        {
          name: 'Overall Summary',
          url: '/home',
          icon: 'chart-pie',
        },
        {
          name: 'Refund Pending',
          url: '/home',
          icon: 'clock',
        },
      ],
    },
    {
      name: 'Link & Pay',
      icon: 'link',
      children: [
        {
          name: 'Online Value Requests',
          url: '/home',
          icon: 'link-variant',
        },
        {
          name: 'History Request Link',
          url: '/home',
          icon: 'history',
        },
      ],
    },
    {
      name: 'Support',
      url: '/home',
      icon: 'help-circle',
    },
    {
      name: 'Account',
      url: '/home',
      icon: 'account',
    },
  ];

  async function handleLogout() {
    await AsyncStorage.clear();
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }

  const handleNavigation = item => {
    if (item.name === 'AEPS') {
      props.navigation.navigate('AEPSScreen');
    } else {
      props.navigation.navigate('Webpage', {url: item.url, title: item.name});
    }
  };

  const renderDrawerItem = (item, index) => {
    if (item.children) {
      return (
        <List.Accordion
          key={index}
          title={item.name}
          left={props => <List.Icon {...props} icon={item.icon} />}>
          {item.children.map((child, childIndex) => (
            <DrawerItem
              key={childIndex}
              label={child.name}
              labelStyle={{fontSize: 14, marginLeft: -10}}
              icon={({color}) => (
                <List.Icon color={color} size={20} icon={child.icon} />
              )}
              onPress={() => handleNavigation(child)}
            />
          ))}
        </List.Accordion>
      );
    } else {
      return (
        <DrawerItem
          key={index}
          label={item.name}
          labelStyle={{fontSize: 14, marginLeft: -10}}
          icon={({color}) => (
            <List.Icon color={color} size={20} icon={item.icon} />
          )}
          onPress={() => handleNavigation(item)}
        />
      );
    }
  };

  if (!user) return null;

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: theme.colors.background}}>
      <View style={styles.profileSection}>
        <Avatar.Image size={64} source={{uri: user.avatar}} />
        <Text style={[styles.username, {color: theme.colors.onSurface}]}>
          {user.name}
        </Text>
        <Text style={{color: theme.colors.onSurface, fontSize: 12}}>
          ID: PR000{user.id}
        </Text>
        <Text style={{color: theme.colors.onSurface, fontSize: 12}}>
          Current Balance: ₹{user.current_balance}
        </Text>
        <Text style={{color: theme.colors.onSurface, fontSize: 12}}>
          AEPS Wallet: ₹{user.last_credit_balance}
        </Text>
      </View>
      <View style={{padding: 12}}>
        {sidebarItems.map((item, index) => renderDrawerItem(item, index))}
      </View>
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          labelStyle={{fontSize: 14, marginLeft: -10}}
          icon={({color}) => <List.Icon color={color} icon="logout" />}
          onPress={handleLogout}
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
        options={({route}) => ({title: route.params?.title || 'Dashboard'})}
      />
      <Drawer.Screen
        name="AEPSScreen"
        component={AEPSScreen}
        options={{title: 'AEPS'}}
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
