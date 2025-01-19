import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../../types';
import axios from 'axios';
import {BASE_URL} from '../utils/data';

interface SessionStore {
  user: User | null;
  session: string | null;
  token: string | null;
  sessionLoaded: boolean;
  setUser: (user: User) => void;
  setSession: (session: string) => void;
  setToken: (token: string) => void;
  loadSession: () => void;
}

const useSessionStore = create<SessionStore>(set => ({
  user: null,
  session: null,
  token: null,
  sessionLoaded: false,
  setUser: async user => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({user});
  },
  setSession: async session => {
    await AsyncStorage.setItem('session', session);
    set({session});
  },
  setToken: async token => {
    await AsyncStorage.setItem('token', token);
    set({token});
  },
  loadSession: async () => {
    const session = await AsyncStorage.getItem('session');
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    set({
      session,
      user: user ? JSON.parse(user) : null,
      token,
      sessionLoaded: true,
    });
    axios.defaults.baseURL = BASE_URL;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log(`Bearer ${token}`);
  },
}));

export default useSessionStore;
