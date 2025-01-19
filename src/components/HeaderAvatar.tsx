import React from 'react';
import {Menu, Avatar} from 'react-native-paper';
import {Pressable, StyleSheet} from 'react-native';
import useSessionStore from '../store/useSessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const HeaderAvatar = () => {
  const [visible, setVisible] = React.useState(false);

  const {user} = useSessionStore(state => state);

  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  async function handleLogout() {
    closeMenu();
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }

  if (!user) return null;

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Pressable onPress={openMenu}>
          <Avatar.Image
            style={styles.avatar}
            size={40}
            source={{uri: user.avatar}}
          />
        </Pressable>
      }
      contentStyle={{marginTop: 5, backgroundColor: 'white'}}
      anchorPosition="bottom">
      <Menu.Item onPress={handleLogout} leadingIcon="logout" title="Logout" />
    </Menu>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 10,
  },
});

export default HeaderAvatar;
